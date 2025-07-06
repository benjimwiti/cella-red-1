
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
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, code);
      
      if (error) {
        toast({
          title: "Invalid code",
          description: "Please check your code and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success! ✅",
          description: "Code verified successfully."
        });
        onNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(30);
    
    const { error } = await sendOTP(email);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Code sent! 💧",
        description: "A new verification code has been sent to your email."
      });
    }
  };

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`We've sent a 6-digit code to ${email}`}
      step={isLogin ? undefined : 2}
      totalSteps={isLogin ? undefined : 3}
    >
      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="gap-3">
                <InputOTPSlot index={0} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
                <InputOTPSlot index={1} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
                <InputOTPSlot index={2} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
                <InputOTPSlot index={3} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
                <InputOTPSlot index={4} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
                <InputOTPSlot index={5} className="w-14 h-14 text-xl border-brand-grey focus:border-brand-red" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full h-14 brand-button text-lg font-semibold"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
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
              
              <div>
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerificationStep;
