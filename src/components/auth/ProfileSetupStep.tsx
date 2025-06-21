
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Heart, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AuthLayout from "./AuthLayout";

interface ProfileSetupStepProps {
  onComplete: (profile: any) => void;
  onBack: () => void;
}

const ProfileSetupStep = ({ onComplete, onBack }: ProfileSetupStepProps) => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer-not-to-say">("female");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [role, setRole] = useState<"warrior" | "caregiver">("warrior");
  const [country, setCountry] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarImages = {
    male: "/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png",
    female: "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dateOfBirth) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    onComplete({
      fullName,
      gender,
      dateOfBirth,
      role,
      country,
      pin,
      avatar: gender !== "prefer-not-to-say" ? avatarImages[gender] : undefined
    });
  };

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Tell us a bit about yourself"
      step={3}
      totalSteps={3}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <Avatar className="w-20 h-20 ring-4 ring-cella-rose/20">
            {gender !== "prefer-not-to-say" ? (
              <AvatarImage src={avatarImages[gender]} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-cella-rose text-white">
                <Heart className="w-8 h-8" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label>Gender</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "prefer-not-to-say", label: "Prefer not to say" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value as any)}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-colors",
                  gender === option.value
                    ? "bg-cella-rose text-white border-cella-rose"
                    : "bg-white text-gray-700 border-gray-300 hover:border-cella-rose"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={setDateOfBirth}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Role */}
        <div className="space-y-3">
          <Label>I am a...</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "warrior", label: "Warrior", subtitle: "Managing my own health" },
              { value: "caregiver", label: "Caregiver", subtitle: "Supporting warriors" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value as any)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors",
                  role === option.value
                    ? "bg-cella-rose text-white border-cella-rose"
                    : "bg-white text-gray-700 border-gray-300 hover:border-cella-rose"
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className={cn(
                  "text-xs mt-1",
                  role === option.value ? "text-white/80" : "text-gray-500"
                )}>
                  {option.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="country">Country/Region (Optional)</Label>
          <Input
            id="country"
            type="text"
            placeholder="For weather features"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        {/* PIN (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="pin">Set PIN (Optional)</Label>
          <Input
            id="pin"
            type="password"
            placeholder="4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.slice(0, 4))}
            className="h-12 text-base"
            maxLength={4}
          />
        </div>

        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-12"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 bg-cella-rose hover:bg-cella-rose-dark text-white"
            disabled={isLoading || !fullName || !dateOfBirth}
          >
            {isLoading ? "Creating..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ProfileSetupStep;
