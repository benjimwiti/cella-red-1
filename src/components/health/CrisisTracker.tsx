import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CrisisLog } from '@/types/health';

const CrisisTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mode, setMode] = useState<'today' | 'all'>('today');

  const today = new Date().toISOString().split('T')[0];

  const { data: crises, isLoading } = useQuery({
    queryKey: ['crises', user?.id, mode === 'today' ? today : null],
    queryFn: async () => {
      if (!user?.id) return [];
      return await HealthService.getCrisisLogs(user.id, mode === 'today' ? today : undefined);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Pain Episodes
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Pain Episode</DialogTitle>
              </DialogHeader>
              <AddCrisisForm
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['crises'] });
                }}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant={mode === 'today' ? 'default' : 'outline'}
            onClick={() => setMode('today')}
            className={mode === 'today' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            Today's Episodes
          </Button>
          <Button
            size="sm"
            variant={mode === 'all' ? 'default' : 'outline'}
            onClick={() => setMode('all')}
            className={mode === 'all' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            All Episodes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {crises && crises.length === 0 ? (
          <div className="text-center py-6 text-cella-grey">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No pain episodes logged yet</p>
            <p className="text-sm">Tap the + button to log your first episode</p>
          </div>
        ) : (
          crises?.map((crisis) => (
            <div key={crisis.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive" className="text-xs">
                    Level {crisis.pain_level}/10
                  </Badge>
                  {crisis.ended_at && (
                    <Badge variant="secondary" className="text-xs">
                      Ended
                    </Badge>
                  )}
                </div>
                <div className="font-medium">
                  {crisis.symptoms.join(', ')}
                </div>
                {crisis.triggers && crisis.triggers.length > 0 && (
                  <div className="text-sm text-cella-grey mt-1">
                    Triggers: {crisis.triggers.join(', ')}
                  </div>
                )}
                {crisis.notes && (
                  <div className="text-sm text-cella-grey mt-1">
                    {crisis.notes}
                  </div>
                )}
              </div>
              <div className="text-xs text-cella-grey flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(crisis.started_at).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const AddCrisisForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pain_level: '',
    symptoms: [''],
    triggers: [''],
    location: '',
    notes: ''
  });

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, '']
    }));
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const updateSymptom = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom, i) => i === index ? value : symptom)
    }));
  };

  const addTrigger = () => {
    setFormData(prev => ({
      ...prev,
      triggers: [...prev.triggers, '']
    }));
  };

  const removeTrigger = (index: number) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index)
    }));
  };

  const updateTrigger = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.map((trigger, i) => i === index ? value : trigger)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.logCrisis({
        user_id: user.id,
        started_at: new Date().toISOString(),
        pain_level: parseInt(formData.pain_level),
        symptoms: formData.symptoms.filter(symptom => symptom.trim()),
        triggers: formData.triggers.filter(trigger => trigger.trim()),
        location: formData.location || undefined,
        notes: formData.notes || undefined
      });

      toast({
        title: "Pain Episode Logged",
        description: "Your pain episode has been logged successfully",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log pain episode",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="pain_level">Pain Level (1-10)</Label>
        <Select
          value={formData.pain_level}
          onValueChange={(value) => setFormData({ ...formData, pain_level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select pain level" />
          </SelectTrigger>
          <SelectContent>
            {[1,2,3,4,5,6,7,8,9,10].map(level => (
              <SelectItem key={level} value={level.toString()}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Symptoms</Label>
        <div className="space-y-2 mt-1">
          {formData.symptoms.map((symptom, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={symptom}
                onChange={(e) => updateSymptom(index, e.target.value)}
                placeholder="e.g., Headache, Nausea"
                required
              />
              {formData.symptoms.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeSymptom(index)}
                  className="p-2"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addSymptom}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Symptom
          </Button>
        </div>
      </div>

      <div>
        <Label>Triggers (Optional)</Label>
        <div className="space-y-2 mt-1">
          {formData.triggers.map((trigger, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={trigger}
                onChange={(e) => updateTrigger(index, e.target.value)}
                placeholder="e.g., Stress, Weather"
              />
              {formData.triggers.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeTrigger(index)}
                  className="p-2"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addTrigger}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trigger
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Home, Work"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes"
        />
      </div>

      <Button type="submit" className="w-full bg-cella-rose hover:bg-cella-rose-dark">
        Log Pain Episode
      </Button>
    </form>
  );
};

export default CrisisTracker;
