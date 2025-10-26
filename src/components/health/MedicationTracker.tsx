
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWarriorData } from '@/hooks/useWarriorData';

const MedicationTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mode, setMode] = useState<'today' | 'all'>('today');
  const { data, isLoading } = useWarriorData(user?.id || '');

  //read data from hook
  const allMedications = data?.medications || [];
  const medications = mode === 'today' ? allMedications.filter(med => med.is_active) : allMedications;
  const todayLogs = data?.medication_logs || []
 

  const markAsTaken = async (medicationId: string, dosage: string) => {
    if (!user?.id) return;

    try {
      await HealthService.logMedicationTaken({
        user_id: user.id,
        medication_id: medicationId,
        taken_at: new Date().toISOString(),
        dosage_taken: dosage,
        was_on_time: true, // Could be calculated based on scheduled time
      });

      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      
      toast({
        title: "Medication Logged",
        description: "Medication marked as taken successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log medication",
        variant: "destructive",
      });
    }
  };

  const isTakenToday = (medicationId: string) => {
    return todayLogs.some((log: any) => log.medication_id === medicationId);
  };

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
            <Pill className="w-5 h-5 text-purple-500" />
            Medications
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
              </DialogHeader>
              <AddMedicationForm
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['medications'] });
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
            Today's Medications
          </Button>
          <Button
            size="sm"
            variant={mode === 'all' ? 'default' : 'outline'}
            onClick={() => setMode('all')}
            className={mode === 'all' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            All Medications
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {medications.length === 0 ? (
          <div className="text-center py-6 text-cella-grey">
            <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No medications added yet</p>
            <p className="text-sm">Tap the + button to add your first medication</p>
          </div>
        ) : (
          medications.map((medication) => (
            <div key={medication.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex-1">
                <div className="font-medium">{medication.name}</div>
                <div className="text-sm text-cella-grey">
                  {medication.dosage}
                </div>
              </div>
              <div className="space-y-2">
                {medication.time_of_day.map((time, index) => {
                  if (!time) return null;
                  const [hours, minutes] = time.split(':');
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour % 12 || 12;
                  const displayTime = `${displayHour}:${minutes}`;

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-xs text-cella-grey flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {displayTime}
                      </div>
                      {isTakenToday(medication.id) ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Taken
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markAsTaken(medication.id, medication.dosage)}
                          className="bg-cella-rose hover:bg-cella-rose-dark"
                        >
                          Take Now
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const AddMedicationForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time_of_day: [''],
    notes: ''
  });

  const timeTemplates = {
    'Once a day': ['8:00 AM'],
    'Twice a day': ['8:00 AM', '8:00 PM'],
    'Thrice a day': ['8:00 AM', '2:00 PM', '8:00 PM'],
    'Four times a day': ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM']
  };

  const applyTemplate = (template: string) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: timeTemplates[template as keyof typeof timeTemplates]
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      time_of_day: [...prev.time_of_day, '']
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: prev.time_of_day.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: prev.time_of_day.map((time, i) => i === index ? value : time)
    }));
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.addMedication({
        user_id: user.id,
        name: formData.name,
        dosage: formData.dosage,
        frequency: `${formData.time_of_day.length} times daily`,
        time_of_day: formData.time_of_day.filter(time => time.trim()),
        start_date: new Date().toISOString().split('T')[0],
        notes: formData.notes || undefined,
        is_active: true
      });

      toast({
        title: "Medication Added",
        description: `${formData.name} has been added to your medication list`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Medication Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Hydroxyurea"
          required
        />
      </div>

      <div>
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="e.g., 500mg"
          required
        />
      </div>

      <div>
        <Label>Time Templates</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.keys(timeTemplates).map((template) => (
            <Button
              key={template}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => applyTemplate(template)}
              className="text-xs"
            >
              {template}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Time of Day</Label>
        <div className="space-y-2 mt-1">
          {formData.time_of_day.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={time}
                onChange={(e) => updateTimeSlot(index, e.target.value)}
                placeholder="e.g., 8:00 AM"
                required
              />
              {formData.time_of_day.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeTimeSlot(index)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addTimeSlot}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
        {formData.time_of_day.some(time => time) && (
          <div className="text-sm text-cella-grey mt-2">
            Preview: {formData.time_of_day.filter(time => time).map(formatTime).join(', ')}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any special instructions"
        />
      </div>

      <Button type="submit" className="w-full bg-cella-rose hover:bg-cella-rose-dark">
        Add Medication
      </Button>
    </form>
  );
};

export default MedicationTracker;
