
import { useState } from "react";
import EmailStep from "./EmailStep";
import VerificationStep from "./VerificationStep";
import ProfileSetupStep from "./ProfileSetupStep";
import AuthLayout from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

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

  const handleSkipDemo = () => {
    // Skip authentication with demo data
    onComplete({
      fullName: "Demo User",
      email: "demo@example.com",
      gender: "female",
      role: "warrior"
    });
  };

  // Skip for demo - advance to next step
  const handleSkipToNext = () => {
    if (step === "email") {
      setEmail("demo@example.com");
      setStep("verification");
    } else if (step === "verification") {
      setStep("profile");
    } else if (step === "profile") {
      handleProfileComplete({
        fullName: "Demo User",
        email: "demo@example.com",
        gender: "female",
        role: "warrior"
      });
    }
  };

  const handleBackFromSuccess = () => {
    if (isLogin) {
      setStep("verification");
    } else {
      setStep("profile");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            {/* Logo */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-brand-red rounded-full p-4 shadow-card">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-brand-charcoal mb-2">Cella</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
              <button
                onClick={handleBackFromSuccess}
                className="flex items-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-brand-success rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-brand-charcoal mb-2">
                  Welcome to Cella{profile?.fullName ? `, ${profile.fullName}!` : '!'}
                </h2>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  🎉 You're all set up! Your health companion is ready to help you manage your sickle cell journey.
                </p>
              </div>
              
              <Button 
                onClick={handleFinalComplete}
                className="w-full h-14 brand-button text-lg font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === "email") {
    return (
      <EmailStep 
        onNext={handleEmailNext} 
        onSkipDemo={handleSkipToNext}
        isLogin={isLogin} 
      />
    );
  }

  if (step === "verification") {
    return (
      <VerificationStep
        email={email}
        onNext={handleVerificationNext}
        onBack={() => setStep("email")}
        onSkipDemo={handleSkipToNext}
        isLogin={isLogin}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileSetupStep
        onComplete={handleProfileComplete}
        onBack={() => setStep("verification")}
        onSkipDemo={handleSkipToNext}
      />
    );
  }

  return null;
};

export default AuthFlow;
