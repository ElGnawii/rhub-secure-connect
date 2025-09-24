import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workflow, Plus, Edit, Trash2, Calendar, GraduationCap, FileText, AlertCircle, ArrowRight } from "lucide-react";
import { useAdmin, WorkflowValidator } from '@/contexts/AdminContext';

const workflowTypes = {
  leave: { label: 'Congés', icon: Calendar, color: 'text-primary' },
  training: { label: 'Formations', icon: GraduationCap, color: 'text-success' },
  certificate: { label: 'Attestations', icon: FileText, color: 'text-info' },
  complaint: { label: 'Réclamations', icon: AlertCircle, color: 'text-warning' }
};

export function WorkflowManagement() {
  const { validators, users, createValidator, updateValidator, deleteValidator, getValidatorsByWorkflow } = useAdmin();
  const [selectedValidator, setSelectedValidator] = useState<WorkflowValidator | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    workflowType: 'leave' as WorkflowValidator['workflowType'],
    stepName: '',
    validatorId: '',
    validatorName: '',
    order: 1
  });

  const resetForm = () => {
    setFormData({
      workflowType: 'leave',
      stepName: '',
      validatorId: '',
      validatorName: '',
      order: 1
    });
  };

  const handleValidatorChange = (validatorId: string) => {
    const user = users.find(u => u.id === validatorId);
    if (user) {
      setFormData({
        ...formData,
        validatorId,
        validatorName: `${user.firstName} ${user.lastName}`
      });
    }
  };

  const handleCreate = () => {
    if (formData.stepName && formData.validatorId && formData.validatorName) {
      createValidator(formData);
      resetForm();
      setIsCreateDialogOpen(false);
    }
  };

  const handleEdit = (validator: WorkflowValidator) => {
    setSelectedValidator(validator);
    setFormData({
      workflowType: validator.workflowType,
      stepName: validator.stepName,
      validatorId: validator.validatorId,
      validatorName: validator.validatorName,
      order: validator.order
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedValidator && formData.stepName && formData.validatorId && formData.validatorName) {
      updateValidator(selectedValidator.id, formData);
      resetForm();
      setSelectedValidator(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = (validator: WorkflowValidator) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette étape de validation ?`)) {
      deleteValidator(validator.id);
    }
  };

  const WorkflowForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="workflowType">Type de workflow</Label>
        <Select value={formData.workflowType} onValueChange={(value) => setFormData({ ...formData, workflowType: value as WorkflowValidator['workflowType'] })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(workflowTypes).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="stepName">Nom de l'étape</Label>
        <Input
          id="stepName"
          value={formData.stepName}
          onChange={(e) => setFormData({ ...formData, stepName: e.target.value })}
          placeholder="ex: Validation Manager"
        />
      </div>
      
      <div>
        <Label htmlFor="validator">Validateur</Label>
        <Select value={formData.validatorId} onValueChange={handleValidatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un validateur" />
          </SelectTrigger>
          <SelectContent>
            {users.filter(u => u.isActive && u.role !== 'employee').map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="order">Ordre d'exécution</Label>
        <Input
          id="order"
          type="number"
          min="1"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
        />
      </div>
    </div>
  );

  const WorkflowTab = ({ workflowType }: { workflowType: keyof typeof workflowTypes }) => {
    const workflowValidators = getValidatorsByWorkflow(workflowType);
    const { icon: Icon, color } = workflowTypes[workflowType];

    return (
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span>Workflow {workflowTypes[workflowType].label}</span>
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setFormData({ ...formData, workflowType });
                setIsCreateDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter étape
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {workflowValidators.length === 0 ? (
            <div className="text-center py-8">
              <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune étape configurée pour ce workflow</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflowValidators.map((validator, index) => (
                <div key={validator.id}>
                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{validator.order}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{validator.stepName}</h3>
                        <p className="text-sm text-muted-foreground">{validator.validatorName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(validator)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(validator)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {index < workflowValidators.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-primary" />
            <span>Configuration des workflows</span>
          </CardTitle>
          <CardDescription>
            Configurez les étapes de validation pour chaque type de demande
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="leave" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(workflowTypes).map(([key, { label, icon: Icon }]) => (
            <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(workflowTypes).map((workflowType) => (
          <TabsContent key={workflowType} value={workflowType}>
            <WorkflowTab workflowType={workflowType as keyof typeof workflowTypes} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une étape de validation</DialogTitle>
            <DialogDescription>
              Configurez une nouvelle étape dans le workflow de validation.
            </DialogDescription>
          </DialogHeader>
          <WorkflowForm />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'étape de validation</DialogTitle>
            <DialogDescription>
              Modifiez les paramètres de cette étape de validation.
            </DialogDescription>
          </DialogHeader>
          <WorkflowForm />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => { resetForm(); setSelectedValidator(null); setIsEditDialogOpen(false); }}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}