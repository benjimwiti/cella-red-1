
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Heart, ArrowLeft } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "./AuthLayout";

interface ProfileSetupStepProps {
  onComplete: (profile: any) => void;
  onBack: () => void;
  onSkipDemo?: () => void;
}

const ProfileSetupStep = ({ onComplete, onBack, onSkipDemo }: ProfileSetupStepProps) => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer-not-to-say">("female");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [dateInput, setDateInput] = useState("");
  const [role, setRole] = useState<"warrior" | "caregiver" | null>("warrior");
  const [country, setCountry] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarImages = {
    male: "/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png",
    female: "/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png"
  };

  const handleDateInputChange = (value: string) => {
    setDateInput(value);
    const parsedDate = parse(value, "MM/dd/yyyy", new Date());
    if (isValid(parsedDate) && parsedDate <= new Date() && parsedDate >= new Date("1900-01-01")) {
      setDateOfBirth(parsedDate);
    } else if (value === "") {
      setDateOfBirth(undefined);
    }
  };

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dateOfBirth || !user) return;

    setIsLoading(true);

    try {
      // Save profile to database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: fullName,
          gender: gender === "prefer-not-to-say" ? null : gender,
          date_of_birth: dateOfBirth.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
          role: role,
          region: country || null
        });

      if (error) {
        console.error('Error saving profile:', error);
        // Handle error - could show toast
      } else {
        console.log('Profile saved successfully');
      }
    } catch (error) {
      console.error('Unexpected error saving profile:', error);
    }

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

  const handleSkipDemo = () => {
    if (onSkipDemo) {
      onSkipDemo();
    }
  };

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Tell us a bit about yourself"
      step={3}
      totalSteps={3}
    >
      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center mb-8">
            <Avatar className="w-24 h-24 ring-4 ring-brand-red/20 shadow-card">
              {gender !== "prefer-not-to-say" ? (
                <AvatarImage src={avatarImages[gender]} alt="Avatar" />
              ) : (
                <AvatarFallback className="bg-brand-red text-white">
                  <Heart className="w-10 h-10" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Full Name */}
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-brand-charcoal font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-14 text-base brand-input"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-4">
            <Label className="text-brand-charcoal font-medium">Gender</Label>
            <div className="grid grid-cols-3 gap-3">
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
                    "p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                    gender === option.value
                      ? "bg-brand-red text-white border-brand-red shadow-card"
                      : "bg-white text-brand-charcoal border-brand-grey hover:border-brand-red hover:shadow-subtle"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-3">
            <Label className="text-brand-charcoal font-medium">Date of Birth</Label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="MM/DD/YYYY (e.g., 01/15/1990)"
                value={dateInput}
                onChange={(e) => handleDateInputChange(e.target.value)}
                className="h-14 text-base brand-input"
              />
              <div className="text-sm text-brand-charcoal/60">Or select from calendar:</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-14 justify-start text-left font-normal brand-input",
                      !dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-card" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={(date) => {
                      setDateOfBirth(date);
                      if (date) {
                        setDateInput(format(date, "MM/dd/yyyy"));
                      } else {
                        setDateInput("");
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-4">
            <Label className="text-brand-charcoal font-medium">I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "warrior", label: "Warrior", subtitle: "Managing my own health" },
                { value: "caregiver", label: "Caregiver", subtitle: "Supporting warriors" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value as any)}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all duration-200",
                    role === option.value
                      ? "bg-brand-red text-white border-brand-red shadow-card"
                      : "bg-white text-brand-charcoal border-brand-grey hover:border-brand-red hover:shadow-subtle"
                  )}
                >
                  <div className="font-semibold text-lg mb-1">{option.label}</div>
                  <div className={cn(
                    "text-sm",
                    role === option.value ? "text-white/80" : "text-brand-charcoal/70"
                  )}>
                    {option.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Country (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="country" className="text-brand-charcoal font-medium">
              Country/Region <span className="text-brand-charcoal/50">(Optional)</span>
            </Label>
            <Input
              id="country"
              type="text"
              placeholder="For weather features"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-14 text-base brand-input"
            />
          </div>

          {/* PIN (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="pin" className="text-brand-charcoal font-medium">
              Set PIN <span className="text-brand-charcoal/50">(Optional)</span>
            </Label>
            <Input
              id="pin"
              type="password"
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 4))}
              className="h-14 text-base brand-input"
              maxLength={4}
            />
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 brand-button text-lg font-semibold"
              disabled={isLoading || !fullName || !dateOfBirth}
            >
              {isLoading ? "Creating..." : "Complete Setup 🎉"}
            </Button>

            {onSkipDemo && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleSkipDemo}
                className="w-full h-14 brand-button-outline text-lg font-semibold"
              >
                Skip for Demo
              </Button>
            )}

            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center space-x-2 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ProfileSetupStep;
