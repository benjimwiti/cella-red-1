
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Droplet, Pill, Heart, FileText, Settings, Plus } from "lucide-react";

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

interface WarriorProfileViewProps {
  warrior: WarriorProfile;
  onUpdate: (warrior: WarriorProfile) => void;
}

const WarriorProfileView = ({ warrior, onUpdate }: WarriorProfileViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the profile
  const healthStats = {
    hydrationStreak: 5,
    hydrationGoal: 8,
    hydrationCurrent: 6,
    medicationAdherence: 95,
    crisisFree: 12
  };

  const medications = [
    { id: 1, name: "Hydroxyurea", dosage: "500mg", time: "8:00 AM", taken: true },
    { id: 2, name: "Folic Acid", dosage: "5mg", time: "12:00 PM", taken: false },
    { id: 3, name: "Pain Relief", dosage: "As needed", time: "PRN", taken: false }
  ];

  const upcomingAppointments = [
    { id: 1, date: "2024-07-15", doctor: "Dr. Smith", type: "Routine Check-up" },
    { id: 2, date: "2024-08-10", doctor: "Dr. Johnson", type: "Hematology Consultation" }
  ];

  const recentLogs = [
    { date: "Today", type: "Hydration", value: "6/8 glasses", status: "warning" },
    { date: "Today", type: "Medication", value: "2/3 taken", status: "warning" },
    { date: "Yesterday", type: "Pain Level", value: "2/10", status: "good" },
    { date: "Yesterday", type: "Hydration", value: "8/8 glasses", status: "good" }
  ];

  const toggleMedication = (medId: number) => {
    // In a real app, this would update the database
    console.log(`Toggling medication ${medId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-red/5 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 ring-4 ring-brand-red/20">
            <AvatarImage src={warrior.avatar} alt={warrior.name} />
            <AvatarFallback className="bg-brand-red text-white text-2xl">
              {warrior.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{warrior.name}</h1>
              <Badge variant="secondary">Age {warrior.age}</Badge>
            </div>
            <p className="text-gray-600 mb-2">👩‍⚕️ Managing as Caregiver</p>
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center text-green-600">
                💪 {healthStats.crisisFree} days crisis-free
              </span>
              <span className="flex items-center text-blue-600">
                💧 {healthStats.hydrationStreak} day hydration streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Droplet className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Today's Hydration</p>
                    <p className="text-lg font-semibold">{healthStats.hydrationCurrent}/{healthStats.hydrationGoal} glasses</p>
                    <Progress value={(healthStats.hydrationCurrent / healthStats.hydrationGoal) * 100} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Pill className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Medication Adherence</p>
                    <p className="text-lg font-semibold">{healthStats.medicationAdherence}%</p>
                    <Progress value={healthStats.medicationAdherence} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Crisis-Free</p>
                    <p className="text-lg font-semibold">{healthStats.crisisFree} days</p>
                    <p className="text-xs text-green-600">Great progress!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{log.type}</p>
                      <p className="text-sm text-gray-600">{log.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.value}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status === 'good' ? 'On track' : 'Needs attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Medications</h3>
            <Button size="sm" className="bg-brand-red hover:bg-brand-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>
          
          <div className="space-y-3">
            {medications.map((med) => (
              <Card key={med.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{med.name}</h4>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.time}</p>
                    </div>
                    <Button
                      variant={med.taken ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMedication(med.id)}
                      className={med.taken ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {med.taken ? "✓ Taken" : "Mark Taken"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <Button size="sm" className="bg-brand-red hover:bg-brand-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{appointment.type}</h4>
                      <p className="text-sm text-gray-600">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Health Logs</h3>
            <Button size="sm" className="bg-brand-red hover:bg-brand-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Log Entry
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Droplet className="w-6 h-6 text-blue-500" />
              <span>Log Hydration</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Pill className="w-6 h-6 text-yellow-500" />
              <span>Log Medication</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Heart className="w-6 h-6 text-red-500" />
              <span>Log Pain Level</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="w-6 h-6 text-green-500" />
              <span>Log Meal</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Health Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Calendar view with color-coded health events will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Warrior Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile Information
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export Health Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarriorProfileView;
