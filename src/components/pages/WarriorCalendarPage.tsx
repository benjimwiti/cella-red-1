import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Zap, TrendingUp, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, isSameMonth, startOfMonth, endOfMonth } from "date-fns";

const WarriorCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Mock health data for visualization
  const healthData = {
    "2025-01-15": { type: "crisis", severity: "high", note: "Pain episode" },
    "2025-01-14": { type: "medication", severity: "good", note: "All meds taken" },
    "2025-01-13": { type: "hydration", severity: "medium", note: "6/8 glasses" },
    "2025-01-12": { type: "exercise", severity: "good", note: "30min walk" },
    "2025-01-11": { type: "doctor", severity: "neutral", note: "Checkup" },
  };

  const getDateHealthData = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return healthData[dateKey as keyof typeof healthData];
  };

  const monthlyStats = {
    crisisFree: 28,
    medicationCompliance: 94,
    hydrationGoal: 87,
    mood: 8.2
  };

  const upcomingEvents = [
    { date: "Jan 20", event: "Hematology Appointment", type: "appointment" },
    { date: "Jan 22", event: "Lab Results Due", type: "reminder" },
    { date: "Jan 25", event: "Medication Refill", type: "medication" },
  ];

  const modifiers = {
    crisis: Object.keys(healthData)
      .filter(key => healthData[key as keyof typeof healthData].type === 'crisis')
      .map(key => new Date(key)),
    good: Object.keys(healthData)
      .filter(key => ['medication', 'exercise'].includes(healthData[key as keyof typeof healthData].type))
      .map(key => new Date(key)),
    medium: Object.keys(healthData)
      .filter(key => healthData[key as keyof typeof healthData].type === 'hydration')
      .map(key => new Date(key)),
    appointment: Object.keys(healthData)
      .filter(key => healthData[key as keyof typeof healthData].type === 'doctor')
      .map(key => new Date(key))
  };

  const modifiersStyles = {
    crisis: { 
      backgroundColor: '#ef4444', 
      color: 'white',
      borderRadius: '50%',
      fontWeight: 'bold'
    },
    good: { 
      backgroundColor: '#22c55e', 
      color: 'white',
      borderRadius: '50%'
    },
    medium: { 
      backgroundColor: '#f59e0b', 
      color: 'white',
      borderRadius: '50%'
    },
    appointment: { 
      backgroundColor: '#8b5cf6', 
      color: 'white',
      borderRadius: '50%'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Timeline</h1>
          <p className="text-gray-600">Track your wellness journey</p>
        </div>

        {/* Monthly Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-400 text-white border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{monthlyStats.crisisFree}</div>
              <p className="text-sm opacity-90">Crisis-free days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{monthlyStats.medicationCompliance}%</div>
              <p className="text-sm opacity-90">Med compliance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-pink-400 text-white border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{monthlyStats.hydrationGoal}%</div>
              <p className="text-sm opacity-90">Hydration goal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{monthlyStats.mood}/10</div>
              <p className="text-sm opacity-90">Avg mood</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-brand-red to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6" />
                  {format(currentMonth, "MMMM yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="w-full"
                />
                
                {/* Legend */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>Crisis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Good day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>Attention needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span>Appointment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Selected Day Details */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isToday(selectedDate) ? "Today" : format(selectedDate, "MMM dd")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getDateHealthData(selectedDate) ? (
                  <div className="space-y-3">
                    <Badge variant={getDateHealthData(selectedDate)?.type === 'crisis' ? 'destructive' : 'secondary'}>
                      {getDateHealthData(selectedDate)?.type}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {getDateHealthData(selectedDate)?.note}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No entries for this day</p>
                    <Button size="sm" className="bg-brand-red hover:bg-brand-red/90">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Health Event
                </Button>
                
                <Button variant="outline" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Trends
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Events
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Floating Action Button */}
        <Button 
          size="lg"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-brand-red to-pink-500 hover:from-brand-red/90 hover:to-pink-500/90 shadow-2xl z-40"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default WarriorCalendarPage;