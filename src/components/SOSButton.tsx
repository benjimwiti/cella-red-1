
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handleSOS = () => {
    setIsPressed(true);
    // Here you would implement the actual SOS functionality
    setTimeout(() => setIsPressed(false), 2000);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <Button
        onClick={handleSOS}
        className={`w-16 h-16 rounded-full ${
          isPressed 
            ? 'bg-red-600 scale-110' 
            : 'bg-cella-crisis hover:bg-red-600'
        } text-white shadow-lg transition-all duration-200`}
      >
        <AlertTriangle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SOSButton;
