
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const HydrationTracker = () => {
  const [waterIntake, setWaterIntake] = useState(3); // cups
  const dailyGoal = 8; // cups

  const addWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, dailyGoal + 2));
  };

  const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Hydration</span>
          <span className="text-sm font-normal text-cella-grey">{waterIntake}/{dailyGoal} cups</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Water Visual */}
        <div className="relative h-32 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-cella-hydration to-blue-300 transition-all duration-500 ease-out rounded-full"
            style={{ height: `${percentage}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        <Button 
          onClick={addWater}
          className="w-full bg-cella-hydration hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Water
        </Button>

        <p className="text-xs text-cella-grey text-center">
          {waterIntake >= dailyGoal ? "Great job! You've met your goal!" : `${dailyGoal - waterIntake} more cups to go`}
        </p>
      </CardContent>
    </Card>
  );
};

export default HydrationTracker;
