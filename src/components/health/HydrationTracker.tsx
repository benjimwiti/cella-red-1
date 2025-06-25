
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const HydrationTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [glasses, setGlasses] = useState(0);
  const goal = 8; // glasses per day

  const today = new Date().toISOString().split('T')[0];

  const { data: todayLog, isLoading } = useQuery({
    queryKey: ['hydration', user?.id, today],
    queryFn: async () => {
      if (!user?.id) return null;
      const logs = await HealthService.getHydrationLogs(user.id, today);
      return logs[0] || null;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (todayLog) {
      setGlasses(todayLog.glasses_consumed);
    }
  }, [todayLog]);

  const updateHydration = async (newGlasses: number) => {
    if (!user?.id || newGlasses < 0) return;

    try {
      await HealthService.logHydration(user.id, newGlasses, today);
      setGlasses(newGlasses);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['hydration', user.id, today] });
      
      toast({
        title: "Hydration Updated",
        description: `You've had ${newGlasses} glasses today. ${newGlasses >= goal ? 'Great job!' : 'Keep going!'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hydration log",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = Math.min((glasses / goal) * 100, 100);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="w-5 h-5 text-blue-500" />
          Daily Hydration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-cella-rose">
            {glasses}
          </div>
          <div className="text-sm text-cella-grey">
            of {goal} glasses
          </div>
        </div>

        <Progress value={progressPercentage} className="h-3" />

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateHydration(glasses - 1)}
            disabled={glasses <= 0}
            className="w-10 h-10 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => updateHydration(glasses + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Glass
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateHydration(glasses + 1)}
            className="w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {glasses >= goal && (
          <div className="text-center text-green-600 font-medium">
            🎉 Goal achieved! Great hydration today!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HydrationTracker;
