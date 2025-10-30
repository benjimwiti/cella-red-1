import { MessageCircle, Trophy, ArrowLeft, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface CaregiverBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
  onSignOut: () => void;
  onProfile?: () => void;
}

const CaregiverBottomNavigation = ({ activeTab, onTabChange, onBack, onSignOut, onProfile }: CaregiverBottomNavigationProps) => {
  const tabs = [
    { id: 'circle', icon: Trophy, label: 'Circle' },
    { id: 'ask-cella', icon: MessageCircle, label: 'Ask Cella' },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-xs font-medium truncate text-center">Back</span>
          </button>

          {/* Main Tabs */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-2 ${
                  isActive
                    ? 'text-brand-red bg-brand-red/10'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform flex-shrink-0`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''} truncate w-full text-center`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 text-foreground/60 hover:text-brand-red"
          >
            <LogOut className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-xs font-medium truncate text-center">Sign Out</span>
          </button>
          
        </div>
      </div>
  );
};

export default CaregiverBottomNavigation;