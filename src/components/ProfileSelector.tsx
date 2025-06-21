
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";

interface ProfileSelectorProps {
  onProfileSelect: (type: 'patient' | 'caregiver') => void;
}

const ProfileSelector = ({ onProfileSelect }: ProfileSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-cella-rose rounded-full p-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Cella</h1>
          <p className="text-cella-grey">Your health companion for managing sickle cell care</p>
        </div>

        <div className="space-y-4">
          <Card className="card-hover cursor-pointer" onClick={() => onProfileSelect('patient')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-cella-rose-light rounded-full p-3">
                  <Heart className="w-6 h-6 text-cella-rose-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">I'm a Warrior</h3>
                  <p className="text-sm text-cella-grey">Manage my own health journey</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer" onClick={() => onProfileSelect('caregiver')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-cella-rose-light rounded-full p-3">
                  <Plus className="w-6 h-6 text-cella-rose-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">I'm a Caregiver</h3>
                  <p className="text-sm text-cella-grey">Support warriors in my care</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-cella-grey mt-8">
          You can change this setting anytime in your profile
        </p>
      </div>
    </div>
  );
};

export default ProfileSelector;
