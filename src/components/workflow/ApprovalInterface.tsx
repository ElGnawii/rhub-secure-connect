import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  FileText,
  GraduationCap,
  AlertCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useWorkflow, WorkflowRequest } from '@/contexts/WorkflowContext';

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

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'urgent': return 'bg-destructive text-destructive-foreground';
    case 'high': return 'bg-warning text-warning-foreground';
    case 'medium': return 'bg-info text-info-foreground';
    case 'low': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function ApprovalInterface() {
  const { approvals, approveStep, rejectStep } = useWorkflow();
  const [selectedRequest, setSelectedRequest] = useState<WorkflowRequest | null>(null);
  const [comment, setComment] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = (request: WorkflowRequest) => {
    const currentStep = request.steps.find(step => step.order === request.currentStep);
    if (currentStep) {
      approveStep(request.id, currentStep.id, comment || undefined);
      setSelectedRequest(null);
      setComment('');
      setAction(null);
    }
  };

  const handleReject = (request: WorkflowRequest) => {
    const currentStep = request.steps.find(step => step.order === request.currentStep);
    if (currentStep && comment.trim()) {
      rejectStep(request.id, currentStep.id, comment);
      setSelectedRequest(null);
      setComment('');
      setAction(null);
    }
  };

  const pendingApprovals = approvals.filter(req => req.status === 'submitted' || req.status === 'in_progress');
  const processedApprovals = approvals.filter(req => req.status === 'approved' || req.status === 'rejected');

  if (selectedRequest) {
    const Icon = getTypeIcon(selectedRequest.type);
    const currentStep = selectedRequest.steps.find(step => step.order === selectedRequest.currentStep);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedRequest(null)}>
            ← Retour aux approbations
          </Button>
        </div>

        <Card className="gradient-card shadow-corporate">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-primary/10`}>
                  <Icon className={`w-6 h-6 ${getTypeColor(selectedRequest.type)}`} />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedRequest.title}</CardTitle>
                  <CardDescription>
                    Demandé par {selectedRequest.requesterName} le {new Date(selectedRequest.createdAt).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
              </div>
              {selectedRequest.metadata?.urgency && (
                <Badge className={getUrgencyColor(selectedRequest.metadata.urgency)}>
                  {selectedRequest.metadata.urgency === 'urgent' ? 'Urgente' : 
                   selectedRequest.metadata.urgency === 'high' ? 'Élevée' :
                   selectedRequest.metadata.urgency === 'medium' ? 'Moyenne' : 'Faible'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{selectedRequest.description}</p>
            </div>

            {(selectedRequest.startDate || selectedRequest.endDate) && (
              <div>
                <h3 className="font-semibold mb-2">Période</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {selectedRequest.startDate && <span>Du {selectedRequest.startDate}</span>}
                  {selectedRequest.endDate && <span>au {selectedRequest.endDate}</span>}
                  {selectedRequest.duration && (
                    <>
                      <span>•</span>
                      <span>{selectedRequest.duration}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedRequest.metadata && Object.keys(selectedRequest.metadata).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Informations supplémentaires</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedRequest.type === 'training' && (
                    <>
                      {selectedRequest.metadata.provider && (
                        <div>
                          <span className="font-medium">Organisme:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.provider}</p>
                        </div>
                      )}
                      {selectedRequest.metadata.cost && (
                        <div>
                          <span className="font-medium">Coût:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.cost}€</p>
                        </div>
                      )}
                      {selectedRequest.metadata.location && (
                        <div>
                          <span className="font-medium">Lieu:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.location}</p>
                        </div>
                      )}
                      {selectedRequest.metadata.justification && (
                        <div className="col-span-2">
                          <span className="font-medium">Justification:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.justification}</p>
                        </div>
                      )}
                    </>
                  )}
                  {selectedRequest.type === 'certificate' && (
                    <>
                      {selectedRequest.metadata.certificateType && (
                        <div>
                          <span className="font-medium">Type:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.certificateType}</p>
                        </div>
                      )}
                      {selectedRequest.metadata.purpose && (
                        <div>
                          <span className="font-medium">Utilisation:</span>
                          <p className="text-muted-foreground">{selectedRequest.metadata.purpose}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Workflow steps */}
            <div>
              <h3 className="font-semibold mb-4">Workflow d'approbation</h3>
              <div className="space-y-3">
                {selectedRequest.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'approved' ? 'bg-success text-success-foreground' :
                        step.status === 'rejected' ? 'bg-destructive text-destructive-foreground' :
                        step.order === selectedRequest.currentStep ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {step.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                         step.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                         step.order === selectedRequest.currentStep ? <Clock className="w-4 h-4" /> :
                         <span className="text-xs">{step.order}</span>}
                      </div>
                      <span className="font-medium">{step.name}</span>
                      <span className="text-sm text-muted-foreground">({step.approver})</span>
                    </div>
                    {step.comment && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>{step.comment}</span>
                      </div>
                    )}
                    {index < selectedRequest.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentStep && currentStep.status === 'pending' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Votre décision</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Commentaire {action === 'reject' ? '(obligatoire)' : '(optionnel)'}</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={action === 'approve' ? "Ajoutez un commentaire (optionnel)" : "Expliquez la raison du refus"}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAction('reject');
                        if (comment.trim()) handleReject(selectedRequest);
                      }}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      disabled={action === 'reject' && !comment.trim()}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Refuser
                    </Button>
                    <Button
                      onClick={() => {
                        setAction('approve');
                        handleApprove(selectedRequest);
                      }}
                      className="bg-success text-success-foreground hover:bg-success/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Approbations</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les demandes en attente d'approbation
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            En attente ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Traitées ({processedApprovals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card className="gradient-card shadow-corporate">
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande en attente d'approbation</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((request) => {
                const Icon = getTypeIcon(request.type);
                const currentStep = request.steps.find(step => step.order === request.currentStep);
                
                return (
                  <Card key={request.id} className="gradient-card shadow-corporate cursor-pointer hover:shadow-lg transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg bg-warning/10`}>
                            <Icon className={`w-6 h-6 ${getTypeColor(request.type)}`} />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Par {request.requesterName}</span>
                              <span>•</span>
                              <span>{new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                              {currentStep && (
                                <>
                                  <span>•</span>
                                  <span>Étape: {currentStep.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {request.metadata?.urgency && (
                            <Badge className={getUrgencyColor(request.metadata.urgency)}>
                              {request.metadata.urgency === 'urgent' ? 'Urgente' : 
                               request.metadata.urgency === 'high' ? 'Élevée' :
                               request.metadata.urgency === 'medium' ? 'Moyenne' : 'Faible'}
                            </Badge>
                          )}
                          <Badge className="bg-warning text-warning-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            Examiner
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedApprovals.length === 0 ? (
            <Card className="gradient-card shadow-corporate">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande traitée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processedApprovals.map((request) => {
                const Icon = getTypeIcon(request.type);
                
                return (
                  <Card key={request.id} className="gradient-card shadow-corporate">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            request.status === 'approved' ? 'bg-success/10' : 'bg-destructive/10'
                          }`}>
                            <Icon className={`w-6 h-6 ${getTypeColor(request.type)}`} />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Par {request.requesterName}</span>
                              <span>•</span>
                              <span>Traité le {new Date(request.updatedAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            request.status === 'approved' 
                              ? "bg-success text-success-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }>
                            {request.status === 'approved' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {request.status === 'approved' ? 'Approuvé' : 'Refusé'}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}