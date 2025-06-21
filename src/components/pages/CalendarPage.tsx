
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HealthCalendar from "@/components/HealthCalendar";
import DayDetailModal from "@/components/DayDetailModal";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Health Calendar</h1>
        <p className="text-cella-grey">Track your health journey</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <HealthCalendar onDateSelect={handleDateSelect} />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cella-crisis rounded-full"></div>
            <span>Crisis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cella-hydration rounded-full"></div>
            <span>Low Hydration</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cella-healthy rounded-full"></div>
            <span>Healthy Meal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cella-medication rounded-full"></div>
            <span>Missed Med</span>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <Button className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-cella-rose hover:bg-cella-rose-dark text-white shadow-lg">
        <Plus className="w-6 h-6" />
      </Button>

      {/* Day Detail Modal */}
      {showModal && selectedDate && (
        <DayDetailModal 
          date={selectedDate} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default CalendarPage;
