
import { useState } from "react";
import { Trophy, Heart, ArrowLeft, Medal, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CirclePageProps {
  profileType: 'patient' | 'caregiver';
}

// Mock data for demonstration
const mockMembers = [
  {
    id: 1,
    name: "Sarah M.",
    avatar: "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png",
    streak: 14,
    inCrisis: false,
    lastLog: "2 hours ago",
    role: "patient"
  },
  {
    id: 2,
    name: "Marcus K.",
    avatar: null,
    streak: 7,
    inCrisis: true,
    lastLog: "1 hour ago",
    role: "patient"
  },
  {
    id: 3,
    name: "Emma J.",
    avatar: null,
    streak: 21,
    inCrisis: false,
    lastLog: "30 min ago",
    role: "patient"
  },
  {
    id: 4,
    name: "David L.",
    avatar: null,
    streak: 3,
    inCrisis: false,
    lastLog: "4 hours ago",
    role: "patient"
  }
];

const reactions = [
  { emoji: "❤️", label: "Awesome job" },
  { emoji: "💪", label: "Stay strong" },
  { emoji: "🙌", label: "You rock!" }
];

const CirclePage = ({ profileType }: CirclePageProps) => {
  const [selectedReactions, setSelectedReactions] = useState<{[key: string]: string}>({});
  const [activeChild, setActiveChild] = useState("Emma J."); // For caregivers managing multiple children

  const sortedMembers = [...mockMembers].sort((a, b) => b.streak - a.streak);
  const topStreakHolder = sortedMembers[0];

  const handleReaction = (memberId: number, emoji: string) => {
    const key = `${memberId}-${emoji}`;
    setSelectedReactions(prev => ({
      ...prev,
      [key]: prev[key] ? "" : emoji
    }));
    
    // Show confirmation animation (could be enhanced with actual animation)
    console.log(`Reacted ${emoji} to member ${memberId}`);
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return "🏆 30-Day Champion";
    if (streak >= 21) return "🥇 3-Week Hero";
    if (streak >= 14) return "🥈 2-Week Star";
    if (streak >= 7) return "🥉 1-Week Warrior";
    return "Getting Started";
  };

  const totalMembers = mockMembers.length;
  const averageAdherence = Math.round(mockMembers.reduce((acc, member) => acc + (member.streak > 0 ? 85 : 50), 0) / totalMembers);
  const crisisCount = mockMembers.filter(m => m.inCrisis).length;
  const totalHealthyDays = mockMembers.reduce((acc, member) => acc + member.streak, 0);

  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-red rounded-full p-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-charcoal">Circle</h1>
            <p className="text-sm text-brand-charcoal/70">Your support community</p>
          </div>
        </div>
        {profileType === 'caregiver' && (
          <div className="text-right">
            <p className="text-sm text-brand-charcoal/70">Active Profile:</p>
            <p className="font-semibold text-brand-charcoal">{activeChild}</p>
          </div>
        )}
      </div>

      {/* Group Stats Panel */}
      <Card className="bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-brand-charcoal flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Group Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-red">{totalMembers}</div>
              <div className="text-sm text-brand-charcoal/70">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-red">{averageAdherence}%</div>
              <div className="text-sm text-brand-charcoal/70">Avg Adherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-red">{crisisCount}</div>
              <div className="text-sm text-brand-charcoal/70">Crisis Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-red">{totalHealthyDays}</div>
              <div className="text-sm text-brand-charcoal/70">Healthy Days</div>
            </div>
          </div>
          <div className="text-center pt-2 border-t border-brand-grey/30">
            <p className="text-brand-charcoal font-medium">
              Together, you've completed <span className="text-brand-red font-bold">{totalHealthyDays} healthy days!</span> 🎉
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-brand-charcoal flex items-center">
            <Medal className="w-5 h-5 mr-2" />
            Streak Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedMembers.map((member, index) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-brand-grey/10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🥇</span>
                    </div>
                  )}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar || undefined} alt={member.name} />
                    <AvatarFallback className="bg-brand-red text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-brand-charcoal">{member.name}</h3>
                    {member.inCrisis && (
                      <Badge className="bg-brand-red text-white text-xs">In Crisis Today</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-charcoal/70">
                    {member.streak > 0 ? `${member.streak}-Day Streak` : "No logs today yet"}
                  </p>
                  <p className="text-xs text-brand-charcoal/50">Last log: {member.lastLog}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge variant="outline" className="text-xs border-brand-red text-brand-red">
                  {getStreakBadge(member.streak)}
                </Badge>
                <div className="flex space-x-1">
                  {reactions.map((reaction) => {
                    const key = `${member.id}-${reaction.emoji}`;
                    const isSelected = selectedReactions[key] === reaction.emoji;
                    return (
                      <button
                        key={reaction.emoji}
                        onClick={() => handleReaction(member.id, reaction.emoji)}
                        className={`p-1 rounded-full transition-all duration-200 ${
                          isSelected 
                            ? 'bg-brand-red/20 scale-110' 
                            : 'bg-brand-grey/20 hover:bg-brand-grey/40'
                        }`}
                        title={reaction.label}
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Member Display Section */}
      <Card className="bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-brand-charcoal flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            All Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {mockMembers.map((member) => (
              <div key={member.id} className="p-4 rounded-xl bg-brand-grey/10 text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={member.avatar || undefined} alt={member.name} />
                  <AvatarFallback className="bg-brand-red text-white text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-brand-charcoal mb-1">{member.name}</h3>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <span className="text-2xl font-bold text-brand-red">{member.streak}</span>
                  <span className="text-sm text-brand-charcoal/70">days</span>
                </div>
                {member.inCrisis && (
                  <Badge className="bg-brand-red text-white text-xs mb-2">Crisis</Badge>
                )}
                <p className="text-xs text-brand-charcoal/50">{member.lastLog}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CirclePage;
