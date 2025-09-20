import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from "lucide-react";

const stats = [
  {
    title: "Congés restants",
    value: "18 jours",
    description: "Sur 25 jours annuels",
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    title: "Demandes en cours",
    value: "2",
    description: "En attente de validation",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    title: "Bulletins disponibles",
    value: "12",
    description: "Année en cours",
    icon: CreditCard,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Messages non lus",
    value: "3",
    description: "Communications RH",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10"
  }
];

const recentRequests = [
  {
    id: 1,
    type: "Congé payé",
    date: "15-20 Oct 2024",
    status: "En attente",
    statusColor: "bg-warning text-warning-foreground"
  },
  {
    id: 2,
    type: "Attestation de travail",
    date: "12 Oct 2024",
    status: "Approuvé",
    statusColor: "bg-success text-success-foreground"
  },
  {
    id: 3,
    type: "Formation",
    date: "8 Oct 2024",
    status: "En cours",
    statusColor: "bg-info text-info-foreground"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Réunion d'équipe",
    date: "Demain 14:00",
    icon: Users
  },
  {
    id: 2,
    title: "Entretien annuel",
    date: "25 Oct 2024",
    icon: FileText
  },
  {
    id: 3,
    title: "Formation sécurité",
    date: "30 Oct 2024",
    icon: AlertCircle
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="gradient-primary rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Bonjour Marie ! 👋</h1>
        <p className="text-primary-foreground/80">
          Voici un aperçu de votre espace RH. Vous avez 2 demandes en attente et 3 nouvelles notifications.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="gradient-card shadow-corporate transition-smooth hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <Card className="gradient-card shadow-corporate">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Demandes récentes</span>
            </CardTitle>
            <CardDescription>
              Suivez l'état de vos dernières demandes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{request.type}</p>
                  <p className="text-sm text-muted-foreground">{request.date}</p>
                </div>
                <Badge className={request.statusColor}>
                  {request.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Voir toutes les demandes
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming events */}
        <Card className="gradient-card shadow-corporate">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Événements à venir</span>
            </CardTitle>
            <CardDescription>
              Vos prochains rendez-vous et échéances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full mt-4">
              Voir le calendrier
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Actions rapides</span>
          </CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col space-y-2 gradient-primary text-primary-foreground shadow-corporate">
              <Calendar className="w-6 h-6" />
              <span>Demander un congé</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 transition-smooth hover:shadow-md">
              <FileText className="w-6 h-6" />
              <span>Attestation de travail</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 transition-smooth hover:shadow-md">
              <CreditCard className="w-6 h-6" />
              <span>Dernière fiche de paie</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}