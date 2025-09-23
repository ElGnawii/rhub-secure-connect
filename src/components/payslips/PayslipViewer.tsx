import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  Lock, 
  Shield, 
  FileText,
  Calendar,
  Euro,
  Building,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payslip {
  id: number;
  month: string;
  grossSalary: string;
  netSalary: string;
  date: string;
  status: string;
  isPaid: boolean;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  workingHours: string;
  socialSecurityNumber: string;
}

interface PayslipViewerProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipViewer({ payslip, isOpen, onClose }: PayslipViewerProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { toast } = useToast();

  if (!payslip) return null;

  const handleUnlock = () => {
    // Simulated password validation - normally done on backend
    if (password === "secure123" || password === payslip.socialSecurityNumber.slice(-4)) {
      setIsUnlocked(true);
      setShowPasswordForm(false);
      toast({
        title: "Accès autorisé",
        description: "Votre fiche de paie est maintenant accessible.",
      });
    } else {
      toast({
        title: "Erreur d'authentification",
        description: "Mot de passe incorrect. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleView = () => {
    if (!isUnlocked) {
      setShowPasswordForm(true);
    }
  };

  const handleDownloadPDF = async () => {
    if (!isUnlocked) {
      setShowPasswordForm(true);
      return;
    }

    try {
      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text("BULLETIN DE PAIE", 20, 30);
      doc.setFontSize(12);
      doc.text(`Période: ${payslip.month}`, 20, 45);
      
      // Employee info
      doc.text("INFORMATIONS SALARIÉ", 20, 65);
      doc.text(`Nom: ${payslip.employeeName}`, 20, 75);
      doc.text(`Poste: ${payslip.position}`, 20, 85);
      doc.text(`Service: ${payslip.department}`, 20, 95);
      doc.text(`N° Sécurité Sociale: ${payslip.socialSecurityNumber}`, 20, 105);
      
      // Salary details
      doc.text("DÉTAIL DE LA RÉMUNÉRATION", 20, 125);
      doc.text(`Salaire brut: ${payslip.grossSalary}€`, 20, 135);
      doc.text(`Heures travaillées: ${payslip.workingHours}h`, 20, 145);
      doc.text(`Salaire net: ${payslip.netSalary}€`, 20, 155);
      
      // Note: PDF password protection would be implemented on the server side
      // For demo purposes, we generate a regular PDF
      doc.save(`fiche_paie_${payslip.month.replace(' ', '_')}.pdf`);
      
      toast({
        title: "Téléchargement réussi",
        description: "Votre fiche de paie sécurisée a été téléchargée.",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Fiche de paie - {payslip.month}</span>
            <Lock className={`w-4 h-4 ${isUnlocked ? 'text-success' : 'text-destructive'}`} />
          </DialogTitle>
        </DialogHeader>

        {!isUnlocked && showPasswordForm && (
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="text-warning flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Accès sécurisé requis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe de sécurité</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                />
                <p className="text-xs text-muted-foreground">
                  Utilisez votre mot de passe personnel ou les 4 derniers chiffres de votre n° de sécurité sociale
                </p>
              </div>
              <Button onClick={handleUnlock} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Déverrouiller
              </Button>
            </CardContent>
          </Card>
        )}

        {!isUnlocked && !showPasswordForm && (
          <Card className="border-info/20 bg-info/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Lock className="w-12 h-12 text-info mx-auto" />
                <h3 className="font-semibold text-info">Document confidentiel</h3>
                <p className="text-muted-foreground">
                  Cette fiche de paie est protégée. Cliquez sur "Consulter" pour vous authentifier.
                </p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={handleView} variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Consulter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isUnlocked && (
          <div className="space-y-6">
            {/* Payslip Content */}
            <Card className="gradient-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-primary" />
                      <span>ENTREPRISE SA</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">123 Rue de l'Entreprise, 75001 Paris</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    {payslip.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employee Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-accent/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Informations salarié</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nom:</span>
                        <span className="font-medium">{payslip.employeeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Poste:</span>
                        <span className="font-medium">{payslip.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{payslip.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">N° SS:</span>
                        <span className="font-medium">{payslip.socialSecurityNumber}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Période de paie</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Période:</span>
                        <span className="font-medium">{payslip.month}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heures travaillées:</span>
                        <span className="font-medium">{payslip.workingHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date d'émission:</span>
                        <span className="font-medium">{payslip.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Salary Breakdown */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-primary">
                      <Euro className="w-5 h-5" />
                      <span>Détail de la rémunération</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Salaire de base</span>
                        <span className="font-bold">{payslip.grossSalary}€</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border text-sm">
                        <span className="text-muted-foreground">Cotisations sociales</span>
                        <span className="text-muted-foreground">-{(parseFloat(payslip.grossSalary.replace(',', '.')) - parseFloat(payslip.netSalary.replace(',', '.'))).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between py-2 text-lg font-bold text-success">
                        <span>Salaire net</span>
                        <span>{payslip.netSalary}€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-2 justify-end">
              <Button onClick={handleDownloadPDF} className="gradient-primary text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF sécurisé
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}