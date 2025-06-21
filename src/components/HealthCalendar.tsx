import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HealthCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const HealthCalendar = ({ onDateSelect }: HealthCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample health data - in a real app this would come from your database
  const healthData = {
    '2024-01-15': { crisis: true, hydration: false, healthy: true, medication: false },
    '2024-01-16': { crisis: false, hydration: true, healthy: true, medication: true },
    '2024-01-17': { crisis: false, hydration: true, healthy: false, medication: true },
    '2024-01-18': { crisis: false, hydration: false, healthy: true, medication: false },
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayData = healthData[dateKey];
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

      days.push(
        <div
          key={day}
          className={`h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
            isToday ? 'bg-cella-rose text-white' : ''
          }`}
          onClick={() => onDateSelect?.(date)}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayData && (
            <div className="flex space-x-1 mt-1">
              {dayData.crisis && <div className="w-2 h-2 bg-cella-crisis rounded-full"></div>}
              {!dayData.hydration && <div className="w-2 h-2 bg-cella-hydration rounded-full"></div>}
              {dayData.healthy && <div className="w-2 h-2 bg-cella-healthy rounded-full"></div>}
              {!dayData.medication && <div className="w-2 h-2 bg-cella-medication rounded-full"></div>}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-sm font-medium text-cella-grey">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
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
  );
};

export default HealthCalendar;
