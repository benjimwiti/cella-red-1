import { useState } from "react";
import { Trophy, Crown, Flame, Heart, Plus, MessageCircle, Target, Zap, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WarriorCirclePageProps {
  profileType: 'patient' | 'caregiver';
  onBack?: () => void;
}

const WarriorCirclePage = ({ profileType }: WarriorCirclePageProps) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'support'>('leaderboard');

  const warriors = [
    {
      id: 1,
      name: "Alex Thunder",
      avatar: "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png",
      streak: 45,
      level: "Champion",
      points: 2850,
      status: "crushing it",
      lastActive: "2 hours ago",
      badge: "🔥"
    },
    {
      id: 2,
      name: "Maya Storm", 
      avatar: null,
      streak: 32,
      level: "Warrior",
      points: 2100,
      status: "stayed strong today",
      lastActive: "4 hours ago",
      badge: "💪"
    },
    {
      id: 3,
      name: "Jordan Swift",
      avatar: null,
      streak: 28,
      level: "Fighter",
      points: 1920,
      status: "feeling good",
      lastActive: "1 day ago",
      badge: "⚡"
    },
    {
      id: 4,
      name: "Riley Bold",
      avatar: null,
      streak: 15,
      level: "Brave",
      points: 980,
      status: "taking it one day at a time",
      lastActive: "3 hours ago",
      badge: "🌟"
    }
  ];

  const currentUser = warriors[0]; // You are Alex Thunder
  
  const challenges = [
    {
      id: 1,
      title: "Hydration Hero",
      description: "Drink 8 glasses of water daily for 7 days",
      progress: 85,
      timeLeft: "2 days left",
      reward: "250 points",
      participants: 12,
      type: "weekly"
    },
    {
      id: 2,
      title: "Medication Master",
      description: "100% medication compliance for 30 days",
      progress: 93,
      timeLeft: "3 days left", 
      reward: "500 points",
      participants: 8,
      type: "monthly"
    },
    {
      id: 3,
      title: "Wellness Warrior",
      description: "Log mood and energy levels daily",
      progress: 67,
      timeLeft: "10 days left",
      reward: "300 points",
      participants: 15,
      type: "custom"
    }
  ];

  const supportMessages = [
    {
      id: 1,
      user: "Maya Storm",
      message: "Having a tough day but staying hydrated! 💧",
      time: "30 min ago",
      reactions: ["❤️", "💪", "🙌"],
      reactionCount: 5
    },
    {
      id: 2,
      user: "Jordan Swift",
      message: "Just hit 30 days crisis-free! Thank you all for the support 🎉",
      time: "2 hours ago",
      reactions: ["🔥", "👑", "🎉"],
      reactionCount: 12
    },
    {
      id: 3,
      user: "Riley Bold",
      message: "Doctor visit went great today. Feeling optimistic! ⭐",
      time: "1 day ago",
      reactions: ["❤️", "⭐", "💪"],
      reactionCount: 8
    }
  ];

  const getLevelColor = (level: string) => {
    const colors = {
      "Champion": "from-yellow-400 to-orange-500",
      "Warrior": "from-purple-500 to-pink-500", 
      "Fighter": "from-blue-500 to-cyan-400",
      "Brave": "from-green-500 to-emerald-400"
    };
    return colors[level as keyof typeof colors] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Warrior Circle 👑</h1>
            <p className="text-xl opacity-90 mb-4">Where legends support legends</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{currentUser.points}</div>
                <div className="text-sm opacity-75">Total Points</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">#{warriors.findIndex(w => w.id === currentUser.id) + 1}</div>
                <div className="text-sm opacity-75">Rank</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{currentUser.streak}</div>
                <div className="text-sm opacity-75">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-2 shadow-lg border">
            {[
              { id: 'leaderboard', label: 'Champions', icon: Trophy },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'support', label: 'Support', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {warriors.map((warrior, index) => (
                <Card key={warrior.id} className={`overflow-hidden border-0 shadow-lg ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`absolute -inset-1 bg-gradient-to-r ${getLevelColor(warrior.level)} rounded-full blur-sm ${index === 0 ? 'opacity-75' : 'opacity-50'}`}></div>
                          <Avatar className="relative w-16 h-16 ring-2 ring-white">
                            <AvatarImage src={warrior.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                              {warrior.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2">
                              {index === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
                              {index === 1 && <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>}
                              {index === 2 && <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{warrior.name}</h3>
                            <span className="text-2xl">{warrior.badge}</span>
                            {warrior.id === currentUser.id && <Badge variant="secondary">You</Badge>}
                          </div>
                          <p className="text-gray-600">{warrior.status}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {warrior.streak} days
                            </span>
                            <span>{warrior.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{warrior.points.toLocaleString()}</div>
                        <Badge className={`bg-gradient-to-r ${getLevelColor(warrior.level)} text-white border-0`}>
                          {warrior.level}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Leaderboard Stats */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Crown className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">Circle Champion</h3>
                  <p className="opacity-90">You're leading the pack!</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Points earned</span>
                    <span className="font-bold">+285</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank change</span>
                    <span className="font-bold text-green-600">↑ 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Streak extended</span>
                    <span className="font-bold">+7 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      {challenge.title}
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {challenge.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-600">{challenge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      {challenge.participants} warriors
                    </div>
                    <span className="text-orange-600 font-medium">{challenge.timeLeft}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-green-600">🏆 {challenge.reward}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Join Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Post something */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <input 
                    placeholder="Share your warrior journey..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support posts */}
            {supportMessages.map((post) => (
              <Card key={post.id} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {post.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{post.user}</span>
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.message}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {post.reactions.map((reaction, idx) => (
                            <span key={idx} className="text-lg cursor-pointer hover:scale-110 transition-transform">
                              {reaction}
                            </span>
                          ))}
                          <span className="text-sm text-gray-500 ml-1">{post.reactionCount}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action */}
        <Button 
          size="lg"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl z-40"
        >
          <Zap className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default WarriorCirclePage;