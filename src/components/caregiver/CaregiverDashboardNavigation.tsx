import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle.tsx";

interface CaregiverDashboardNavigationProps {
  onProfile: () => void;
  onSignOut: () => void;
}

const CaregiverDashboardNavigation = ({ onProfile, onSignOut }: CaregiverDashboardNavigationProps) => {
  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2">
      <div className="flex justify-between items-center">
        {/* Profile Button */}
        <button
          onClick={onProfile}
          className="flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 text-foreground/60 hover:text-foreground"
        >
          <User className="w-5 h-5 mb-1 flex-shrink-0" />
          <span className="text-xs font-medium truncate text-center">Profile</span>
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

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

export default CaregiverDashboardNavigation;
