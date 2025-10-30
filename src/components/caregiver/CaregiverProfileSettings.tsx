
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Settings,
  Phone,
  Download,
  Shield,
  Palette,
  Globe,
  Trash2
} from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  genotype?: string;
  lastActivity: string;
  status: 'good' | 'attention' | 'crisis';
}

interface CaregiverProfileSettingsProps {
  onBack: () => void;
  children: ChildProfile[];
  onProfileTypeChange: (type: 'patient' | 'caregiver') => void;
}

const CaregiverProfileSettings = ({ onBack, children, onProfileTypeChange }: CaregiverProfileSettingsProps) => {
  const [currentView, setCurrentView] = useState('main');
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const { toast } = useToast();
  const [appSettings, setAppSettings] = useState({
    theme: 'auto',
    language: 'en',
    notificationSounds: true,
    dataStorage: 'local'
  });

  const handleSwitchToPatient = () => {
    setShowSwitchModal(false);
    onProfileTypeChange('patient');
  };

  const handleAppSettingChange = (setting: string, value: any) => {
    setAppSettings(prev => ({ ...prev, [setting]: value }));
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // In a real app, this would trigger account deletion
    }
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} Feature`,
      description: `${feature} functionality will be implemented in a future update.`
    });
  };

  if (currentView === 'appointments') {
    return (
      <div className="min-h-screen cella-gradient p-6">
        <Button onClick={() => setCurrentView('main')} variant="ghost" className="mb-4">
          ← Back to Settings
        </Button>
        <Card className="glass-effect">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Appointments Manager</h3>
            <p className="text-foreground/60">Manage appointments for your children - coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'emergency') {
    return (
      <div className="min-h-screen cella-gradient p-6">
        <Button onClick={() => setCurrentView('main')} variant="ghost" className="mb-4">
          ← Back to Settings
        </Button>
        <Card className="glass-effect">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Emergency Setup</h3>
            <p className="text-foreground/60">Configure emergency contacts - coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'reports') {
    return (
      <div className="min-h-screen cella-gradient p-6">
        <Button onClick={() => setCurrentView('main')} variant="ghost" className="mb-4">
          ← Back to Settings
        </Button>
        <Card className="glass-effect">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Export Health Reports</h3>
            <p className="text-foreground/60">Download health data reports - coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'notifications') {
    return (
      <div className="min-h-screen cella-gradient p-6">
        <Button onClick={() => setCurrentView('main')} variant="ghost" className="mb-4">
          ← Back to Settings
        </Button>
        <Card className="glass-effect">
          <CardContent className="p-6 text-center">
            <Bell className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Notifications & Reminders</h3>
            <p className="text-foreground/60">Manage notification preferences - coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'app-settings') {
    return (
      <div className="min-h-screen bg-white p-4 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('main')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">App Settings</h1>
            <p className="text-gray-600">Customize your experience and privacy preferences</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-500" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select value={appSettings.theme} onValueChange={(value) => handleAppSettingChange('theme', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sounds">Notification Sounds</Label>
              <Switch
                id="sounds"
                checked={appSettings.notificationSounds}
                onCheckedChange={(checked) => handleAppSettingChange('notificationSounds', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Language & Region</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Language</Label>
              <Select value={appSettings.language} onValueChange={(value) => handleAppSettingChange('language', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Privacy & Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="storage">Data Storage</Label>
              <Select value={appSettings.dataStorage} onValueChange={(value) => handleAppSettingChange('dataStorage', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Only</SelectItem>
                  <SelectItem value="cloud">Cloud Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={deleteAccount}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This action cannot be undone. All data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Settings</h1>
          <p className="text-gray-600">Manage your account, reminders, reports, and child tools all in one place.</p>
        </div>
      </div>

      {/* Profile Type */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-brand-red" />
            <span>🧑‍⚕️ Profile Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You're currently using a Caregiver profile. You can switch to a Patient profile anytime if you want to track your own health.
          </p>
          <div className="flex items-center space-x-3 mb-4">
            <div className="px-3 py-1 bg-brand-red text-white rounded-full text-sm font-medium">
              Caregiver (Active)
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowSwitchModal(true)}
            className="w-full"
          >
            Switch to Patient
          </Button>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('appointments')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>📆 Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            View and manage doctor visits for all your children.
          </p>
          <Button className="w-full bg-brand-red hover:bg-brand-red/90">
            Manage Appointments
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('emergency')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>🚨 Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Set up quick-access contacts in case of a crisis.
          </p>
          <Button className="w-full bg-brand-red hover:bg-brand-red/90">
            Setup Emergency Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Export Health Data */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('reports')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-500" />
            <span>📊 Export Health Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Download hydration, medication, and crisis history reports for any child.
          </p>
          <Button className="w-full bg-brand-red hover:bg-brand-red/90">
            Export Data
          </Button>
        </CardContent>
      </Card>

      {/* Notifications & Reminders */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('notifications')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <span>🔔 Notifications & Reminders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manage how and when you get alerts for each child.
          </p>
          <Button className="w-full bg-brand-red hover:bg-brand-red/90">
            Manage Reminders
          </Button>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('app-settings')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-500" />
            <span>⚙️ App Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Customize your experience and privacy preferences.
          </p>
          <Button className="w-full bg-brand-red hover:bg-brand-red/90">
            Open Settings
          </Button>
        </CardContent>
      </Card>

      {/* Switch Profile Modal */}
      <Dialog open={showSwitchModal} onOpenChange={setShowSwitchModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch to Patient Profile?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to switch your account type? You'll need to set up your own child profile.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSwitchModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSwitchToPatient}
                className="flex-1 bg-brand-red hover:bg-brand-red/90"
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaregiverProfileSettings;
