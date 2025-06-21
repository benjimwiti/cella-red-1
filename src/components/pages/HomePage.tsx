
import { useState } from "react";
import { Bell, AlertTriangle, Heart, Droplet, Pill, Utensils, CloudSun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RiskIndicator from "@/components/RiskIndicator";
import QuickActionCard from "@/components/QuickActionCard";
import SOSButton from "@/components/SOSButton";

interface HomePageProps {
  profileType: 'patient' | 'caregiver';
}

const HomePage = ({ profileType }: HomePageProps) => {
  const [riskLevel] = useState<'low' | 'moderate' | 'high'>('low');
  const userName = profileType === 'patient' ? 'Warrior' : 'Caregiver';
  
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-cella-rose rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{greeting}, {userName}!</h1>
            <p className="text-sm text-cella-grey">How are you feeling today?</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cella-crisis rounded-full"></div>
        </Button>
      </div>

      {/* Crisis Risk Indicator */}
      <RiskIndicator level={riskLevel} />

      {/* Quick Action Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Today's Health</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard
            icon={Droplet}
            title="Hydration"
            value="3/8 cups"
            progress={37.5}
            color="cella-hydration"
            bgColor="bg-blue-50"
          />
          <QuickActionCard
            icon={Pill}
            title="Medications"
            value="2/3 taken"
            progress={66.7}
            color="cella-medication"
            bgColor="bg-yellow-50"
          />
          <QuickActionCard
            icon={Utensils}
            title="Meals"
            value="2 logged"
            progress={100}
            color="cella-healthy"
            bgColor="bg-green-50"
          />
          <QuickActionCard
            icon={CloudSun}
            title="Weather"
            value="72°F"
            subtitle="Partly cloudy"
            color="cella-grey"
            bgColor="bg-gray-50"
          />
        </div>
      </div>

      {/* SOS Button */}
      <SOSButton />
    </div>
  );
};

export default HomePage;
