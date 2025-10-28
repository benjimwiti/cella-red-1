
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

interface EmailStepProps {
  
  onNext: (email: string) => void;
  onLogin?: () => void;
  isLogin?: boolean;
}

const EmailStep = ({ onNext, onLogin, isLogin = false }: EmailStepProps) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [login, setLogin] = useState(isLogin);

  console.log("issue in email step")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isLogin && !pwd)) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // For login, just proceed to password step
        onNext(email);
      } else {
        // For signup, create account
        const result = await signUp(email, pwd);

        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account created! 💧",
            description: "Please complete your profile setup."
          });
          console.log("onNext email:", email);
          onNext(email);
        }
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


  return (
    <AuthLayout
      title={isLogin ? "Welcome back" : "Get started"}
      subtitle={isLogin ? "Enter your email to sign in" : "Enter your email to create your account"}
      step={isLogin ? undefined : 1}
      totalSteps={isLogin ? undefined : 2}
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

          {!isLogin && (
            <div className="space-y-3">
              <Label htmlFor="pwd" className="text-brand-charcoal font-medium">
                Password
              </Label>
              <Input
                id="pwd"
                type="password"
                placeholder="choose a password to access your cella account"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="h-14 text-base brand-input"
                required
              />
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-14 brand-button text-lg font-semibold"
              disabled={isLoading || !email || (!isLogin && !pwd)}
            >
              {isLoading ? "Sending..." : isLogin ? "Continue" : "Continue"}
            </Button>

            {!isLogin && (
              <Button 
                type="button"
                variant="outline"
                onClick={onLogin}
                className="w-full h-14 brand-button-outline text-lg font-semibold"
              >
                Already have an account? Log in
              </Button>
            )}
          </div>

          {isLogin && (
            <p className="text-center text-sm text-brand-charcoal/70">
              New here?{" "}
              <button
                type="button"
                onClick={onLogin}
                className="text-brand-red hover:underline font-medium"
              >
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
