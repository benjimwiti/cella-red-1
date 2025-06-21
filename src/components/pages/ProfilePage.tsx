
import { Bell, Calendar, Users, Download, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePageProps {
  profileType: 'patient' | 'caregiver';
  onProfileChange: (type: 'patient' | 'caregiver' | null) => void;
}

const ProfilePage = ({ profileType, onProfileChange }: ProfilePageProps) => {
  const profileOptions = [
    { icon: Calendar, title: "Appointments", subtitle: "Manage doctor visits", action: () => {} },
    { icon: Users, title: "Emergency Contacts", subtitle: "Setup emergency contacts", action: () => {} },
    { icon: Download, title: "Export Data", subtitle: "Download health reports", action: () => {} },
    { icon: Bell, title: "Notifications", subtitle: "Manage reminders", action: () => {} },
    { icon: Settings, title: "App Settings", subtitle: "Preferences & privacy", action: () => {} },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-cella-grey">Manage your account and preferences</p>
      </div>

      {/* Profile Type */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-lg">Profile Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-cella-grey">Current: <span className="font-medium capitalize">{profileType}</span></p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onProfileChange(profileType === 'patient' ? 'caregiver' : 'patient')}
            >
              Switch to {profileType === 'patient' ? 'Caregiver' : 'Patient'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu Options */}
      <div className="space-y-3">
        {profileOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <Card key={index} className="glass-effect card-hover cursor-pointer" onClick={option.action}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-cella-rose-light rounded-full p-2">
                    <Icon className="w-5 h-5 text-cella-rose-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                    <p className="text-sm text-cella-grey">{option.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Logout */}
      <Card className="glass-effect border-red-200">
        <CardContent className="p-4">
          <Button 
            variant="ghost" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onProfileChange(null)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
