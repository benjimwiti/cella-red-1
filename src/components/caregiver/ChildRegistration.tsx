import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ChildData {
  name: string;
  dateOfBirth: string;
  gender: string;
  relation: string;
  genotype: string;
  baselineHb: string;
  caregiverPhone: string;
  caregiverEmail: string;
  avatar?: string;
}

interface ChildRegistrationProps {
  onBack: () => void;
  onComplete: (childData: ChildData) => void;
}

const ChildRegistration = ({ onBack, onComplete }: ChildRegistrationProps) => {
  const [step, setStep] = useState(1);
  const [childData, setChildData] = useState<ChildData>({
    name: '',
    dateOfBirth: '',
    gender: '',
    relation: '',
    genotype: '',
    baselineHb: '',
    caregiverPhone: '',
    caregiverEmail: '',
  });
  const { toast } = useToast();

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field: keyof ChildData, value: string) => {
    setChildData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return childData.name && childData.dateOfBirth && childData.gender && childData.relation;
      case 2:
        return childData.caregiverPhone && childData.caregiverEmail;
      case 3:
        return true; // Avatar is optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        onComplete(childData);
      }
    } else {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
    }
  };

  const renderStep1 = () => (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-brand-charcoal">Child Details</CardTitle>
        <p className="text-brand-charcoal/60 text-sm">Tell us about your child</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={childData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter child's full name"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <div className="relative">
            <Input
              id="dob"
              type="date"
              value={childData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="h-12 pr-10"
            />
            <Calendar className="absolute right-3 top-3 h-6 w-6 text-brand-charcoal/40" />
          </div>
          {childData.dateOfBirth && (
            <p className="text-sm text-brand-charcoal/60">
              Age: {calculateAge(childData.dateOfBirth)} years old
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select value={childData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Relation *</Label>
            <Select value={childData.relation} onValueChange={(value) => handleInputChange('relation', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Genotype</Label>
            <Select value={childData.genotype} onValueChange={(value) => handleInputChange('genotype', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HbSS">HbSS</SelectItem>
                <SelectItem value="HbSC">HbSC</SelectItem>
                <SelectItem value="HbS-β⁰">HbS-β⁰</SelectItem>
                <SelectItem value="HbS-β⁺">HbS-β⁺</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Baseline Hb (g/dL)</Label>
            <Input
              value={childData.baselineHb}
              onChange={(e) => handleInputChange('baselineHb', e.target.value)}
              placeholder="e.g. 8.5"
              className="h-12"
              type="number"
              step="0.1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-brand-charcoal">Caregiver Contact</CardTitle>
        <p className="text-brand-charcoal/60 text-sm">We'll use this for alerts and reports</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={childData.caregiverPhone}
            onChange={(e) => handleInputChange('caregiverPhone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="h-12"
          />
          <p className="text-xs text-brand-charcoal/50">For emergency alerts and medication reminders</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={childData.caregiverEmail}
            onChange={(e) => handleInputChange('caregiverEmail', e.target.value)}
            placeholder="your@email.com"
            className="h-12"
          />
          <p className="text-xs text-brand-charcoal/50">For health reports and appointment reminders</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-brand-charcoal">Profile Photo</CardTitle>
        <p className="text-brand-charcoal/60 text-sm">Add a photo to personalize the profile (optional)</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 ring-4 ring-brand-red/20">
            <AvatarImage src={childData.avatar} />
            <AvatarFallback className="bg-brand-red/10 text-brand-red text-2xl">
              {childData.name ? childData.name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            className="border-brand-red/20 hover:border-brand-red/40"
            onClick={() => {
              // In a real app, this would open file picker
              toast({
                title: "Photo upload",
                description: "Photo upload functionality would be implemented here"
              });
            }}
          >
            <Camera className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>

          <p className="text-xs text-brand-charcoal/50 text-center max-w-sm">
            You can always add or change the photo later in settings
          </p>
        </div>

        {/* Summary */}
        <div className="bg-brand-red/5 rounded-xl p-4 space-y-2">
          <h4 className="font-medium text-brand-charcoal">Profile Summary:</h4>
          <p className="text-sm text-brand-charcoal/70">
            <strong>{childData.name}</strong> • {calculateAge(childData.dateOfBirth)} years old
          </p>
          <p className="text-sm text-brand-charcoal/70">
            {childData.gender} • {childData.relation}
          </p>
          {childData.genotype && (
            <p className="text-sm text-brand-charcoal/70">
              Genotype: {childData.genotype}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen cella-gradient">
      <div className="w-full max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="text-brand-charcoal"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="text-sm text-brand-charcoal/60">
            Step {step} of 3
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-brand-charcoal/10 rounded-full h-2 mb-8">
          <div 
            className="bg-brand-red h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <Button
          onClick={nextStep}
          className="w-full h-12 bg-brand-red hover:bg-brand-red/90 text-white"
          disabled={!validateStep(step)}
        >
          {step === 3 ? 'Create Child Profile' : 'Continue'}
          {step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default ChildRegistration;