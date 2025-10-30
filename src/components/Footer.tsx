import { ThemeToggle } from "@/components/ui/theme-toggle";
import BottomNavigation from "./BottomNavigation";
import CaregiverBottomNavigation from "./caregiver/CaregiverBottomNavigation.tsx";
import CaregiverDashboardNavigation from "@/components/caregiver/CaregiverDashboardNavigation.tsx";


interface FooterProps {
  showNavigation?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  navigationType?: 'warrior' | 'caregiver' | 'caregiver-dashboard';
  onBack?: () => void;
  onSignOut?: () => void;
  onProfile?: () => void;
}

const Footer = ({
  showNavigation,
  activeTab,
  onTabChange,
  navigationType,
  onBack,
  onSignOut,
  onProfile
}: FooterProps) => {
  //console.log("Footer Props:", { showNavigation, activeTab, onTabChange, navigationType });
  return (
    <div className="bg-background/50 backdrop-blur-md border-t border-brand-grey/30 safe-area-pb">
      {showNavigation && (
        <div className="pb-2">
          {navigationType === 'warrior' && activeTab && onTabChange ? (
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          ) : navigationType === 'caregiver' && activeTab && onTabChange ? (
            <CaregiverBottomNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
              onBack={onBack}
              onSignOut={onSignOut}
            />
          ) : navigationType === 'caregiver-dashboard' && onProfile && onSignOut ? (
            <CaregiverDashboardNavigation
              onProfile={onProfile}
              onSignOut={onSignOut}
            />
          ) : null}
        </div>
      )}
      <div className="relative text-center py-4 text-xs text-muted-foreground bg-background/50">
        © 2025 Hilley Jagero. All rights reserved under copyright law.
        <div className="absolute right-[5%] top-1/2 transform -translate-y-1/2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Footer;