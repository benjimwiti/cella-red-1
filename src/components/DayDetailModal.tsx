
import { X, Droplet, Utensils, Pill, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DayDetailModalProps {
  date: Date;
  onClose: () => void;
}

const DayDetailModal = ({ date, onClose }: DayDetailModalProps) => {
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">{formattedDate}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hydration */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Droplet className="w-5 h-5 text-cella-hydration" />
            <div>
              <h4 className="font-medium">Hydration</h4>
              <p className="text-sm text-gray-600">6/8 cups consumed</p>
            </div>
          </div>

          {/* Meals */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Utensils className="w-5 h-5 text-cella-healthy" />
            <div>
              <h4 className="font-medium">Meals</h4>
              <p className="text-sm text-gray-600">3 healthy meals logged</p>
            </div>
          </div>

          {/* Medications */}
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Pill className="w-5 h-5 text-cella-medication" />
            <div>
              <h4 className="font-medium">Medications</h4>
              <p className="text-sm text-gray-600">All medications taken on time</p>
            </div>
          </div>

          {/* Weather */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-1">Weather</h4>
            <p className="text-sm text-gray-600">Sunny, 75°F - Perfect day for outdoor activities</p>
          </div>

          <Button 
            className="w-full bg-cella-rose hover:bg-cella-rose-dark text-white"
          >
            Add Entry for This Day
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayDetailModal;
