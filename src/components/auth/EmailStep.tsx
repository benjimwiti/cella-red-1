
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

interface EmailStepProps {
  
  onNext: (email: string) => void;
  onSkipDemo?: () => void;
  isLogin?: boolean;
}

const EmailStep = ({ onNext, onSkipDemo, isLogin = false }: EmailStepProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
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
          description: "Check your email for the verification code."
        });
        onNext(email);
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

  const handleSkipDemo = () => {
    if (onSkipDemo) {
      onSkipDemo();
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Welcome back" : "Get started"}
      subtitle={isLogin ? "Enter your email to sign in" : "Enter your email to create your account"}
      step={isLogin ? undefined : 1}
      totalSteps={isLogin ? undefined : 3}
    >
      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-brand-charcoal font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base brand-input"
              required
            />
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full h-14 brand-button text-lg font-semibold"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : isLogin ? "Send Login Code" : "Continue"}
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
          </div>

          {isLogin && (
            <p className="text-center text-sm text-brand-charcoal/70">
              New here?{" "}
              <button className="text-brand-red hover:underline font-medium">
                Sign up instead
              </button>
            </p>
          )}
        </form>
      </div>
    </AuthLayout>
  );
};

export default EmailStep;
