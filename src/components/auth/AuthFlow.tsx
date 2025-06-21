
import { useState } from "react";
import EmailStep from "./EmailStep";
import VerificationStep from "./VerificationStep";
import ProfileSetupStep from "./ProfileSetupStep";
import AuthLayout from "./AuthLayout";
import { Button } from "@/components/ui/button";

interface AuthFlowProps {
  onComplete: (profile: any) => void;
  isLogin?: boolean;
}

const AuthFlow = ({ onComplete, isLogin = false }: AuthFlowProps) => {
  const [step, setStep] = useState<"email" | "verification" | "profile" | "success">("email");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);

  const handleEmailNext = (email: string) => {
    setEmail(email);
    setStep("verification");
  };

  const handleVerificationNext = () => {
    if (isLogin) {
      // For login, skip profile setup and go directly to success
      setStep("success");
    } else {
      setStep("profile");
    }
  };

  const handleProfileComplete = (profileData: any) => {
    setProfile(profileData);
    setStep("success");
  };

  const handleFinalComplete = () => {
    onComplete(profile || { email });
  };

  if (step === "success") {
    return (
      <AuthLayout
        title={`Welcome to Cella${profile?.fullName ? `, ${profile.fullName}!` : '!'}`}
        subtitle="Your health companion is ready to help you manage your sickle cell journey"
      >
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>
            <p className="text-cella-grey">
              {isLogin ? "Successfully signed in!" : "Account created successfully!"}
            </p>
          </div>
          
          <Button 
            onClick={handleFinalComplete}
            className="w-full h-12 bg-cella-rose hover:bg-cella-rose-dark text-white"
          >
            Get Started
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (step === "email") {
    return <EmailStep onNext={handleEmailNext} isLogin={isLogin} />;
  }

  if (step === "verification") {
    return (
      <VerificationStep
        email={email}
        onNext={handleVerificationNext}
        onBack={() => setStep("email")}
        isLogin={isLogin}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileSetupStep
        onComplete={handleProfileComplete}
        onBack={() => setStep("verification")}
      />
    );
  }

  return null;
};

export default AuthFlow;
