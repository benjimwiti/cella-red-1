
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  color: string;
  bgColor: string;
}

const QuickActionCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  progress, 
  color, 
  bgColor 
}: QuickActionCardProps) => {
  return (
    <Card className="glass-effect card-hover cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`${bgColor} rounded-full p-2`}>
            <Icon className={`w-4 h-4 text-${color}`} />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-cella-grey">{subtitle}</p>}
          {progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`bg-${color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
