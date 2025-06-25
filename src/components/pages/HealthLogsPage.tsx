
import HydrationTracker from '@/components/health/HydrationTracker';
import MedicationTracker from '@/components/health/MedicationTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, TrendingUp } from 'lucide-react';

const HealthLogsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white">
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Tracking</h1>
          <p className="text-cella-grey">Monitor your daily health metrics</p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 text-cella-rose mx-auto mb-2" />
              <div className="text-lg font-bold">7</div>
              <div className="text-xs text-cella-grey">Days Tracked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">3</div>
              <div className="text-xs text-cella-grey">This Week</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">85%</div>
              <div className="text-xs text-cella-grey">Goal Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tracking Cards */}
        <div className="space-y-4">
          <HydrationTracker />
          <MedicationTracker />
          
          {/* Placeholder for additional tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium">Log Meal</div>
                <div className="text-sm text-cella-grey">Track nutrition</div>
              </button>
              
              <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium">Pain Episode</div>
                <div className="text-sm text-cella-grey">Record crisis</div>
              </button>
              
              <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium">Appointment</div>
                <div className="text-sm text-cella-grey">Schedule visit</div>
              </button>
              
              <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                <div className="font-medium">Mood Check</div>
                <div className="text-sm text-cella-grey">Rate today</div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthLogsPage;
