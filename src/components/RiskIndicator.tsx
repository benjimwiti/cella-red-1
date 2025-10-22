
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RiskIndicatorProps {
  level: 'low' | 'moderate' | 'high';
}

const RiskIndicator = ({ level }: RiskIndicatorProps) => {
  const riskConfig = {
    low: {
      icon: CheckCircle,
      color: 'text-cella-healthy',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Low Risk',
      message: 'Great job! Keep up your healthy habits.',
    },
    moderate: {
      icon: AlertCircle,
      color: 'text-cella-medication',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Moderate Risk',
      message: 'Consider increasing water intake and monitoring symptoms.',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-cella-crisis',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'High Risk',
      message: 'Please stay hydrated, avoid triggers, and contact your doctor if needed.',
    },
  };

  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <Card className={`glass-effect ${config.borderColor} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`${config.bgColor} rounded-full p-3`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Crisis Risk: {config.title}</h3>
            <p className="text-sm text-cella-grey">{config.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskIndicator;
