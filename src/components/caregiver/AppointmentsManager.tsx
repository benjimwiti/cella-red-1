
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Clock, MapPin, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WarriorProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  lastCrisis: string;
  status: 'good' | 'attention' | 'crisis';
  hydrationStatus: 'good' | 'warning';
  medicationStatus: 'good' | 'warning' | 'missed';
}

interface Appointment {
  id: string;
  warriorId: string;
  warriorName: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  location: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'missed';
}

interface AppointmentsManagerProps {
  warriors: WarriorProfile[];
}

const AppointmentsManager = ({ warriors }: AppointmentsManagerProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      warriorId: '1',
      warriorName: 'Joy',
      date: '2024-07-15',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      type: 'Routine Check-up',
      location: 'Children\'s Hospital',
      notes: 'Regular quarterly check-up',
      status: 'upcoming'
    },
    {
      id: '2',
      warriorId: '2',
      warriorName: 'Marcus',
      date: '2024-07-20',
      time: '2:30 PM',
      doctor: 'Dr. Johnson',
      type: 'Hematology Consultation',
      location: 'Specialist Clinic',
      notes: 'Follow-up on recent lab results',
      status: 'upcoming'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    warriorId: '',
    date: '',
    time: '',
    doctor: '',
    type: '',
    location: '',
    notes: ''
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.warriorId || !formData.date || !formData.doctor) return;

    const warrior = warriors.find(w => w.id === formData.warriorId);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      warriorId: formData.warriorId,
      warriorName: warrior?.name || '',
      date: formData.date,
      time: formData.time,
      doctor: formData.doctor,
      type: formData.type,
      location: formData.location,
      notes: formData.notes,
      status: 'upcoming'
    };

    setAppointments([...appointments, newAppointment]);
    setFormData({
      warriorId: '',
      date: '',
      time: '',
      doctor: '',
      type: '',
      location: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments Manager</h1>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-brand-red hover:bg-brand-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label>Warrior</Label>
                <Select value={formData.warriorId} onValueChange={(value) => setFormData({ ...formData, warriorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warrior" />
                  </SelectTrigger>
                  <SelectContent>
                    {warriors.map((warrior) => (
                      <SelectItem key={warrior.id} value={warrior.id}>
                        {warrior.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input
                  id="doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  placeholder="Dr. Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Routine Check-up, Consultation, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Hospital, Clinic address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or reminders"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-brand-red hover:bg-brand-red/90">
                  Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-red" />
            <span>Upcoming Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No upcoming appointments scheduled</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{appointment.type}</h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {appointment.warriorName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </span>
                        {appointment.time && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{appointment.doctor}</span>
                        </span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Past Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {pastAppointments.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No past appointments recorded</p>
          ) : (
            <div className="space-y-3">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{appointment.type}</h4>
                      <p className="text-sm text-gray-600">{appointment.doctor} - {appointment.date}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsManager;
