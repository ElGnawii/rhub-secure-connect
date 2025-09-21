import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Calendar,
  FileText,
  GraduationCap,
  AlertCircle,
  MessageSquare,
  User,
  Edit2,
  Trash2
} from 'lucide-react';
import { WorkflowRequest } from '@/contexts/WorkflowContext';

interface RequestDetailsProps {
  request: WorkflowRequest;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'leave': return Calendar;
    case 'training': return GraduationCap;
    case 'certificate': return FileText;
    case 'complaint': return AlertCircle;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'leave': return 'text-primary';
    case 'training': return 'text-success';
    case 'certificate': return 'text-info';
    case 'complaint': return 'text-warning';
    default: return 'text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-muted text-muted-foreground';
    case 'submitted': return 'bg-info text-info-foreground';
    case 'in_progress': return 'bg-warning text-warning-foreground';
    case 'approved': return 'bg-success text-success-foreground';
    case 'rejected': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Brouillon';
    case 'submitted': return 'Soumise';
    case 'in_progress': return 'En cours';
    case 'approved': return 'Approuvée';
    case 'rejected': return 'Refusée';
    default: return status;
  }
};

export function RequestDetails({ request, onEdit, onDelete, onBack }: RequestDetailsProps) {
  const Icon = getTypeIcon(request.type);
  
  // Calculate progress
  const totalSteps = request.steps.length;
  const completedSteps = request.steps.filter(step => step.status === 'approved').length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Retour aux demandes
        </Button>
        {request.status === 'draft' && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" onClick={onDelete} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg bg-primary/10`}>
                <Icon className={`w-8 h-8 ${getTypeColor(request.type)}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">{request.title}</CardTitle>
                <CardDescription>
                  Créée le {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </div>
            </div>
            <Badge className={getStatusColor(request.status)} variant="secondary">
              {getStatusLabel(request.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{request.description}</p>
          </div>

          {(request.startDate || request.endDate) && (
            <div>
              <h3 className="font-semibold mb-2">Période demandée</h3>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {request.startDate && <span>Du {new Date(request.startDate).toLocaleDateString('fr-FR')}</span>}
                {request.endDate && <span>au {new Date(request.endDate).toLocaleDateString('fr-FR')}</span>}
                {request.duration && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{request.duration}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {request.metadata && Object.keys(request.metadata).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Informations supplémentaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.type === 'leave' && request.metadata.leaveType && (
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">Type de congé</span>
                    <p className="font-medium">{request.metadata.leaveType}</p>
                  </div>
                )}
                
                {request.type === 'training' && (
                  <>
                    {request.metadata.provider && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Organisme</span>
                        <p className="font-medium">{request.metadata.provider}</p>
                      </div>
                    )}
                    {request.metadata.cost && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Coût</span>
                        <p className="font-medium">{request.metadata.cost}€</p>
                      </div>
                    )}
                    {request.metadata.location && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Lieu</span>
                        <p className="font-medium">{request.metadata.location}</p>
                      </div>
                    )}
                    {request.metadata.justification && (
                      <div className="p-3 bg-accent/20 rounded-lg md:col-span-2">
                        <span className="text-sm font-medium text-muted-foreground">Justification</span>
                        <p className="font-medium">{request.metadata.justification}</p>
                      </div>
                    )}
                  </>
                )}

                {request.type === 'certificate' && (
                  <>
                    {request.metadata.certificateType && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Type d'attestation</span>
                        <p className="font-medium">{request.metadata.certificateType}</p>
                      </div>
                    )}
                    {request.metadata.purpose && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Utilisation</span>
                        <p className="font-medium">{request.metadata.purpose}</p>
                      </div>
                    )}
                  </>
                )}

                {request.type === 'complaint' && (
                  <>
                    {request.metadata.category && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
                        <p className="font-medium">{request.metadata.category}</p>
                      </div>
                    )}
                    {request.metadata.urgency && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Urgence</span>
                        <p className="font-medium capitalize">{request.metadata.urgency}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {request.steps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Workflow d'approbation</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {completedSteps}/{totalSteps} étapes complétées
                  </span>
                  <div className="w-24">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {request.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'approved' ? 'bg-success text-success-foreground' :
                      step.status === 'rejected' ? 'bg-destructive text-destructive-foreground' :
                      step.order === request.currentStep ? 'bg-warning text-warning-foreground animate-pulse' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {step.status === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                       step.status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                       step.order === request.currentStep ? <Clock className="w-5 h-5" /> :
                       <span className="text-sm font-semibold">{step.order}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{step.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {step.approver}
                        </Badge>
                      </div>
                      
                      {step.comment && (
                        <div className="flex items-start space-x-2 mt-2 p-2 bg-accent/30 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{step.comment}</p>
                        </div>
                      )}
                      
                      {step.processedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Traité le {new Date(step.processedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    
                    {index < request.steps.length - 1 && (
                      <div className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Dernière mise à jour: {new Date(request.updatedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
              <span>ID: {request.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}