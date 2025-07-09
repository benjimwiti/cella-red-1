import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  Droplet, 
  Pill, 
  AlertTriangle, 
  Heart,
  FileText,
  Settings,
  Bell
} from "lucide-react";

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
  onBack: () => void;
}

const WarriorProfileView = ({ warrior, onBack }: WarriorProfileViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'crisis': return 'text-red-600 bg-red-100';
      case 'attention': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-red text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Managing: {warrior.name}</h1>
            <p className="text-white/80">👩‍⚕️ Logged in as Caregiver</p>
          </div>
        </div>

        {/* Warrior Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 ring-4 ring-white/20">
            <AvatarImage src={warrior.avatar} alt={warrior.name} />
            <AvatarFallback className="bg-white/20 text-white text-xl">
              {warrior.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{warrior.name}</h2>
            <p className="text-white/80">Age {warrior.age}</p>
            <div className="flex space-x-2 mt-2">
              <Badge className={`${getStatusColor(warrior.status)} text-xs`}>
                {warrior.status}
              </Badge>
              <Badge className={`${getStatusColor(warrior.hydrationStatus)} text-xs`}>
                Hydration: {warrior.hydrationStatus}
              </Badge>
              <Badge className={`${getStatusColor(warrior.medicationStatus)} text-xs`}>
                Meds: {warrior.medicationStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-gray-50 p-1">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Logs</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center space-x-2">
            <Pill className="w-4 h-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Droplet className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">6/8</p>
                  <p className="text-sm text-gray-600">Glasses Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Pill className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-gray-600">Med Adherence</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">Days Since Crisis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Pill className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Hydroxyurea taken</p>
                    <p className="text-sm text-gray-600">Today at 8:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Hydration logged</p>
                    <p className="text-sm text-gray-600">6 glasses - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Mild pain reported</p>
                    <p className="text-sm text-gray-600">Yesterday at 3:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Health Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  Calendar view with color-coded health events coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Health Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  Detailed health logs and entries coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  Medication tracking and management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Warrior Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  Individual warrior settings coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WarriorProfileView;
