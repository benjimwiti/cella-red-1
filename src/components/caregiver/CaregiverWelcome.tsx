import { Plus, LogIn, MessageCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CaregiverWelcomeProps {
  onRegisterChild: () => void;
  onViewProfiles: () => void;
  onNavigateToTabs?: () => void;
}

const CaregiverWelcome = ({ onRegisterChild, onViewProfiles, onNavigateToTabs }: CaregiverWelcomeProps) => {
  return (
    <div className="min-h-screen cella-gradient">
      <div className="w-full max-w-md mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
            Welcome, Caregiver 👋
          </h1>
          <p className="text-brand-charcoal/70 text-base sm:text-lg leading-relaxed">
            Manage your child's sickle cell journey with ease.
          </p>
        </div>

        {/* Illustration/Icon Area */}
        <div className="flex justify-center py-8">
          <div className="w-32 h-32 bg-brand-red/10 rounded-full flex items-center justify-center">
            <div className="text-6xl">👨‍⚕️</div>
          </div>
        </div>

        {/* CTA Cards */}
        <div className="space-y-4">
          <Card 
            className="glass-effect border-brand-red/20 cursor-pointer hover:border-brand-red/40 transition-all duration-200"
            onClick={onRegisterChild}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-charcoal text-lg mb-1">
                    Register a Child
                  </h3>
                  <p className="text-brand-charcoal/60 text-sm">
                    Create a new profile to start tracking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="glass-effect border-brand-charcoal/20 cursor-pointer hover:border-brand-charcoal/40 transition-all duration-200"
            onClick={onViewProfiles}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-charcoal rounded-xl flex items-center justify-center flex-shrink-0">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-charcoal text-lg mb-1">
                    View Child Profiles
                  </h3>
                  <p className="text-brand-charcoal/60 text-sm">
                    Access your child's existing data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Features */}
          {onNavigateToTabs && (
            <>
              <Card 
                className="glass-effect border-purple-200 cursor-pointer hover:border-purple-400 transition-all duration-200"
                onClick={() => onNavigateToTabs()}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-brand-charcoal text-lg mb-1">
                        Circle & Ask Cella
                      </h3>
                      <p className="text-brand-charcoal/60 text-sm">
                        Connect with community and get AI support
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-8">
          <p className="text-brand-charcoal/50 text-sm">
            Secure, private, and always available for your family
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaregiverWelcome;