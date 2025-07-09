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
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      {/* Header - Responsive */}
      <div className="bg-brand-red text-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Managing: {warrior.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                👩‍⚕️ Logged in as Caregiver
              </p>
            </div>
          </div>

          {/* Warrior Info - Responsive layout */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-white/20 flex-shrink-0">
              <AvatarImage src={warrior.avatar} alt={warrior.name} />
              <AvatarFallback className="bg-white/20 text-white text-lg sm:text-2xl">
                {warrior.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{warrior.name}</h2>
              <p className="text-white/80 text-sm sm:text-base mb-2">Age {warrior.age}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
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
      </div>

      {/* Tabs - Responsive scrollable */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gray-50 border-b overflow-x-auto">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="w-full sm:w-auto justify-start bg-transparent p-0 h-auto gap-0">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 px-3 sm:px-4 py-3 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm sm:text-base">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="flex items-center space-x-2 px-3 sm:px-4 py-3 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm sm:text-base">Calendar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="logs" 
                className="flex items-center space-x-2 px-3 sm:px-4 py-3 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm sm:text-base">Logs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="medications" 
                className="flex items-center space-x-2 px-3 sm:px-4 py-3 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
              >
                <Pill className="w-4 h-4" />
                <span className="text-sm sm:text-base">Medications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center space-x-2 px-3 sm:px-4 py-3 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm sm:text-base">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Quick Stats - Responsive grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Droplet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">6/8</p>
                  <p className="text-xs sm:text-sm text-gray-600">Glasses Today</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">100%</p>
                  <p className="text-xs sm:text-sm text-gray-600">Med Adherence</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">5</p>
                  <p className="text-xs sm:text-sm text-gray-600">Days Since Crisis</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">12</p>
                  <p className="text-xs sm:text-sm text-gray-600">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Responsive */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                  <Pill className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Hydroxyurea taken</p>
                    <p className="text-xs sm:text-sm text-gray-600">Today at 8:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Hydration logged</p>
                    <p className="text-xs sm:text-sm text-gray-600">6 glasses - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Mild pain reported</p>
                    <p className="text-xs sm:text-sm text-gray-600">Yesterday at 3:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with responsive placeholder content */}
          <TabsContent value="calendar">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Health Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8 text-sm sm:text-base">
                  Calendar view with color-coded health events coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Health Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8 text-sm sm:text-base">
                  Detailed health logs and entries coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8 text-sm sm:text-base">
                  Medication tracking and management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Warrior Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8 text-sm sm:text-base">
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
