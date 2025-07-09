
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
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <div className="pt-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Health Calendar
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your health journey
          </p>
        </div>

        {/* Calendar - Responsive container */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <HealthCalendar onDateSelect={handleDateSelect} />
        </div>

        {/* Legend - Responsive grid */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
              <span>Crisis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Low Hydration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span>Healthy Meal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
              <span>Missed Med</span>
            </div>
          </div>
        </div>

        {/* Floating Add Button - Responsive positioning */}
        <Button className="fixed bottom-24 right-4 sm:right-6 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-red hover:bg-brand-red/90 text-white shadow-lg z-40">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        {/* Day Detail Modal */}
        {showModal && selectedDate && (
          <DayDetailModal 
            date={selectedDate} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
