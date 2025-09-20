import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Download, 
  Eye, 
  Search,
  Calendar,
  Euro,
  FileText,
  Lock
} from "lucide-react";

const payslips = [
  {
    id: 1,
    month: "Octobre 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-10-31",
    status: "Disponible",
    isPaid: true
  },
  {
    id: 2,
    month: "Septembre 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-09-30",
    status: "Disponible",
    isPaid: true
  },
  {
    id: 3,
    month: "Août 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-08-31",
    status: "Disponible",
    isPaid: true
  },
  {
    id: 4,
    month: "Juillet 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-07-31",
    status: "Disponible",
    isPaid: true
  },
  {
    id: 5,
    month: "Juin 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-06-30",
    status: "Disponible",
    isPaid: true
  },
  {
    id: 6,
    month: "Mai 2024",
    grossSalary: "4,500.00",
    netSalary: "3,245.67",
    date: "2024-05-31",
    status: "Disponible",
    isPaid: true
  }
];

const currentYearStats = {
  totalGross: "45,000.00",
  totalNet: "32,456.70",
  taxesPaid: "12,543.30",
  monthsProcessed: 10
};

export function PayslipSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulletins de paie</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et téléchargez vos fiches de paie sécurisées
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">Accès sécurisé</span>
        </div>
      </div>

      {/* Annual summary */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Euro className="w-5 h-5 text-primary" />
            <span>Résumé annuel 2024</span>
          </CardTitle>
          <CardDescription>
            Vue d'ensemble de vos revenus sur l'année en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Salaire brut total</p>
              <p className="text-2xl font-bold text-foreground">{currentYearStats.totalGross}€</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Salaire net total</p>
              <p className="text-2xl font-bold text-success">{currentYearStats.totalNet}€</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Charges & impôts</p>
              <p className="text-2xl font-bold text-muted-foreground">{currentYearStats.taxesPaid}€</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Mois traités</p>
              <p className="text-2xl font-bold text-primary">{currentYearStats.monthsProcessed}/12</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and filters */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Rechercher un bulletin</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par mois ou année..."
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                2024
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                2023
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payslips list */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Vos bulletins de paie</span>
          </CardTitle>
          <CardDescription>
            Cliquez sur un bulletin pour le consulter ou le télécharger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payslips.map((payslip) => (
              <div 
                key={payslip.id} 
                className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border transition-smooth hover:bg-accent/50 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{payslip.month}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Brut: {payslip.grossSalary}€</span>
                      <span>•</span>
                      <span className="text-success font-medium">Net: {payslip.netSalary}€</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className="bg-success/10 text-success border-success/20">
                    {payslip.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                    <Button size="sm" className="gradient-primary text-primary-foreground">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security notice */}
      <Card className="border-info/20 bg-info/5">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-info mt-0.5" />
            <div>
              <h4 className="font-semibold text-info">Sécurité et confidentialité</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Vos bulletins de paie sont protégés par chiffrement et ne sont accessibles qu'avec votre authentification. 
                Les PDF générés sont protégés par mot de passe et seront supprimés automatiquement après téléchargement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}