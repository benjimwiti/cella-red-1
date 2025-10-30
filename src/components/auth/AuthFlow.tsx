
import { useState } from "react";
import EmailStep from "./EmailStep";
import PasswordStep from "./PasswordStep";
import ProfileSetupStep from "./ProfileSetupStep";
import AuthLayout from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

interface AuthFlowProps {
  onComplete: (profile: any) => void;
}

const AuthFlow = ({ onComplete }: AuthFlowProps) => {
  const [step, setStep] = useState<"email" | "password" | "profile" | "success">("email");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const { user } = useAuth();

  console.log("AuthFlow - current step:", step);

  const handleToLogin = () => {
    setIsLogin(!isLogin);
    console.log("Switched to", !isLogin ? "login" : "signup", "mode");
  }

  const handleEmailNext = (email: string) => {
    setEmail(email);
    if (isLogin) {
      setStep("password");
    } else {
      console.log("proceeding to profile setup step");
      setStep("profile");
    }
    console.log("from email to", isLogin ? "password" : "profile", "component");
  };

  const handleProfileComplete = (profileData: any) => {
    setProfile(profileData);
    setStep("success");
  };

  const handleFinalComplete = () => {
    onComplete(profile || { email });
  };



  const handlePasswordNext = () => {
    setStep("success");
  };

  const handleBackFromSuccess = () => {
    console.log("Back from success to", isLogin ? "password" : "profile", "step");
    if (isLogin) {
      setStep("password");
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
              <h1 className="text-4xl font-bold bg-background text-foreground mb-2">Cella</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-8 space-y-8 text-foreground">
              <button
                onClick={handleBackFromSuccess}
                className="flex items-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <div className="text-center text-foreground-secondary space-y-6">
                <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-brand-success rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Cella{profile?.fullName ? `, ${profile.fullName}!` : '!'}
                </h2>
                <p className="opacity-70 leading-relaxed">
                  🎉 You're all set up! Your health companion is ready to help you manage your sickle cell journey.
                </p>
              </div>
              
              <Button 
                onClick={handleFinalComplete}
                className="w-full h-14 brand-button text-lg font-semibold text-foreground"
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
console.log("isUser state:", isUser);
    if (isUser && user) {
      setEmail(user.email || "");
      setStep("profile");
      console.log("user exists, moving to profile step");
      return null;
    } 
    else {

    return (
      <EmailStep 
        onNext={handleEmailNext} 
        onLogin={handleToLogin}
        isLogin={isLogin} 
      />
    );
  } 
  }

  if (step === "password") {
    return (
      <PasswordStep
        email={email}
        onNext={handlePasswordNext}
        onBack={() => setStep("email")}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileSetupStep
        onComplete={handleProfileComplete}
        onBack={() => setStep("email")}
      />
    );
  }

  return null;
};

export default AuthFlow;
