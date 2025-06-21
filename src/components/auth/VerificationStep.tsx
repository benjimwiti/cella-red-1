
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "./AuthLayout";

interface VerificationStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
  isLogin?: boolean;
}

const VerificationStep = ({ email, onNext, onBack, isLogin = false }: VerificationStepProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext();
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(30);
    // Simulate resend
  };

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`We've sent a 6-digit code to ${email}`}
      step={isLogin ? undefined : 2}
      totalSteps={isLogin ? undefined : 3}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-cella-rose hover:bg-cella-rose-dark text-white"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-cella-grey hover:underline"
          >
            Change email address
          </button>
          
          <div>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-cella-rose hover:underline"
              >
                Resend code
              </button>
            ) : (
              <p className="text-sm text-cella-grey">
                Resend code in {countdown} seconds
              </p>
            )}
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerificationStep;
