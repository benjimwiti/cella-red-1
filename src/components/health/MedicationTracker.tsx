
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MedicationTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await HealthService.getMedications(user.id);
    },
    enabled: !!user?.id,
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['medication-logs', user?.id, new Date().toDateString()],
    queryFn: async () => {
      if (!user?.id) return [];
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return await HealthService.getMedicationLogs(user.id, today, tomorrow.toISOString().split('T')[0]);
    },
    enabled: !!user?.id,
  });

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
    return todayLogs.some(log => log.medication_id === medicationId);
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
            <DialogContent>
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
            <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{medication.name}</div>
                <div className="text-sm text-cella-grey">
                  {medication.dosage} • {medication.frequency}
                </div>
                <div className="text-xs text-cella-grey flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {medication.time_of_day.join(', ')}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
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
    frequency: '',
    time_of_day: [''],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.addMedication({
        user_id: user.id,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
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
        <Label htmlFor="frequency">Frequency</Label>
        <Input
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          placeholder="e.g., Once daily"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="time">Time of Day</Label>
        <Input
          id="time"
          value={formData.time_of_day[0]}
          onChange={(e) => setFormData({ ...formData, time_of_day: [e.target.value] })}
          placeholder="e.g., 8:00 AM"
          required
        />
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
