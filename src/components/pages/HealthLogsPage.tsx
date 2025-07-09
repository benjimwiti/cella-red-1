
import HydrationTracker from '@/components/health/HydrationTracker';
import MedicationTracker from '@/components/health/MedicationTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, TrendingUp } from 'lucide-react';

const HealthLogsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Health Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor your daily health metrics
          </p>
        </div>

        {/* Quick Stats Overview - Responsive grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 text-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red mx-auto mb-2" />
              <div className="text-base sm:text-lg font-bold">7</div>
              <div className="text-xs sm:text-sm text-gray-600">Days Tracked</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 text-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-base sm:text-lg font-bold">3</div>
              <div className="text-xs sm:text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-2" />
              <div className="text-base sm:text-lg font-bold">85%</div>
              <div className="text-xs sm:text-sm text-gray-600">Goal Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tracking Cards - Responsive stacking */}
        <div className="space-y-4 sm:space-y-6">
          <HydrationTracker />
          <MedicationTracker />
          
          {/* Quick Actions - Responsive grid */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:gap-4">
              <button className="p-3 sm:p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm sm:text-base">Log Meal</div>
                <div className="text-xs sm:text-sm text-gray-600">Track nutrition</div>
              </button>
              
              <button className="p-3 sm:p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm sm:text-base">Pain Episode</div>
                <div className="text-xs sm:text-sm text-gray-600">Record crisis</div>
              </button>
              
              <button className="p-3 sm:p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm sm:text-base">Appointment</div>
                <div className="text-xs sm:text-sm text-gray-600">Schedule visit</div>
              </button>
              
              <button className="p-3 sm:p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm sm:text-base">Mood Check</div>
                <div className="text-xs sm:text-sm text-gray-600">Rate today</div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthLogsPage;
