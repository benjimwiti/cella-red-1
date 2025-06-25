
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
          title: "Code sent!",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-cella-rose hover:bg-cella-rose-dark text-white"
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending..." : isLogin ? "Send Login Code" : "Continue"}
        </Button>

        {onSkipDemo && (
          <Button 
            type="button"
            variant="outline"
            onClick={handleSkipDemo}
            className="w-full h-12 border-cella-rose text-cella-rose hover:bg-cella-rose hover:text-white"
          >
            Skip for Demo
          </Button>
        )}

        {isLogin && (
          <p className="text-center text-sm text-cella-grey">
            New here?{" "}
            <button className="text-cella-rose hover:underline">
              Sign up instead
            </button>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default EmailStep;
