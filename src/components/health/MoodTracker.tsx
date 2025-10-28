import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Plus, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const MoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mode, setMode] = useState<'today' | 'all'>('today');

  const today = new Date().toISOString().split('T')[0];

  const { data: moodLogs, isLoading } = useQuery({
    queryKey: ['moodLogs', user?.id, mode === 'today' ? today : null],
    queryFn: async () => {
      if (!user?.id) return [];
      return await HealthService.getMoodLogs(user.id, mode === 'today' ? today : undefined);
    },
    enabled: !!user?.id,
  });

  const getMoodIcon = (level: number) => {
    if (level >= 8) return <Smile className="w-5 h-5 text-green-500" />;
    if (level >= 5) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getMoodColor = (level: number) => {
    if (level >= 8) return 'bg-green-100 text-green-800';
    if (level >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-yellow-500" />
            Mood Check
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Today's Mood</DialogTitle>
              </DialogHeader>
              <AddMoodForm
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['moodLogs'] });
                }}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant={mode === 'today' ? 'default' : 'outline'}
            onClick={() => setMode('today')}
            className={mode === 'today' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            Today's Mood
          </Button>
          <Button
            size="sm"
            variant={mode === 'all' ? 'default' : 'outline'}
            onClick={() => setMode('all')}
            className={mode === 'all' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            All Moods
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {moodLogs && moodLogs.length === 0 ? (
          <div className="text-center py-6 text-cella-grey">
            <Smile className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No mood logs yet</p>
            <p className="text-sm">Tap the + button to log your first mood</p>
          </div>
        ) : (
          moodLogs?.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getMoodColor(log.mood_level)}>
                    Level {log.mood_level}/10
                  </Badge>
                  {getMoodIcon(log.mood_level)}
                </div>
                {log.notes && (
                  <div className="text-sm text-cella-grey mt-1">
                    {log.notes}
                  </div>
                )}
              </div>
              <div className="text-xs text-cella-grey flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(log.date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const AddMoodForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    mood_level: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.logMood({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        mood_level: parseInt(formData.mood_level),
        notes: formData.notes || undefined
      });

      toast({
        title: "Mood Logged",
        description: "Your mood has been logged successfully",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mood_level">Mood Level (1-10)</Label>
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Frown className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">1 - Very Low</span>
            <span className="text-xs text-gray-500 mx-2">|</span>
            <Meh className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">5 - Neutral</span>
            <span className="text-xs text-gray-500 mx-2">|</span>
            <Smile className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">10 - Excellent</span>
          </div>
          <Input
            id="mood_level"
            type="number"
            min="1"
            max="10"
            value={formData.mood_level}
            onChange={(e) => setFormData({ ...formData, mood_level: e.target.value })}
            placeholder="Rate your mood (1-10)"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any thoughts or notes about your mood today..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-cella-rose hover:bg-cella-rose-dark">
        Log Mood
      </Button>
    </form>
  );
};

export default MoodTracker;
