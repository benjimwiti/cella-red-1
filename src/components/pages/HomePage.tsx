
import { useState } from "react";
import { Bell, AlertTriangle, Heart, Droplet, Pill, Utensils, CloudSun, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

  const avatarImage = "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-brand-red/20">
              <AvatarImage src={avatarImage} alt="User Avatar" />
              <AvatarFallback className="bg-brand-red text-white">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-charcoal">
                {greeting}, {userName}!
              </h1>
              <p className="text-sm sm:text-base text-brand-charcoal/70">
                How are you feeling today?
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative self-start sm:self-auto">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-warning rounded-full"></div>
          </Button>
        </div>

        {/* Crisis Risk Indicator - Full width responsive */}
        <div className="w-full">
          <RiskIndicator level={riskLevel} />
        </div>

        {/* Circle Button - Responsive card */}
        <Card className="bg-white shadow-card hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-brand-red/10 rounded-full p-2 sm:p-3">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-charcoal text-base sm:text-lg">
                    Your Circle
                  </h3>
                  <p className="text-sm sm:text-base text-brand-charcoal/70">
                    See how everyone is doing 💪
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-charcoal/40 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Cards - Responsive grid */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-charcoal px-1">
            Today's Health
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <QuickActionCard
              icon={Droplet}
              title="Hydration"
              value="3/8 cups"
              progress={37.5}
              color="blue-500"
              bgColor="bg-blue-50"
            />
            <QuickActionCard
              icon={Pill}
              title="Medications"
              value="2/3 taken"
              progress={66.7}
              color="brand-warning"
              bgColor="bg-yellow-50"
            />
            <QuickActionCard
              icon={Utensils}
              title="Meals"
              value="2 logged"
              progress={100}
              color="brand-success"
              bgColor="bg-green-50"
            />
            <QuickActionCard
              icon={CloudSun}
              title="Weather"
              value="72°F"
              subtitle="Partly cloudy"
              color="brand-charcoal"
              bgColor="bg-gray-50"
            />
          </div>
        </div>

        {/* SOS Button - Responsive positioning */}
        <div className="w-full">
          <SOSButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
