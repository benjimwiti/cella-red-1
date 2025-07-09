
import { Home, Calendar, Heart, MessageCircle, User, Trophy } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'circle', icon: Trophy, label: 'Circle' },
    { id: 'ask-cella', icon: MessageCircle, label: 'Ask Cella' },
    { id: 'health-logs', icon: Heart, label: 'Health Logs' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-grey/30 safe-area-pb z-50">
      <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive 
                    ? 'text-brand-red bg-brand-red/10' 
                    : 'text-brand-charcoal/60 hover:text-brand-charcoal'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform flex-shrink-0`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''} truncate w-full text-center`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
