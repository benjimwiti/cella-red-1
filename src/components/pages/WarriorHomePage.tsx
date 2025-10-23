import { useState } from "react";
import { Bell, Heart, Droplet, Pill, Utensils, CloudSun, Trophy, ArrowRight, Target, Calendar, Activity, TrendingUp, Shield, Clock, RotateCcw, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import RiskIndicator from "@/components/RiskIndicator";
import SOSButton from "@/components/SOSButton";
import BottomNavigation from "@/components/BottomNavigation";
import { useWarriorData } from "@/hooks/useWarriorData";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WarriorHomePageProps {
  profileType: 'patient' | 'caregiver';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const WarriorHomePage = ({ profileType, activeTab, onTabChange }: WarriorHomePageProps) => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { data, isLoading } = useWarriorData(userId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [riskLevel] = useState<'low' | 'moderate' | 'high'>('low');

  // Update hydration mutation
  const updateHydrationMutation = useMutation({
    mutationFn: async (increment: boolean) => {
      const today = new Date().toISOString().split('T')[0];
      const current = hydration?.glasses_drank || 0;
      const newValue = increment ? current + 1 : Math.max(0, current - 1);

      await supabase
        .from('hydration_logs')
        .upsert({
          user_id: userId,
          date: today,
          glasses_drank: newValue,
          target_glasses: hydration?.target_glasses || 8
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydration_logs', userId] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update water intake. Please try again.",
        variant: "destructive",
      });
      console.error('Hydration update error:', error);
    },
  });

  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: async (increment: boolean) => {
      const today = new Date().toISOString().split('T')[0];
      const current = meds?.doses_taken || 0;
      const newValue = increment ? current + 1 : Math.max(0, current - 1);

      await supabase
        .from('medication_logs')
        .upsert({
          user_id: userId,
          date: today,
          doses_taken: newValue,
          target_doses: meds?.target_doses || 3
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication_logs', userId] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update medication intake. Please try again.",
        variant: "destructive",
      });
      console.error('Medication update error:', error);
    },
  });

  // Update meals mutation
  const updateMealsMutation = useMutation({
    mutationFn: async (increment: boolean) => {
      const today = new Date().toISOString().split('T')[0];
      const current = meals?.meals_eaten || 0;
      const newValue = increment ? current + 1 : Math.max(0, current - 1);

      await supabase
        .from('meals')
        .upsert({
          user_id: userId,
          date: today,
          meals_eaten: newValue,
          target_meals: meals?.target_meals || 3
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', userId] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update meals. Please try again.",
        variant: "destructive",
      });
      console.error('Meals update error:', error);
    },
  });

  // Reset daily logs mutation
  const resetLogsMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Reset hydration logs
      await supabase
        .from('hydration_logs')
        .update({ glasses_drank: 0 })
        .eq('user_id', userId)
        .eq('date', today);

      // Reset medication logs
      await supabase
        .from('medication_logs')
        .update({ doses_taken: 0 })
        .eq('user_id', userId)
        .eq('date', today);

      // Reset meals
      await supabase
        .from('meals')
        .update({ meals_eaten: 0 })
        .eq('user_id', userId)
        .eq('date', today);
    },
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['hydration_logs', userId] });
      queryClient.invalidateQueries({ queryKey: ['medication_logs', userId] });
      queryClient.invalidateQueries({ queryKey: ['meals', userId] });

      toast({
        title: "Daily logs reset",
        description: "All daily health logs have been reset to zero for a fresh start.",
      });
    },
    onError: (error) => {
      toast({
        title: "Reset failed",
        description: "Failed to reset daily logs. Please try again.",
        variant: "destructive",
      });
      console.error('Reset logs error:', error);
    },
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const avatarImage = "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png";

  // Extract data from the hook
  const hydration = data?.hydration_logs?.[0];
  const meals = data?.meals?.[0];
  const meds = data?.medication_logs?.[0];
  const profile = data?.profiles?.[0];

  // Calculate today's stats from live data
  const todayStats = {
    hydration: {
      current: hydration?.glasses_drank || 0,
      target: hydration?.target_glasses || 8,
      percentage: hydration ? (hydration.glasses_drank / hydration.target_glasses) * 100 : 0
    },
    medications: {
      current: meds?.doses_taken || 0,
      target: meds?.target_doses || 3,
      percentage: meds ? (meds.doses_taken / meds.target_doses) * 100 : 0
    },
    meals: {
      current: meals?.meals_eaten || 0,
      target: meals?.target_meals || 3,
      percentage: meals ? (meals.meals_eaten / meals.target_meals) * 100 : 0
    },
    mood: 8.5, // This might need to be fetched from a mood table if available
    streakDays: 12 // This might need calculation from logs
  };

  const quickActions = [
    { 
      id: 'hydration', 
      title: 'Water Intake', 
      icon: Droplet, 
      value: `${todayStats.hydration.current}/${todayStats.hydration.target} glasses`,
      progress: todayStats.hydration.percentage,
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'medications', 
      title: 'Medications', 
      icon: Pill, 
      value: `${todayStats.medications.current}/${todayStats.medications.target} doses`,
      progress: todayStats.medications.percentage,
      gradient: 'from-purple-500 to-pink-400',
      bgGradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'nutrition', 
      title: 'Nutrition', 
      icon: Utensils, 
      value: `${todayStats.meals.current}/${todayStats.meals.target} meals`,
      progress: todayStats.meals.percentage,
      gradient: 'from-green-500 to-emerald-400',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    { 
      id: 'weather', 
      title: 'Weather Impact', 
      icon: CloudSun, 
      value: '72°F',
      subtitle: 'Low risk today',
      gradient: 'from-orange-500 to-yellow-400',
      bgGradient: 'from-orange-50 to-yellow-50',
      iconColor: 'text-orange-600'
    }
  ];






  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your warrior dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-red via-red-500 to-pink-500 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20 ring-4 ring-white/30 shadow-xl">
                <AvatarImage src={avatarImage} alt="Warrior Avatar" />
                <AvatarFallback className="bg-white/20 text-white text-2xl">
                  <Heart className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {greeting}, Warrior! 💪
                </h1>
                <p className="text-xl opacity-90">
                  Ready to conquer today's goals?
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Shield className="w-4 h-4 mr-1" />
                    {todayStats.streakDays}-day streak
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Target className="w-4 h-4 mr-1" />
                    Level: Champion
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </Button>
              <div className="text-right text-white">
                <p className="text-sm opacity-75">Current Mood</p>
                <p className="text-2xl font-bold">{todayStats.mood}/10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Indicator */}
        <RiskIndicator level={riskLevel} />

        {/* Today's Progress Overview */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-foreground-secondary to-foreground backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="w-6 h-6 text-brand-red" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Progress */}
              <div className="text-center p-4 bg-gradient-to-br from-brand-red/5 to-pink-50 rounded-2xl">
                <div className="text-3xl font-bold text-brand-red mb-2">78%</div>
                <p className="text-sm text-gray-600">Daily Goals</p>
                <Progress value={78} className="mt-2 h-2" />
              </div>
              
              {/* Streak Counter */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{todayStats.streakDays}</div>
                <p className="text-sm text-gray-600">Day Streak</p>
                <div className="flex items-center justify-center mt-2 text-blue-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs">+2 from last week</span>
                </div>
              </div>

              {/* Next Appointment */}
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="text-lg font-bold text-purple-600 mb-2">Friday</div>
                <p className="text-sm text-gray-600">Next Check-up</p>
                <div className="flex items-center justify-center mt-2 text-purple-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">3 days away</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Circle */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Your Circle</h3>
                  <p className="text-lg opacity-90">
                    See how your warriors are doing today 🔥
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-white/30 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm opacity-75">3 warriors online</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </div>
          </CardContent>
        </Card>

        {/* Health Tracking Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground-secondary flex items-center gap-3">
            <Heart className="w-7 h-7 text-brand-red" />
            Health Tracking
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Card key={action.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
                <div className={`h-2 bg-gradient-to-r ${action.gradient}`}></div>
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-br ${action.bgGradient} rounded-2xl p-4 mb-4 group-hover:scale-105 transition-transform`}>
                    <action.icon className={`w-8 h-8 ${action.iconColor} mx-auto`} />
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 text-center">{action.title}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">{action.value}</p>

                  {action.progress && (
                    <div className="space-y-2">
                      <Progress value={action.progress} className="h-2" />
                      <p className="text-xs text-foreground text-center">{Math.round(action.progress)}% complete</p>
                    </div>
                  )}

                  {action.subtitle && (
                    <p className="text-xs text-gray-500 text-center mt-2">{action.subtitle}</p>
                  )}

                  {/* Action Buttons for hydration, medications, and nutrition */}
                  {(action.id === 'hydration' || action.id === 'medications' || action.id === 'nutrition') && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (action.id === 'hydration') {
                            updateHydrationMutation.mutate(false);
                          } else if (action.id === 'medications') {
                            updateMedicationMutation.mutate(false);
                          } else if (action.id === 'nutrition') {
                            updateMealsMutation.mutate(false);
                          }
                        }}
                        disabled={
                          (action.id === 'hydration' && updateHydrationMutation.isPending) ||
                          (action.id === 'medications' && updateMedicationMutation.isPending) ||
                          (action.id === 'nutrition' && updateMealsMutation.isPending)
                        }
                        className="h-8 w-8 p-0 border-gray-300 hover:border-red-400 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (action.id === 'hydration') {
                            updateHydrationMutation.mutate(true);
                          } else if (action.id === 'medications') {
                            updateMedicationMutation.mutate(true);
                          } else if (action.id === 'nutrition') {
                            updateMealsMutation.mutate(true);
                          }
                        }}
                        disabled={
                          (action.id === 'hydration' && updateHydrationMutation.isPending) ||
                          (action.id === 'medications' && updateMedicationMutation.isPending) ||
                          (action.id === 'nutrition' && updateMealsMutation.isPending)
                        }
                        className="h-8 w-8 p-0 bg-brand-red hover:bg-red-600 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-foreground to-foreground-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground-secondary">
              <Calendar className="w-6 h-6 text-brand-red" />
              This Week's Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">5/7</div>
                <p className="text-sm text-gray-600">Medication compliance</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">42L</div>
                <p className="text-sm text-gray-600">Water consumed</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">2</div>
                <p className="text-sm text-gray-600">Crisis-free days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="w-full flex justify-center bg-red">
          <Button
            onClick={() => resetLogsMutation.mutate()}
            disabled={resetLogsMutation.isPending}
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-brand-red hover:bg-brand-red/5 transition-all duration-300 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {resetLogsMutation.isPending ? 'Resetting...' : 'Reset Daily Logs'}
          </Button>
        </div>

        {/* SOS Button */}
        <div className="w-full">
          <SOSButton />
        </div>
      </div>
    </div>
  );
};

export default WarriorHomePage;