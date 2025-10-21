import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

interface PasswordStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
  onSkipDemo?: () => void;
}

const PasswordStep = ({ email, onNext, onBack, onSkipDemo }: PasswordStepProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);

    try {
      const result = await signInWithPassword(email, password);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back! 💧",
          description: "Successfully signed in to your account."
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

  const handleSkipDemo = () => {
    if (onSkipDemo) {
      onSkipDemo();
    }
  };

  return (
    <AuthLayout
      title="Enter your password"
      subtitle={`Sign in to your account with ${email}`}
      step={undefined}
      totalSteps={undefined}
    >
      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-brand-charcoal font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-base brand-input"
              required
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-14 brand-button text-lg font-semibold"
              disabled={isLoading || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
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

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
            >
              Change email
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PasswordStep;
