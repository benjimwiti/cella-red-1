import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { HealthService } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const MealTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mode, setMode] = useState<'today' | 'all'>('today');

  const today = new Date().toISOString().split('T')[0];

  const { data: meals, isLoading } = useQuery({
    queryKey: ['meals', user?.id, mode === 'today' ? today : null],
    queryFn: async () => {
      if (!user?.id) return [];
      return await HealthService.getMeals(user.id, mode === 'today' ? today : undefined);
    },
    enabled: !!user?.id,
  });

  // Group meals by type
  const groupedMeals = meals?.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>) || {};

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks'
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
            <Utensils className="w-5 h-5 text-orange-500" />
            Meals
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Meal</DialogTitle>
              </DialogHeader>
              <AddMealForm
                onSuccess={() => {
                  setShowAddDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['meals'] });
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
            Today's Meals
          </Button>
          <Button
            size="sm"
            variant={mode === 'all' ? 'default' : 'outline'}
            onClick={() => setMode('all')}
            className={mode === 'all' ? 'bg-cella-rose hover:bg-cella-rose-dark' : ''}
          >
            All Meals
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.keys(groupedMeals).length === 0 ? (
          <div className="text-center py-6 text-cella-grey">
            <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No meals logged yet</p>
            <p className="text-sm">Tap the + button to log your first meal</p>
          </div>
        ) : (
          Object.entries(groupedMeals).map(([mealType, meals]) => (
            <div key={mealType}>
              <h3 className="font-medium text-sm text-cella-grey mb-2 capitalize">
                {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
              </h3>
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">
                        {meal.foods.join(', ')}
                      </div>
                      {meal.notes && (
                        <div className="text-sm text-cella-grey mt-1">
                          {meal.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-cella-grey flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(meal.meal_time).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const AddMealForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    meal_type: '' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    foods: [''],
    hydration_ml: '',
    notes: ''
  });

  const addFood = () => {
    setFormData(prev => ({
      ...prev,
      foods: [...prev.foods, '']
    }));
  };

  const removeFood = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index)
    }));
  };

  const updateFood = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      foods: prev.foods.map((food, i) => i === index ? value : food)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await HealthService.logMeal({
        user_id: user.id,
        meal_time: new Date().toISOString(),
        meal_type: formData.meal_type,
        foods: formData.foods.filter(food => food.trim()),
        hydration_ml: formData.hydration_ml ? parseInt(formData.hydration_ml) : undefined,
        notes: formData.notes || undefined
      });

      toast({
        title: "Meal Logged",
        description: `${formData.meal_type} has been logged successfully`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log meal",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="meal_type">Meal Type</Label>
        <Select
          value={formData.meal_type}
          onValueChange={(value: 'breakfast' | 'lunch' | 'dinner' | 'snack') =>
            setFormData({ ...formData, meal_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Foods</Label>
        <div className="space-y-2 mt-1">
          {formData.foods.map((food, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={food}
                onChange={(e) => updateFood(index, e.target.value)}
                placeholder="e.g., Oatmeal, Banana"
                required
              />
              {formData.foods.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeFood(index)}
                  className="p-2"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addFood}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Food
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="hydration_ml">Hydration (ml) - Optional</Label>
        <Input
          id="hydration_ml"
          type="number"
          value={formData.hydration_ml}
          onChange={(e) => setFormData({ ...formData, hydration_ml: e.target.value })}
          placeholder="e.g., 250"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes"
        />
      </div>

      <Button type="submit" className="w-full bg-cella-rose hover:bg-cella-rose-dark">
        Log Meal
      </Button>
    </form>
  );
};

export default MealTracker;
