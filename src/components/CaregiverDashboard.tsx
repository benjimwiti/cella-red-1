
import { useState } from "react";
import { Plus, Calendar, Shield, FileText, Bell, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface WarriorProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  lastUpdate: string;
  status: 'good' | 'attention' | 'crisis';
}

const CaregiverDashboard = () => {
  const [warriors] = useState<WarriorProfile[]>([
    {
      id: '1',
      name: 'Joy',
      age: 12,
      avatar: '/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png',
      lastUpdate: 'Last crisis: 3 days ago',
      status: 'good'
    },
    {
      id: '2', 
      name: 'Marcus',
      age: 15,
      avatar: '/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png',
      lastUpdate: 'Hydration: ✅ Meds: ⚠️',
      status: 'attention'
    }
  ]);

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

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Caregiver!</h1>
          <p className="text-cella-grey">Managing {warriors.length} warrior profiles</p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cella-crisis rounded-full"></div>
        </Button>
      </div>

      {/* Notification Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800">Medication reminder for Joy in 1 hour</p>
          </div>
        </CardContent>
      </Card>

      {/* Warrior Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Warrior Profiles</h2>
          <Button className="bg-cella-rose hover:bg-cella-rose-dark text-white">
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
                    <AvatarFallback className="bg-cella-rose text-white">
                      {warrior.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{warrior.name}</h3>
                      <span className="text-lg">{getStatusIcon(warrior.status)}</span>
                    </div>
                    <p className="text-sm text-cella-grey">Age: {warrior.age}</p>
                    <p className="text-sm text-gray-600 mt-1">{warrior.lastUpdate}</p>
                  </div>
                  <Button variant="outline" size="sm">
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
          <Card className="glass-effect card-hover cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-cella-rose mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Appointments</h4>
              <p className="text-xs text-cella-grey mt-1">Manage doctor visits</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-cella-rose mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Emergency Setup</h4>
              <p className="text-xs text-cella-grey mt-1">Configure contacts</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-cella-rose mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Export Reports</h4>
              <p className="text-xs text-cella-grey mt-1">Download health data</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer">
            <CardContent className="p-4 text-center">
              <Bell className="w-8 h-8 text-cella-rose mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Notifications</h4>
              <p className="text-xs text-cella-grey mt-1">Manage alerts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
