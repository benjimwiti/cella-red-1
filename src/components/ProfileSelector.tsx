
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

interface ProfileSelectorProps {
  onProfileSelect: (type: 'patient' | 'caregiver') => void;
  onBack?: () => void;
}

const ProfileSelector = ({ onProfileSelect, onBack }: ProfileSelectorProps) => {
  return (
    <div className="min-h-screen cella-gradient flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-brand-red rounded-full p-4 shadow-card">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Welcome to Cella</h1>
          <p className="text-brand-charcoal/70">Your health companion for managing sickle cell care</p>
        </div>

        <div className="space-y-4">
          <Card className="card-hover cursor-pointer bg-white shadow-card" onClick={() => onProfileSelect('patient')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-brand-red/10 rounded-full p-3">
                  <Heart className="w-6 h-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-charcoal">I'm a Warrior</h3>
                  <p className="text-sm text-brand-charcoal/70">Manage my own health journey</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer bg-white shadow-card" onClick={() => onProfileSelect('caregiver')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-brand-red/10 rounded-full p-3">
                  <Plus className="w-6 h-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-charcoal">I'm a Caregiver</h3>
                  <p className="text-sm text-brand-charcoal/70">Support warriors in my care</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-brand-charcoal/70 mt-8">
          You can change this setting anytime in your profile
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSelector;
