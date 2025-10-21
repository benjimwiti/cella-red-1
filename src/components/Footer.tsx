import { ThemeToggle } from "@/components/ui/theme-toggle";
import BottomNavigation from "./BottomNavigation";
import CaregiverBottomNavigation from "./CaregiverBottomNavigation";

interface FooterProps {
  showNavigation?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  navigationType?: 'patient' | 'caregiver';
  onBack?: () => void;
  onSignOut?: () => void;
}

const Footer = ({
  showNavigation = false,
  activeTab,
  onTabChange,
  navigationType = 'patient',
  onBack,
  onSignOut
}: FooterProps) => {
  return (
    <div className="bg-background/50 backdrop-blur-md border-t border-brand-grey/30 safe-area-pb">
      {showNavigation && activeTab && onTabChange && (
        <div className="pb-2">
          {navigationType === 'patient' ? (
            <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
          ) : (
            <CaregiverBottomNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
              onBack={onBack}
              onSignOut={onSignOut}
            />
          )}
        </div>
      )}
      <div className="text-center py-4 text-xs text-muted-foreground bg-background/50">
        © 2025 Hilley Jagero. All rights reserved under copyright law.
        <div className="flex justify-end pb-1">
           <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Footer;