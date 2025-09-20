import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  FileText, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  GraduationCap
} from "lucide-react";

const requests = [
  {
    id: 1,
    type: "Congé payé",
    description: "Vacances d'automne",
    startDate: "2024-10-15",
    endDate: "2024-10-20",
    duration: "5 jours",
    status: "En attente",
    statusIcon: Clock,
    statusColor: "bg-warning text-warning-foreground",
    requestDate: "2024-10-01",
    approver: "Sophie Martin"
  },
  {
    id: 2,
    type: "Attestation de travail",
    description: "Pour démarche administrative",
    startDate: "",
    endDate: "",
    duration: "",
    status: "Approuvé",
    statusIcon: CheckCircle,
    statusColor: "bg-success text-success-foreground",
    requestDate: "2024-09-28",
    approver: "Sophie Martin"
  },
  {
    id: 3,
    type: "Formation",
    description: "Formation React Advanced",
    startDate: "2024-11-05",
    endDate: "2024-11-07",
    duration: "3 jours",
    status: "En cours",
    statusIcon: AlertCircle,
    statusColor: "bg-info text-info-foreground",
    requestDate: "2024-09-15",
    approver: "Thomas Leroy"
  },
  {
    id: 4,
    type: "Réclamation",
    description: "Problème badge d'accès",
    startDate: "",
    endDate: "",
    duration: "",
    status: "Résolu",
    statusIcon: CheckCircle,
    statusColor: "bg-success text-success-foreground",
    requestDate: "2024-09-20",
    approver: "Service IT"
  }
];

const quickRequestTypes = [
  {
    title: "Demande de congé",
    description: "Vacances, RTT, congé maladie",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Attestation",
    description: "Attestation de travail, salaire",
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    title: "Formation",
    description: "Demande de formation",
    icon: GraduationCap,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Réclamation",
    description: "Signaler un problème",
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

export function RequestsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes demandes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos demandes RH et suivez leur avancement
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-corporate">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Quick actions */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Actions rapides</span>
          </CardTitle>
          <CardDescription>
            Créez rapidement une nouvelle demande
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickRequestTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col space-y-2 transition-smooth hover:shadow-md hover:scale-105"
                >
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <Icon className={`w-6 h-6 ${type.color}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{type.title}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Historique des demandes</span>
              </CardTitle>
              <CardDescription>
                Toutes vos demandes avec leur statut actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => {
                  const StatusIcon = request.statusIcon;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border transition-smooth hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.type}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          {request.startDate && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Du {request.startDate} au {request.endDate}</span>
                              <span>•</span>
                              <span>{request.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>Demandé le {request.requestDate}</span>
                            <span>•</span>
                            <span>Responsable: {request.approver}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={request.statusColor}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {request.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-warning" />
                <span>Demandes en attente</span>
              </CardTitle>
              <CardDescription>
                Demandes qui nécessitent une validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => r.status === "En attente").map((request) => {
                  const StatusIcon = request.statusIcon;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-warning" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.type}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          {request.startDate && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Du {request.startDate} au {request.endDate}</span>
                              <span>•</span>
                              <span>{request.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={request.statusColor}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {request.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Demandes approuvées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => r.status === "Approuvé" || r.status === "Résolu").map((request) => {
                  const StatusIcon = request.statusIcon;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-success" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.type}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                      </div>
                      
                      <Badge className={request.statusColor}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {request.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span>Demandes refusées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande refusée</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}