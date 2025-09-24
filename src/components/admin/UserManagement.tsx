import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Edit, Trash2, Shield, User } from "lucide-react";
import { useAdmin, User as UserType } from '@/contexts/AdminContext';

const roleLabels = {
  admin: 'Administrateur',
  manager: 'Manager',
  hr: 'Ressources Humaines',
  employee: 'Employé',
  director: 'Directeur',
  training: 'Formation',
  budget: 'Budget'
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-destructive text-destructive-foreground';
    case 'manager': return 'bg-primary text-primary-foreground';
    case 'hr': return 'bg-info text-info-foreground';
    case 'director': return 'bg-warning text-warning-foreground';
    case 'training': return 'bg-success text-success-foreground';
    case 'budget': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function UserManagement() {
  const { users, createUser, updateUser, deleteUser } = useAdmin();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee' as UserType['role'],
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'employee',
      isActive: true
    });
  };

  const handleCreate = () => {
    if (formData.username && formData.password && formData.firstName && formData.lastName && formData.email) {
      createUser(formData);
      resetForm();
      setIsCreateDialogOpen(false);
    }
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedUser && formData.username && formData.firstName && formData.lastName && formData.email) {
      updateUser(selectedUser.id, formData);
      resetForm();
      setSelectedUser(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = (user: UserType) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      deleteUser(user.id);
    }
  };

  const UserForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@company.com"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="jdoe"
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="********"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserType['role'] })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Compte actif</Label>
      </div>
    </div>
  );

  return (
    <Card className="gradient-card shadow-corporate">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Gestion des utilisateurs</span>
            </CardTitle>
            <CardDescription>
              Créez, modifiez et gérez les comptes utilisateurs
            </CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau compte utilisateur.
                </DialogDescription>
              </DialogHeader>
              <UserForm />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => { resetForm(); setIsCreateDialogOpen(false); }}>
                  Annuler
                </Button>
                <Button onClick={handleCreate}>
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">
                        Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-sm">{user.username}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={user.isActive ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <UserForm isEdit />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => { resetForm(); setSelectedUser(null); setIsEditDialogOpen(false); }}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}