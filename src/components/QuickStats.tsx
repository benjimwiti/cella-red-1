
import { Card, CardContent } from "@/components/ui/card";
import { Heart, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

const QuickStats = () => {
  const stats = [
    {
      icon: Heart,
      label: "Days Crisis-Free",
      value: "12",
      color: "text-cella-healthy",
      bg: "bg-green-50"
    },
    {
      icon: CheckCircle,
      label: "Hydration Goal",
      value: "85%",
      color: "text-cella-hydration",
      bg: "bg-blue-50"
    },
    {
      icon: AlertTriangle,
      label: "Risk Level",
      value: "Low",
      color: "text-cella-healthy",
      bg: "bg-green-50"
    },
    {
      icon: Calendar,
      label: "Next Appointment",
      value: "3 days",
      color: "text-cella-rose",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-effect card-hover">
          <CardContent className="p-4 text-center">
            <div className={`${stat.bg} rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-cella-grey">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
