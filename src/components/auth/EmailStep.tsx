
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "./AuthLayout";

interface EmailStepProps {
  onNext: (email: string) => void;
  isLogin?: boolean;
}

const EmailStep = ({ onNext, isLogin = false }: EmailStepProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext(email);
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
