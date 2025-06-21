
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Heart, Bell, Plus } from "lucide-react";
import HealthCalendar from "./HealthCalendar";
import HydrationTracker from "./HydrationTracker";
import MedicationTracker from "./MedicationTracker";
import QuickStats from "./QuickStats";

interface DashboardProps {
  profileType: 'patient' | 'caregiver';
}

const Dashboard = ({ profileType }: DashboardProps) => {
  const greeting = profileType === 'patient' ? 'Hello, Warrior!' : 'Hello, Caregiver!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
            <p className="text-cella-grey">Let's take care of your health today</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cella-crisis rounded-full"></div>
            </Button>
            <div className="bg-cella-rose rounded-full p-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - Takes up 2 columns on desktop */}
          <div className="lg:col-span-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-cella-rose" />
                  <span>Health Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthCalendar />
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Trackers */}
          <div className="space-y-6">
            <HydrationTracker />
            <MedicationTracker />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-cella-rose hover:bg-cella-rose-dark text-white flex-col space-y-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Log Crisis</span>
              </Button>
              <Button className="h-20 bg-cella-hydration hover:bg-blue-600 text-white flex-col space-y-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Water</span>
              </Button>
              <Button className="h-20 bg-cella-healthy hover:bg-green-600 text-white flex-col space-y-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Log Meal</span>
              </Button>
              <Button className="h-20 bg-cella-medication hover:bg-yellow-600 text-white flex-col space-y-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Take Meds</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
