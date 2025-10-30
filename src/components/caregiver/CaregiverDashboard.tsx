import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CaregiverWelcome from "./CaregiverWelcome";
import ChildRegistration from "./ChildRegistration";
import ChildProfiles from "./ChildProfiles";
import ChildDashboard from "./ChildDashboard";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  genotype?: string;
  lastActivity: string;
  status: 'good' | 'attention' | 'crisis';
  medicationDue?: string;
  lastPainLog?: string;
  lastMedication?: string;
  upcomingAppointment?: string;
}

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

interface CaregiverDashboardProps {
  onNavigateToTabs?: () => void;
}

const CaregiverDashboard = ({ onNavigateToTabs }: CaregiverDashboardProps = {}) => {
  const [view, setView] = useState<'welcome' | 'registration' | 'profiles' | 'child-dashboard'>('welcome');
  const [children, setChildren] = useState<ChildProfile[]>([
    {
      id: '1',
      name: 'Joy',
      age: 12,
      avatar: '/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png',
      genotype: 'HbSS',
      lastActivity: '2 hours ago',
      status: 'good',
      lastPainLog: '3 days ago - Level 2/10',
      lastMedication: 'Hydroxyurea - This morning',
      upcomingAppointment: 'Dr. Smith - Next Friday',
      medicationDue: 'Hydroxyurea in 1 hour'
    },
    {
      id: '2', 
      name: 'Marcus',
      age: 15,
      avatar: '/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png',
      genotype: 'HbSC',
      lastActivity: '1 hour ago',
      status: 'attention',
      lastPainLog: '1 day ago - Level 6/10',
      lastMedication: 'Folic Acid - Yesterday',
      upcomingAppointment: 'Dr. Johnson - Next week'
    }
  ]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [hasExistingChildren, setHasExistingChildren] = useState(true);
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

  const handleChildRegistration = (childData: ChildData) => {
    const newChild: ChildProfile = {
      id: Date.now().toString(),
      name: childData.name,
      age: calculateAge(childData.dateOfBirth),
      avatar: childData.avatar,
      genotype: childData.genotype,
      lastActivity: 'Just created',
      status: 'good'
    };
    
    setChildren([...children, newChild]);
    setView('profiles');
    
    toast({
      title: "Child profile created!",
      description: `${childData.name}'s profile has been set up successfully.`
    });
  };

  const handleSelectChild = (child: ChildProfile) => {
    setSelectedChild(child);
    setView('child-dashboard');
  };

  const handleWelcomeActions = () => {
    // If no existing children, show registration, otherwise show profiles
    if (hasExistingChildren && children.length > 0) {
      setView('profiles');
    } else {
      setView('registration');
    }
  };

  // Render based on current view
  switch (view) {
    case 'welcome':
      return (
        <CaregiverWelcome
          onNavigateToTabs={onNavigateToTabs}
          onRegisterChild={() => setView('registration')}
          onViewProfiles={handleWelcomeActions}
        />
      );
    
    case 'registration':
      return (
        <ChildRegistration
          onBack={() => setView('welcome')}
          onComplete={handleChildRegistration}
        />
      );
    
    case 'profiles':
      return (
        <ChildProfiles
          onBack={() => setView("welcome")}
          children={children}
          onSelectChild={handleSelectChild}
          onAddChild={() => setView('registration')}
        />
      );
    
    case 'child-dashboard':
      return selectedChild ? (
        <ChildDashboard
          child={selectedChild}
          onBack={() => setView('profiles')}
        />
      ) : null;
    
    default:
      return (
        <CaregiverWelcome
          onNavigateToTabs={onNavigateToTabs}
          onRegisterChild={() => setView('registration')}
          onViewProfiles={handleWelcomeActions}
        />
      );
  }

};

export default CaregiverDashboard;
