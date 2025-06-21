
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

const MedicationTracker = () => {
  const [medications, setMedications] = useState([
    { id: 1, name: "Hydroxyurea", time: "8:00 AM", taken: true },
    { id: 2, name: "Folic Acid", time: "12:00 PM", taken: false },
    { id: 3, name: "Pain Relief", time: "6:00 PM", taken: false },
  ]);

  const toggleMedication = (id: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const takenCount = medications.filter(med => med.taken).length;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Medications</span>
          <span className="text-sm font-normal text-cella-grey">{takenCount}/{medications.length} taken</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {medications.map(med => (
          <div key={med.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
            <div className="flex-1">
              <p className="font-medium text-sm">{med.name}</p>
              <p className="text-xs text-cella-grey flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {med.time}
              </p>
            </div>
            <Button
              variant={med.taken ? "default" : "outline"}
              size="sm"
              onClick={() => toggleMedication(med.id)}
              className={med.taken ? "bg-cella-healthy hover:bg-green-600 text-white" : ""}
            >
              {med.taken ? <CheckCircle className="w-4 h-4" /> : "Take"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
