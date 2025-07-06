
import { useState } from "react";
import { Trophy, Heart, ArrowLeft, Medal, Calendar, Users, Plus, Copy, Mail, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CirclePageProps {
  profileType: 'patient' | 'caregiver';
}

type CircleView = 'empty' | 'create' | 'invite' | 'join' | 'members' | 'approval';

// Mock data for demo when no real circle exists
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [view, setView] = useState<CircleView>('empty');
  const [selectedReactions, setSelectedReactions] = useState<{[key: string]: string}>({});
  const [activeChild, setActiveChild] = useState("Emma J.");
  const [createStep, setCreateStep] = useState(1);
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [circleEmoji, setCircleEmoji] = useState("🏆");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Fetch user's circles
  const { data: userCircles, isLoading } = useQuery({
    queryKey: ['user-circles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: memberData } = await supabase
        .from('circle_members')
        .select(`
          circle_id,
          status,
          circles (
            id,
            name,
            description,
            emoji,
            creator_id,
            invite_code
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'approved');

      return memberData?.map(m => m.circles).filter(Boolean) || [];
    },
    enabled: !!user
  });

  // Create circle mutation
  const createCircleMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; emoji: string }) => {
      const { data: circle, error } = await supabase
        .from('circles')
        .insert({
          name: data.name,
          description: data.description,
          emoji: data.emoji,
          creator_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return circle;
    },
    onSuccess: (circle) => {
      queryClient.invalidateQueries({ queryKey: ['user-circles'] });
      setInviteCode(circle.invite_code);
      setView('invite');
    }
  });

  // Send email invite mutation
  const sendInviteMutation = useMutation({
    mutationFn: async (email: string) => {
      // Here you would typically call an edge function to send the email
      // For now, we'll just create a record in the invites table
      const circle = userCircles?.[0];
      if (!circle) throw new Error('No circle found');

      const { error } = await supabase
        .from('circle_invites')
        .insert({
          circle_id: circle.id,
          email: email,
          invited_by: user?.id
        });

      if (error) throw error;
    }
  });

  const handleCreateCircle = async () => {
    if (createStep < 3) {
      setCreateStep(createStep + 1);
      return;
    }

    createCircleMutation.mutate({
      name: circleName,
      description: circleDescription,
      emoji: circleEmoji
    });
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    
    try {
      await sendInviteMutation.mutateAsync(inviteEmail);
      setInviteEmail("");
      // Show success message
    } catch (error) {
      console.error('Failed to send invite:', error);
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    // Show success toast
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
          <p className="mt-2 text-brand-charcoal/70">Loading your Circle...</p>
        </div>
      </div>
    );
  }

  // Show empty state when user has no circles
  if ((!userCircles || userCircles.length === 0) && view === 'empty') {
    return (
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Demo Banner */}
        <div className="bg-blush-red border border-brand-red/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-brand-red" />
            <span className="font-semibold text-brand-red text-sm">DEMO CIRCLE</span>
          </div>
          <p className="text-xs text-brand-charcoal/70 mt-1">This is a preview of how your Circle will look with members</p>
        </div>

        <div className="text-center py-12">
          <div className="bg-brand-red rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal mb-3">You haven't joined a Circle yet</h2>
          <p className="text-brand-charcoal/70 mb-8 max-w-md mx-auto">
            Create a Circle to connect with other warriors and caregivers. Share progress, celebrate streaks, and support each other.
          </p>
          <Button 
            onClick={() => setView('create')}
            className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-6 text-lg font-semibold rounded-xl"
          >
            Create a Circle
          </Button>
        </div>

        {/* Demo Preview */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-brand-charcoal mb-4 text-center">Preview: How your Circle will look</h3>
          
          {/* Demo Group Stats */}
          <Card className="bg-white shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-brand-charcoal flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-red">4</div>
                  <div className="text-sm text-brand-charcoal/70">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-red">87%</div>
                  <div className="text-sm text-brand-charcoal/70">Avg Adherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-red">1</div>
                  <div className="text-sm text-brand-charcoal/70">Crisis Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-red">45</div>
                  <div className="text-sm text-brand-charcoal/70">Healthy Days</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-brand-grey/30">
                <p className="text-brand-charcoal font-medium">
                  Together, you've completed <span className="text-brand-red font-bold">45 healthy days!</span> 🎉
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Members */}
          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-brand-charcoal flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Circle Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMembers.slice(0, 2).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-brand-grey/10">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar || undefined} alt={member.name} />
                        <AvatarFallback className="bg-brand-red text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
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
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-red">{member.streak}</div>
                      <div className="text-xs text-brand-charcoal/70">days</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create Circle Flow
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setView('empty')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-brand-charcoal">Create Circle</h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= createStep ? 'bg-brand-red text-white' : 'bg-brand-grey text-brand-charcoal/50'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 ${
                    step < createStep ? 'bg-brand-red' : 'bg-brand-grey'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card className="bg-white shadow-card">
            <CardContent className="p-6">
              {createStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-brand-charcoal">Name your Circle</h2>
                  <Input
                    placeholder="e.g., Warriors United"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    className="text-lg"
                  />
                </div>
              )}

              {createStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-brand-charcoal">Add a description (Optional)</h2>
                  <Textarea
                    placeholder="Tell members what this Circle is about..."
                    value={circleDescription}
                    onChange={(e) => setCircleDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {createStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-brand-charcoal">Choose an emoji</h2>
                  <div className="grid grid-cols-6 gap-3">
                    {['🏆', '💪', '❤️', '🌟', '🔥', '🎯', '🤝', '💯', '⭐', '👑', '🎉', '🌈'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setCircleEmoji(emoji)}
                        className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                          circleEmoji === emoji ? 'border-brand-red bg-blush-red' : 'border-brand-grey hover:border-brand-red/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleCreateCircle}
                disabled={!circleName || createCircleMutation.isPending}
                className="w-full mt-6 bg-brand-red hover:bg-brand-red/90 text-white py-3 text-lg font-semibold rounded-xl"
              >
                {createStep < 3 ? 'Next' : createCircleMutation.isPending ? 'Creating...' : 'Create Circle'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Invite Members Screen
  if (view === 'invite') {
    const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
    
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-brand-success rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-charcoal mb-2">Your Circle is ready!</h1>
            <p className="text-brand-charcoal/70">Invite members to get started 🎉</p>
          </div>

          <Card className="bg-white shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-brand-charcoal">Invite Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={inviteLink} readOnly className="text-sm" />
                <Button onClick={copyInviteLink} variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-brand-charcoal/70">
                Share this link with warriors and caregivers you want to invite
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-brand-charcoal">Send Email Invites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <Button 
                  onClick={handleSendInvite}
                  disabled={!inviteEmail || sendInviteMutation.isPending}
                  className="bg-brand-red hover:bg-brand-red/90 text-white"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              {sendInviteMutation.isPending && (
                <p className="text-sm text-brand-charcoal/70">Sending invitation...</p>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={() => setView('members')}
            className="w-full mt-8 bg-brand-red hover:bg-brand-red/90 text-white py-3 text-lg font-semibold rounded-xl"
          >
            Continue to Circle
          </Button>
        </div>
      </div>
    );
  }

  // Default to existing members view (your original Circle page code)
  const sortedMembers = [...mockMembers].sort((a, b) => b.streak - a.streak);
  const topStreakHolder = sortedMembers[0];
  const totalMembers = mockMembers.length;
  const averageAdherence = Math.round(mockMembers.reduce((acc, member) => acc + (member.streak > 0 ? 85 : 50), 0) / totalMembers);
  const crisisCount = mockMembers.filter(m => m.inCrisis).length;
  const totalHealthyDays = mockMembers.reduce((acc, member) => acc + member.streak, 0);

  const handleReaction = (memberId: number, emoji: string) => {
    const key = `${memberId}-${emoji}`;
    setSelectedReactions(prev => ({
      ...prev,
      [key]: prev[key] ? "" : emoji
    }));
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return "🏆 30-Day Champion";
    if (streak >= 21) return "🥇 3-Week Hero";
    if (streak >= 14) return "🥈 2-Week Star";
    if (streak >= 7) return "🥉 1-Week Warrior";
    return "Getting Started";
  };

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
