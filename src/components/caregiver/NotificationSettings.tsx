
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Smartphone, Mail, MessageSquare, Clock, Heart, Droplet, Pill } from "lucide-react";

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

interface NotificationSettingsProps {
  warriors: WarriorProfile[];
}

interface NotificationSetting {
  id: string;
  type: 'medication' | 'hydration' | 'appointment' | 'crisis' | 'general';
  warriorId?: string;
  enabled: boolean;
  method: 'push' | 'email' | 'sms';
  frequency: 'immediate' | 'daily' | 'weekly';
  time?: string;
}

const NotificationSettings = ({ warriors }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      type: 'medication',
      warriorId: '1',
      enabled: true,
      method: 'push',
      frequency: 'immediate',
      time: '08:00'
    },
    {
      id: '2',
      type: 'hydration',
      warriorId: '1',
      enabled: true,
      method: 'push',
      frequency: 'daily',
      time: '18:00'
    },
    {
      id: '3',
      type: 'crisis',
      enabled: true,
      method: 'push',
      frequency: 'immediate'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '07:00'
  });

  const toggleSetting = (settingId: string) => {
    setSettings(settings.map(s => 
      s.id === settingId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateSetting = (settingId: string, field: string, value: string) => {
    setSettings(settings.map(s => 
      s.id === settingId ? { ...s, [field]: value } : s
    ));
  };

  const addNotificationRule = (type: string, warriorId?: string) => {
    const newSetting: NotificationSetting = {
      id: Date.now().toString(),
      type: type as any,
      warriorId,
      enabled: true,
      method: 'push',
      frequency: 'immediate'
    };
    setSettings([...settings, newSetting]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-4 h-4 text-yellow-500" />;
      case 'hydration': return <Droplet className="w-4 h-4 text-blue-500" />;
      case 'appointment': return <Clock className="w-4 h-4 text-green-500" />;
      case 'crisis': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-brand-red" />
          <span className="text-sm text-gray-600">Manage alerts and reminders</span>
        </div>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications on this device</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={globalSettings.pushNotifications}
              onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, pushNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={globalSettings.emailNotifications}
              onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={globalSettings.smsNotifications}
              onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, smsNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <p className="text-sm text-gray-600">Reduce notifications during specified hours</p>
              </div>
            </div>
            <Switch
              id="quiet-hours"
              checked={globalSettings.quietHours}
              onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, quietHours: checked })}
            />
          </div>

          {globalSettings.quietHours && (
            <div className="flex items-center space-x-4 pl-8">
              <div className="flex items-center space-x-2">
                <Label htmlFor="quiet-start">From:</Label>
                <Select value={globalSettings.quietStart} onValueChange={(value) => setGlobalSettings({ ...globalSettings, quietStart: value })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="quiet-end">To:</Label>
                <Select value={globalSettings.quietEnd} onValueChange={(value) => setGlobalSettings({ ...globalSettings, quietEnd: value })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => {
            const warrior = setting.warriorId ? warriors.find(w => w.id === setting.warriorId) : null;
            return (
              <div key={setting.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(setting.type)}
                    <div>
                      <h3 className="font-semibold capitalize">{setting.type} Notifications</h3>
                      {warrior && (
                        <Badge variant="secondary" className="mt-1">
                          {warrior.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </div>

                {setting.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Method</Label>
                      <Select 
                        value={setting.method} 
                        onValueChange={(value) => updateSetting(setting.id, 'method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="push">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-4 h-4" />
                              <span>Push Notification</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="email">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>Email</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4" />
                              <span>SMS</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select 
                        value={setting.frequency} 
                        onValueChange={(value) => updateSetting(setting.id, 'frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(setting.frequency === 'daily' || setting.frequency === 'weekly') && (
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Select 
                          value={setting.time || ''} 
                          onValueChange={(value) => updateSetting(setting.id, 'time', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                {i.toString().padStart(2, '0')}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add New Rule Button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => addNotificationRule('general')}
              className="border-dashed"
            >
              <Bell className="w-4 h-4 mr-2" />
              Add Notification Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => console.log('Setup essential notifications')}
            >
              <Bell className="w-6 h-6 text-brand-red" />
              <span>Essential Notifications</span>
              <span className="text-xs text-gray-600">Crisis & medication alerts only</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => console.log('Setup comprehensive notifications')}
            >
              <Smartphone className="w-6 h-6 text-blue-500" />
              <span>Comprehensive Setup</span>
              <span className="text-xs text-gray-600">All health tracking notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
