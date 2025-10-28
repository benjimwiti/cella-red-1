import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Appointment } from '@/types/health';

const AppointmentTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mode, setMode] = useState<'today' | 'all'>('today');

  const today = new Date().toISOString().split('T')[0];

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', user?.id, mode === 'today' ? today : null],
    queryFn: async () => {
      if (!user?.id) return [];
      return await HealthService.getAppointments(user.id, mode === 'today' ? today : undefined);
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
            <Calendar className="w-5 h-5 text-blue-500" />
            Appointments
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
              </DialogHeader>
              <AddAppointmentForm
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
            Today's Appointments
          </Button>
          <Button
            size="sm"
            variant={mode === 'all' ? 'default' : 'outline'}
            onClick={() => setMode('all')}
            className={mode === 'all' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            All Appointments
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments && appointments.length === 0 ? (
          <div className="text-center py-6 text-cella-grey">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No appointments scheduled</p>
            <p className="text-sm">Tap the + button to schedule your first appointment</p>
          </div>
        ) : (
          appointments?.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={appointment.is_completed ? "secondary" : "default"} className="text-xs">
                    {appointment.is_completed ? 'Completed' : 'Scheduled'}
                  </Badge>
                </div>
                <div className="font-medium">
                  {appointment.title}
                </div>
                <div className="text-sm text-cella-grey">
                  {appointment.healthcare_provider}
                </div>
                {appointment.location && (
                  <div className="text-sm text-cella-grey flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {appointment.location}
                  </div>
                )}
                {appointment.notes && (
                  <div className="text-sm text-cella-grey mt-1">
                    {appointment.notes}
                  </div>
                )}
              </div>
              <div className="text-xs text-cella-grey flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(appointment.appointment_date).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {' at '}
                {new Date(appointment.appointment_date).toLocaleTimeString([], {
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

const AddAppointmentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    healthcare_provider: '',
    appointment_date: '',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.addAppointment({
        user_id: user.id,
        title: formData.title,
        healthcare_provider: formData.healthcare_provider,
        appointment_date: new Date(formData.appointment_date).toISOString(),
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        is_completed: false
      });

      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been scheduled successfully",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Appointment Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Check-up, Therapy Session"
          required
        />
      </div>

      <div>
        <Label htmlFor="healthcare_provider">Healthcare Provider</Label>
        <Input
          id="healthcare_provider"
          value={formData.healthcare_provider}
          onChange={(e) => setFormData({ ...formData, healthcare_provider: e.target.value })}
          placeholder="e.g., Dr. Smith, Pain Clinic"
          required
        />
      </div>

      <div>
        <Label htmlFor="appointment_date">Date & Time</Label>
        <Input
          id="appointment_date"
          type="datetime-local"
          value={formData.appointment_date}
          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Main Street Clinic, Room 205"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or preparation instructions"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-cella-rose hover:bg-cella-rose-dark">
        Schedule Appointment
      </Button>
    </form>
  );
};

export default AppointmentTracker;
