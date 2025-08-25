import { Bell, Calendar, Users, Download, Settings, LogOut, Camera, Shield, TrendingUp, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface WarriorProfilePageProps {
  profileType: 'patient' | 'caregiver';
  onProfileChange: (type: 'patient' | 'caregiver' | null) => void;
}

const WarriorProfilePage = ({ profileType, onProfileChange }: WarriorProfilePageProps) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'settings'>('overview');
  
  const avatarImage = "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png";
  
  const warriorStats = {
    level: "Champion Warrior",
    streak: 45,
    totalPoints: 2850,
    rank: 1,
    achievements: 12,
    healthScore: 85
  };

  const achievements = [
    { id: 1, title: "Hydration Hero", description: "30 days of perfect hydration", earned: true, icon: "💧" },
    { id: 2, title: "Medication Master", description: "100% compliance for 60 days", earned: true, icon: "💊" },
    { id: 3, title: "Crisis Warrior", description: "90 days crisis-free", earned: true, icon: "🛡️" },
    { id: 4, title: "Support Champion", description: "Helped 10+ warriors", earned: false, icon: "🤝" },
  ];

  const profileOptions = [
    { icon: Calendar, title: "Health Calendar", subtitle: "View your health timeline", color: "from-blue-500 to-cyan-400" },
    { icon: Users, title: "Emergency Contacts", subtitle: "Manage your support network", color: "from-green-500 to-emerald-400" },
    { icon: Download, title: "Health Reports", subtitle: "Export your data", color: "from-purple-500 to-pink-400" },
    { icon: Bell, title: "Notifications", subtitle: "Customize reminders", color: "from-orange-500 to-yellow-400" },
    { icon: Settings, title: "App Settings", subtitle: "Preferences & privacy", color: "from-gray-500 to-slate-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Warrior Profile</h1>
          <p className="text-gray-600">Your journey, your achievements</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-2 shadow-lg border">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-brand-red to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-red to-pink-500 h-24"></div>
                <CardContent className="p-6 -mt-16 relative">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24 mx-auto ring-4 ring-white shadow-xl">
                        <AvatarImage src={avatarImage} alt="Profile Avatar" />
                        <AvatarFallback className="bg-brand-red text-white text-3xl">W</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="absolute -bottom-2 right-1/2 translate-x-12 w-8 h-8 rounded-full bg-white border-2 border-brand-red"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-1">Alex Thunder</h3>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 mb-4">
                      {warriorStats.level}
                    </Badge>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-brand-red">{warriorStats.streak}</div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{warriorStats.totalPoints}</div>
                        <div className="text-sm text-gray-600">Total Points</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score */}
              <Card className="shadow-lg border-0 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">{warriorStats.healthScore}%</div>
                    <Progress value={warriorStats.healthScore} className="h-3" />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Excellent! You're maintaining great health habits.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Achievements */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">#{warriorStats.rank}</div>
                    <div className="text-sm opacity-90">Circle Rank</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-500 to-pink-400 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{warriorStats.achievements}</div>
                    <div className="text-sm opacity-90">Achievements</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500 to-emerald-400 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">28</div>
                    <div className="text-sm opacity-90">Goals Met</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">180</div>
                    <div className="text-sm opacity-90">Days Tracked</div>
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className={`p-4 rounded-xl border-2 transition-all ${
                          achievement.earned 
                            ? 'border-yellow-300 bg-yellow-50' 
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Logged hydration for today</span>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Completed medication reminder</span>
                      </div>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Joined Hydration Hero challenge</span>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Profile Type Switcher */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Profile Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current: <span className="capitalize">{profileType}</span></p>
                    <p className="text-sm text-gray-600">Switch between warrior and caregiver views</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => onProfileChange(profileType === 'patient' ? 'caregiver' : 'patient')}
                    className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                  >
                    Switch to {profileType === 'patient' ? 'Caregiver' : 'Warrior'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={index} 
                    className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${option.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`bg-gradient-to-r ${option.color} rounded-full p-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{option.title}</h3>
                          <p className="text-gray-600">{option.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sign Out */}
            <Card className="shadow-lg border-2 border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 text-lg font-semibold"
                  onClick={() => onProfileChange(null)}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarriorProfilePage;