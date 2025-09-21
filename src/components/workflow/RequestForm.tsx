import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, GraduationCap, FileText, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { useWorkflow, WorkflowRequest } from '@/contexts/WorkflowContext';
import { toast } from '@/hooks/use-toast';

interface RequestFormProps {
  type: 'leave' | 'training' | 'certificate' | 'complaint';
  onBack: () => void;
  onSubmit: () => void;
}

const requestTypeConfig = {
  leave: {
    title: 'Demande de congé',
    icon: Calendar,
    color: 'text-primary',
    fields: ['title', 'description', 'startDate', 'endDate', 'leaveType']
  },
  training: {
    title: 'Demande de formation',
    icon: GraduationCap,
    color: 'text-success',
    fields: ['title', 'description', 'startDate', 'endDate', 'provider', 'cost', 'location', 'justification']
  },
  certificate: {
    title: 'Demande d\'attestation',
    icon: FileText,
    color: 'text-info',
    fields: ['title', 'description', 'certificateType', 'purpose']
  },
  complaint: {
    title: 'Signalement/Réclamation',
    icon: AlertCircle,
    color: 'text-warning',
    fields: ['title', 'description', 'category', 'urgency']
  }
};

export function RequestForm({ type, onBack, onSubmit }: RequestFormProps) {
  const { createRequest, submitRequest } = useWorkflow();
  const config = requestTypeConfig[type];
  const Icon = config.icon;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    leaveType: '',
    provider: '',
    cost: '',
    location: '',
    justification: '',
    certificateType: '',
    purpose: '',
    category: '',
    urgency: 'medium'
  });

  const [isDraft, setIsDraft] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
    return '';
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const requestData: Omit<WorkflowRequest, 'id' | 'createdAt' | 'updatedAt'> = {
      type,
      title: formData.title,
      description: formData.description,
      requesterId: 'user1',
      requesterName: 'John Doe',
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      duration: calculateDuration() || undefined,
      status: 'draft',
      currentStep: 0,
      steps: [],
      metadata: {
        ...(type === 'leave' && { leaveType: formData.leaveType }),
        ...(type === 'training' && { 
          provider: formData.provider, 
          cost: parseFloat(formData.cost) || 0, 
          location: formData.location,
          justification: formData.justification
        }),
        ...(type === 'certificate' && { 
          certificateType: formData.certificateType, 
          purpose: formData.purpose 
        }),
        ...(type === 'complaint' && { 
          category: formData.category, 
          urgency: formData.urgency 
        })
      }
    };

    createRequest(requestData);
    setIsDraft(true);
  };

  const handleSubmitRequest = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et la description sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (type === 'leave' && (!formData.startDate || !formData.endDate)) {
      toast({
        title: "Erreur",
        description: "Les dates de début et fin sont obligatoires pour les congés",
        variant: "destructive"
      });
      return;
    }

    const requestData: Omit<WorkflowRequest, 'id' | 'createdAt' | 'updatedAt'> = {
      type,
      title: formData.title,
      description: formData.description,
      requesterId: 'user1',
      requesterName: 'John Doe',
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      duration: calculateDuration() || undefined,
      status: 'submitted',
      currentStep: 1,
      steps: [],
      metadata: {
        ...(type === 'leave' && { leaveType: formData.leaveType }),
        ...(type === 'training' && { 
          provider: formData.provider, 
          cost: parseFloat(formData.cost) || 0, 
          location: formData.location,
          justification: formData.justification
        }),
        ...(type === 'certificate' && { 
          certificateType: formData.certificateType, 
          purpose: formData.purpose 
        }),
        ...(type === 'complaint' && { 
          category: formData.category, 
          urgency: formData.urgency 
        })
      }
    };

    createRequest(requestData);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${config.color}`} />
          <h1 className="text-2xl font-bold">{config.title}</h1>
        </div>
      </div>

      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Remplissez les informations nécessaires pour votre demande
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la demande *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Donnez un titre à votre demande"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre demande en détail"
              rows={3}
            />
          </div>

          {config.fields.includes('startDate') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début {type === 'leave' ? '*' : ''}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin {type === 'leave' ? '*' : ''}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {formData.startDate && formData.endDate && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">
                Durée calculée: {calculateDuration()}
              </p>
            </div>
          )}

          {/* Champs spécifiques selon le type */}
          {type === 'leave' && config.fields.includes('leaveType') && (
            <div className="space-y-2">
              <Label htmlFor="leaveType">Type de congé</Label>
              <Select value={formData.leaveType} onValueChange={(value) => handleInputChange('leaveType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de congé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Congé payé</SelectItem>
                  <SelectItem value="rtt">RTT</SelectItem>
                  <SelectItem value="sick">Congé maladie</SelectItem>
                  <SelectItem value="family">Congé familial</SelectItem>
                  <SelectItem value="unpaid">Congé sans solde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'training' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Organisme de formation</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => handleInputChange('provider', e.target.value)}
                    placeholder="Nom de l'organisme"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Coût (€)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu de formation</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Paris, En ligne, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  placeholder="En quoi cette formation sera-t-elle bénéfique ?"
                  rows={3}
                />
              </div>
            </>
          )}

          {type === 'certificate' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="certificateType">Type d'attestation</Label>
                <Select value={formData.certificateType} onValueChange={(value) => handleInputChange('certificateType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Attestation de travail</SelectItem>
                    <SelectItem value="salary">Attestation de salaire</SelectItem>
                    <SelectItem value="employment">Certificat d'emploi</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Utilisation prévue</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Démarche administrative, prêt bancaire, etc."
                />
              </div>
            </>
          )}

          {type === 'complaint' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Problème informatique</SelectItem>
                      <SelectItem value="facilities">Locaux/équipements</SelectItem>
                      <SelectItem value="hr">Ressources humaines</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgence</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          Sauvegarder en brouillon
        </Button>
        <Button onClick={handleSubmitRequest} className="gradient-primary text-primary-foreground">
          <Send className="w-4 h-4 mr-2" />
          Soumettre la demande
        </Button>
      </div>
    </div>
  );
}