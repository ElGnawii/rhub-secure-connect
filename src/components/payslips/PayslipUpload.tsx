import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Users, 
  Calendar,
  AlertCircle,
  Check,
  X,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PayslipUploadData {
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  grossSalary: string;
  netSalary: string;
  workingHours: string;
  file?: File;
  notes: string;
}

interface UploadedPayslip extends PayslipUploadData {
  id: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedBy: string;
}

export function PayslipUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PayslipUploadData>({
    employeeId: "",
    employeeName: "",
    month: "",
    year: "2024",
    grossSalary: "",
    netSalary: "",
    workingHours: "",
    notes: ""
  });
  const [uploadedPayslips, setUploadedPayslips] = useState<UploadedPayslip[]>([
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Jean Dupont",
      month: "Octobre",
      year: "2024",
      grossSalary: "4500.00",
      netSalary: "3245.67",
      workingHours: "151",
      uploadDate: "2024-11-01",
      status: "approved",
      uploadedBy: "RH Manager",
      notes: "Fiche de paie standard"
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Marie Martin",
      month: "Octobre",
      year: "2024",
      grossSalary: "3800.00",
      netSalary: "2756.45",
      workingHours: "151",
      uploadDate: "2024-10-30",
      status: "pending",
      uploadedBy: "RH Manager",
      notes: "Vérification en cours"
    }
  ]);
  
  const { toast } = useToast();

  const handleInputChange = (field: keyof PayslipUploadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier PDF.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.employeeId || !formData.employeeName || !formData.month || !formData.grossSalary || !formData.netSalary) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Create new payslip entry
    const newPayslip: UploadedPayslip = {
      ...formData,
      id: `${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      uploadedBy: 'RH Manager' // This would come from auth context
    };

    setUploadedPayslips(prev => [newPayslip, ...prev]);
    
    toast({
      title: "Upload réussi",
      description: `Fiche de paie pour ${formData.employeeName} ajoutée avec succès.`,
    });

    // Reset form
    setFormData({
      employeeId: "",
      employeeName: "",
      month: "",
      year: "2024",
      grossSalary: "",
      netSalary: "",
      workingHours: "",
      notes: ""
    });
    setIsOpen(false);
  };

  const handleStatusChange = (payslipId: string, newStatus: 'approved' | 'rejected') => {
    setUploadedPayslips(prev =>
      prev.map(payslip =>
        payslip.id === payslipId ? { ...payslip, status: newStatus } : payslip
      )
    );
    
    const payslip = uploadedPayslips.find(p => p.id === payslipId);
    toast({
      title: `Fiche de paie ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`,
      description: `La fiche de paie de ${payslip?.employeeName} a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejetée</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">En attente</Badge>;
    }
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Gestion des fiches de paie</span>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground">
                  <Upload className="w-4 h-4 mr-2" />
                  Nouvelle fiche
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Ajouter une fiche de paie</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">ID Employé *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        placeholder="EMP001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Nom complet *</Label>
                      <Input
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => handleInputChange('employeeName', e.target.value)}
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="month">Mois *</Label>
                      <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le mois" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Année *</Label>
                      <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grossSalary">Salaire brut (€) *</Label>
                      <Input
                        id="grossSalary"
                        type="number"
                        step="0.01"
                        value={formData.grossSalary}
                        onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                        placeholder="4500.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="netSalary">Salaire net (€) *</Label>
                      <Input
                        id="netSalary"
                        type="number"
                        step="0.01"
                        value={formData.netSalary}
                        onChange={(e) => handleInputChange('netSalary', e.target.value)}
                        placeholder="3245.67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHours">Heures travaillées</Label>
                      <Input
                        id="workingHours"
                        type="number"
                        value={formData.workingHours}
                        onChange={(e) => handleInputChange('workingHours', e.target.value)}
                        placeholder="151"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Fichier PDF</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Formats acceptés: PDF (max. 5MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Commentaires additionnels..."
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">
                      <Upload className="w-4 h-4 mr-2" />
                      Ajouter la fiche
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Uploaded Payslips Management */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Fiches de paie uploadées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedPayslips.map((payslip) => (
              <div 
                key={payslip.id}
                className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {payslip.employeeName} ({payslip.employeeId})
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{payslip.month} {payslip.year}</span>
                      <span>•</span>
                      <span>Net: {payslip.netSalary}€</span>
                      <span>•</span>
                      <span>Uploadé le {payslip.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(payslip.status)}
                  
                  {payslip.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(payslip.id, 'approved')}
                        className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(payslip.id, 'rejected')}
                        className="border-destructive/20 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}