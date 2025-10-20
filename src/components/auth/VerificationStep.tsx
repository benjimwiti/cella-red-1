
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "./AuthLayout";

interface VerificationStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
  onSkipDemo?: () => void;
  isLogin?: boolean;
}

const VerificationStep = ({ email, onNext, onBack, onSkipDemo, isLogin = false }: VerificationStepProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { signIn, sendOTP } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // const timer = setInterval(() => {
    //   setCountdown((prev) => {
    //     if (prev <= 1) {
    //       setCanResend(true);
    //       return 0;
    //     }
    //     return prev - 1;
    //   });
    // }, 1000);
  

    // return () => clearInterval(timer);
  }, []);

    console.log("running verification step")

  const handleVerifyClick = () => {
    // Open Gmail in a new tab for verification
    window.open('https://mail.google.com', '_blank');
    onNext();
  };

  //resend OTP
  // const handleResend = async () => {
  //   setCanResend(false);
  //   setCountdown(30);
    
  //   const { error } = await sendOTP(email);
  //   if (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive"
  //     });
  //   } else {
  //     toast({
  //       title: "Code sent! 💧",
  //       description: "A new verification code has been sent to your email."
  //     });
  //   }
  // };

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`verify your email at ${email}`}
      step={isLogin ? undefined : 2}
      totalSteps={isLogin ? undefined : 3}
    >
      <div className="bg-white rounded-2xl shadow-card p-8">
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Click the button below to check your Gmail and verify the code manually.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleVerifyClick}
              className="w-full h-14 brand-button text-lg font-semibold"
            >
              Open Gmail to Verify
            </Button>

            {onSkipDemo && (
              <Button 
                type="button"
                variant="outline"
                onClick={onSkipDemo}
                className="w-full h-14 brand-button-outline text-lg font-semibold"
              >
                Skip for Demo
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center space-x-2 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change email</span>
              </button>
              
              {/* <div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-brand-red hover:underline font-medium"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-brand-charcoal/70">
                    Resend in {countdown}s
                  </p>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerificationStep;
