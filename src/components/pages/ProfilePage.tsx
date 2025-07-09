
import { Bell, Calendar, Users, Download, Settings, LogOut, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import CaregiverProfileSettings from "@/components/caregiver/CaregiverProfileSettings";

interface ProfilePageProps {
  profileType: 'patient' | 'caregiver';
  onProfileChange: (type: 'patient' | 'caregiver' | null) => void;
}

const ProfilePage = ({ profileType, onProfileChange }: ProfilePageProps) => {
  const [showCaregiverSettings, setShowCaregiverSettings] = useState(false);
  
  // Default to female avatar, but this could be user-selectable
  const avatarImage = "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png";
  
  // Mock warriors data for caregiver settings
  const mockWarriors = [
    {
      id: '1',
      name: 'Joy',
      age: 12,
      avatar: '/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png',
      lastCrisis: '3 days ago',
      status: 'good' as const,
      hydrationStatus: 'good' as const,
      medicationStatus: 'warning' as const
    },
    {
      id: '2',
      name: 'Marcus',
      age: 8,
      avatar: '/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png',
      lastCrisis: '1 week ago',
      status: 'attention' as const,
      hydrationStatus: 'warning' as const,
      medicationStatus: 'good' as const
    }
  ];
  
  if (showCaregiverSettings && profileType === 'caregiver') {
    return (
      <CaregiverProfileSettings 
        onBack={() => setShowCaregiverSettings(false)}
        warriors={mockWarriors}
        onProfileTypeChange={onProfileChange}
      />
    );
  }
  
  const profileOptions = [
    { 
      icon: Calendar, 
      title: "Appointments", 
      subtitle: profileType === 'caregiver' ? "Manage doctor visits for all warriors" : "Manage doctor visits", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Users, 
      title: "Emergency Contacts", 
      subtitle: profileType === 'caregiver' ? "Setup emergency contacts for each warrior" : "Setup emergency contacts", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Download, 
      title: "Export Data", 
      subtitle: profileType === 'caregiver' ? "Download health reports for any warrior" : "Download health reports", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      subtitle: profileType === 'caregiver' ? "Manage reminders for each warrior" : "Manage reminders", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Settings, 
      title: "App Settings", 
      subtitle: "Preferences & privacy", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center pt-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-3"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-cella-grey">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Avatar & Info */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-cella-rose/20">
                <AvatarImage src={avatarImage} alt="Profile Avatar" />
                <AvatarFallback className="bg-cella-rose text-white text-2xl">
                  {profileType === 'patient' ? 'W' : 'C'}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-cella-rose"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 capitalize">{profileType}</h3>
              <p className="text-sm text-cella-grey">Tap camera icon to change avatar</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
