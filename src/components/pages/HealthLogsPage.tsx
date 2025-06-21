
import { useState } from "react";
import { Plus, Droplet, Utensils, Pill, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HealthLogsPage = () => {
  const [activeLog, setActiveLog] = useState("hydration");

  const hydrationLogs = [
    { time: "8:00 AM", amount: "2 cups", type: "Water" },
    { time: "10:30 AM", amount: "1 cup", type: "Herbal tea" },
    { time: "1:00 PM", amount: "1.5 cups", type: "Water" },
  ];

  const mealLogs = [
    { time: "7:30 AM", meal: "Breakfast", details: "Oatmeal with berries, orange juice" },
    { time: "12:30 PM", meal: "Lunch", details: "Grilled chicken salad, water" },
  ];

  const medicationLogs = [
    { time: "8:00 AM", medication: "Hydroxyurea", status: "Taken", dose: "500mg" },
    { time: "12:00 PM", medication: "Folic Acid", status: "Taken", dose: "5mg" },
    { time: "6:00 PM", medication: "Pain Relief", status: "Missed", dose: "As needed" },
  ];

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Header */}
      <div className="pt-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Logs</h1>
        <p className="text-cella-grey">Track and manage your daily health data</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeLog} onValueChange={setActiveLog} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hydration" className="text-xs">
            <Droplet className="w-4 h-4 mr-1" />
            Water
          </TabsTrigger>
          <TabsTrigger value="meals" className="text-xs">
            <Utensils className="w-4 h-4 mr-1" />
            Meals
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-xs">
            <Pill className="w-4 h-4 mr-1" />
            Meds
          </TabsTrigger>
          <TabsTrigger value="crisis" className="text-xs">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Crisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hydration" className="space-y-4">
          {hydrationLogs.map((log, index) => (
            <Card key={index} className="glass-effect">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{log.amount}</p>
                    <p className="text-sm text-cella-grey">{log.type}</p>
                  </div>
                  <span className="text-sm text-cella-grey">{log.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          {mealLogs.map((log, index) => (
            <Card key={index} className="glass-effect">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.meal}</p>
                    <p className="text-sm text-cella-grey">{log.details}</p>
                  </div>
                  <span className="text-sm text-cella-grey">{log.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          {medicationLogs.map((log, index) => (
            <Card key={index} className="glass-effect">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{log.medication}</p>
                    <p className="text-sm text-cella-grey">{log.dose}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      log.status === 'Taken' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                    <p className="text-xs text-cella-grey mt-1">{log.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="crisis" className="space-y-4">
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-12 h-12 text-cella-grey mx-auto mb-2" />
              <p className="text-cella-grey">No crisis events logged recently</p>
              <p className="text-sm text-cella-grey mt-1">Keep up the great work!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Add Button */}
      <Button className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-cella-rose hover:bg-cella-rose-dark text-white shadow-lg">
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default HealthLogsPage;
