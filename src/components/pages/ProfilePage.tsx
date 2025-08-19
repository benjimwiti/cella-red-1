
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
  
  const avatarImage = "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png";
  
  // Remove old mock data since we no longer need it
  const mockChildren = [];
  
  if (showCaregiverSettings && profileType === 'caregiver') {
    return (
        <CaregiverProfileSettings 
          onBack={() => setShowCaregiverSettings(false)}
          children={[]} // Empty for now - will be populated when connected to real child data
          onProfileTypeChange={onProfileChange}
        />
    );
  }
  
  const profileOptions = [
    { 
      icon: Calendar, 
      title: "Appointments", 
      subtitle: profileType === 'caregiver' ? "Manage doctor visits for all children" : "Manage doctor visits", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Users, 
      title: "Emergency Contacts", 
      subtitle: profileType === 'caregiver' ? "Setup emergency contacts for each child" : "Setup emergency contacts", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Download, 
      title: "Export Data", 
      subtitle: profileType === 'caregiver' ? "Download health reports for any child" : "Download health reports", 
      action: profileType === 'caregiver' ? () => setShowCaregiverSettings(true) : () => {} 
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      subtitle: profileType === 'caregiver' ? "Manage reminders for each child" : "Manage reminders", 
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
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header with Back Button - Responsive */}
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Profile Avatar & Info - Responsive */}
        <Card className="glass-effect bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-brand-red/20">
                  <AvatarImage src={avatarImage} alt="Profile Avatar" />
                  <AvatarFallback className="bg-brand-red text-white text-xl sm:text-2xl">
                    {profileType === 'patient' ? 'W' : 'C'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-brand-red"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 capitalize text-lg sm:text-xl">
                  {profileType}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tap camera icon to change avatar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Type - Responsive */}
        <Card className="glass-effect bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Profile Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm sm:text-base text-gray-600">
                Current: <span className="font-medium capitalize">{profileType}</span>
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onProfileChange(profileType === 'patient' ? 'caregiver' : 'patient')}
                className="w-full sm:w-auto"
              >
                Switch to {profileType === 'patient' ? 'Caregiver' : 'Patient'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Options - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          {profileOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={index} 
                className="glass-effect card-hover cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200" 
                onClick={option.action}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-red/10 rounded-full p-2 sm:p-3 flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-base sm:text-lg">
                        {option.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Logout - Responsive */}
        <Card className="glass-effect border-red-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-base sm:text-lg"
              onClick={() => onProfileChange(null)}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
