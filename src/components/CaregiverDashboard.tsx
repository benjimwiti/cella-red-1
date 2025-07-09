
import { useState } from "react";
import { Plus, Calendar, Shield, FileText, Bell, Eye, Phone, Settings, Download, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AddWarriorModal from "./caregiver/AddWarriorModal";
import WarriorProfileView from "./caregiver/WarriorProfileView";
import AppointmentsManager from "./caregiver/AppointmentsManager";
import EmergencySetup from "./caregiver/EmergencySetup";
import ReportsExporter from "./caregiver/ReportsExporter";
import NotificationSettings from "./caregiver/NotificationSettings";

interface WarriorProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  lastCrisis: string;
  status: 'good' | 'attention' | 'crisis';
  hydrationStatus: 'good' | 'warning';
  medicationStatus: 'good' | 'warning' | 'missed';
  upcomingMeds?: string;
}

const CaregiverDashboard = () => {
  const [warriors, setWarriors] = useState<WarriorProfile[]>([
    {
      id: '1',
      name: 'Joy',
      age: 12,
      avatar: '/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png',
      lastCrisis: '3 days ago',
      status: 'good',
      hydrationStatus: 'good',
      medicationStatus: 'warning',
      upcomingMeds: 'Hydroxyurea in 1 hour'
    },
    {
      id: '2', 
      name: 'Marcus',
      age: 15,
      avatar: '/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png',
      lastCrisis: '1 week ago',
      status: 'attention',
      hydrationStatus: 'warning',
      medicationStatus: 'good'
    }
  ]);

  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'appointments' | 'emergency' | 'reports' | 'notifications'>('dashboard');
  const [selectedWarrior, setSelectedWarrior] = useState<WarriorProfile | null>(null);
  const [showAddWarrior, setShowAddWarrior] = useState(false);

  const upcomingMedication = warriors.find(w => w.upcomingMeds);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50';
      case 'attention': return 'border-yellow-200 bg-yellow-50';
      case 'crisis': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'attention': return '⚠️';
      case 'crisis': return '🚨';
      default: return '📊';
    }
  };

  const handleAddWarrior = (warrior: Omit<WarriorProfile, 'id'>) => {
    const newWarrior = {
      ...warrior,
      id: Date.now().toString()
    };
    setWarriors([...warriors, newWarrior]);
    setShowAddWarrior(false);
  };

  const handleViewProfile = (warrior: WarriorProfile) => {
    setSelectedWarrior(warrior);
    setActiveView('profile');
  };

  const renderDashboard = () => (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Caregiver!</h1>
          <p className="text-gray-600">Managing {warriors.length} warrior profiles</p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {upcomingMedication && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </Button>
      </div>

      {/* Notification Banner */}
      {upcomingMedication && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-800">{upcomingMedication.upcomingMeds}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                  Snooze 10 min
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Mark as Taken
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warrior Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Warrior Profiles</h2>
          <Button 
            className="bg-brand-red hover:bg-brand-red/90 text-white"
            onClick={() => setShowAddWarrior(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Warrior
          </Button>
        </div>
        
        <div className="grid gap-4">
          {warriors.map((warrior) => (
            <Card key={warrior.id} className={`glass-effect card-hover cursor-pointer ${getStatusColor(warrior.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 ring-2 ring-white">
                    <AvatarImage src={warrior.avatar} alt={warrior.name} />
                    <AvatarFallback className="bg-brand-red text-white">
                      {warrior.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{warrior.name}</h3>
                      <span className="text-lg">{getStatusIcon(warrior.status)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Age: {warrior.age}</p>
                    <p className="text-sm text-gray-600 mb-2">Last crisis: {warrior.lastCrisis}</p>
                    <div className="flex space-x-4 text-sm">
                      <span className={`flex items-center ${warrior.hydrationStatus === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Hydration: {warrior.hydrationStatus === 'good' ? '✅' : '⚠️'}
                      </span>
                      <span className={`flex items-center ${warrior.medicationStatus === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Meds: {warrior.medicationStatus === 'good' ? '✅' : '⚠️'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(warrior)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setActiveView('appointments')}>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-brand-red mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Appointments</h4>
              <p className="text-xs text-gray-600 mt-1">Manage doctor visits</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setActiveView('emergency')}>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-brand-red mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Emergency Setup</h4>
              <p className="text-xs text-gray-600 mt-1">Configure contacts</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setActiveView('reports')}>
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-brand-red mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Export Reports</h4>
              <p className="text-xs text-gray-600 mt-1">Download health data</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setActiveView('notifications')}>
            <CardContent className="p-4 text-center">
              <Bell className="w-8 h-8 text-brand-red mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Notifications</h4>
              <p className="text-xs text-gray-600 mt-1">Manage alerts</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Warrior Modal */}
      {showAddWarrior && (
        <AddWarriorModal
          isOpen={showAddWarrior}
          onClose={() => setShowAddWarrior(false)}
          onAdd={handleAddWarrior}
        />
      )}
    </div>
  );

  const renderBackButton = () => (
    <Button 
      variant="ghost" 
      onClick={() => setActiveView('dashboard')}
      className="mb-4"
    >
      ← Back to Dashboard
    </Button>
  );

  // Render different views based on activeView
  switch (activeView) {
    case 'profile':
      return (
        <div className="min-h-screen p-4">
          {renderBackButton()}
          <WarriorProfileView 
            warrior={selectedWarrior!} 
            onUpdate={(updatedWarrior) => {
              setWarriors(warriors.map(w => w.id === updatedWarrior.id ? updatedWarrior : w));
              setSelectedWarrior(updatedWarrior);
            }}
          />
        </div>
      );
    case 'appointments':
      return (
        <div className="min-h-screen p-4">
          {renderBackButton()}
          <AppointmentsManager warriors={warriors} />
        </div>
      );
    case 'emergency':
      return (
        <div className="min-h-screen p-4">
          {renderBackButton()}
          <EmergencySetup warriors={warriors} />
        </div>
      );
    case 'reports':
      return (
        <div className="min-h-screen p-4">
          {renderBackButton()}
          <ReportsExporter warriors={warriors} />
        </div>
      );
    case 'notifications':
      return (
        <div className="min-h-screen p-4">
          {renderBackButton()}
          <NotificationSettings warriors={warriors} />
        </div>
      );
    default:
      return renderDashboard();
  }
};

export default CaregiverDashboard;
