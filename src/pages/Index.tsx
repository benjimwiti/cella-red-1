
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import ProfileSelector from '@/components/ProfileSelector';
import BottomNavigation from '@/components/BottomNavigation';
import WarriorHomePage from '@/components/pages/WarriorHomePage';
import WarriorCalendarPage from '@/components/pages/WarriorCalendarPage';
import WarriorAskCellaPage from '@/components/pages/WarriorAskCellaPage';
import WarriorCirclePage from '@/components/pages/WarriorCirclePage';
import WarriorProfilePage from '@/components/pages/WarriorProfilePage';
import HealthLogsPage from '@/components/pages/HealthLogsPage';
import CaregiverDashboard from '@/components/caregiver/CaregiverDashboard';
import CaregiverBottomNavigation from '@/components/CaregiverBottomNavigation';
import CaregiverProfileSettings from '@/components/caregiver/CaregiverProfileSettings';
import AuthFlow from '@/components/auth/AuthFlow';
import Footer from '@/components/Footer';
import NotFound from "./NotFound.tsx";
import { toast } from "../hooks/use-toast.ts";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileType, setProfileType] = useState<'warrior' | 'caregiver' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCaregiversTab, setActiveCaregiverTab] = useState('circle');
  const [showCaregiverDashboard, setShowCaregiverDashboard] = useState(false);
  const [showCaregiverTabs, setShowCaregiverTabs] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [showCaregiverProfile, setShowCaregiverProfile] = useState(false);

  // Handle tab parameter for direct navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['home', 'calendar', 'circle', 'ask-cella', 'health-logs', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (user && !profileType) {
      handleProfilefetch();
    }
  }, [user, profileType]);
  
//=======================================//


  const handleAuthComplete = (profile: any) => {
    setUserProfile(profile);
    setShowAuth(false);
    //console.log("running handleAuthComplete, profile set;", profile);
  };

  const handleProfileSelect = (type: 'warrior' | 'caregiver' | null) => {
    setProfileType(type);
    setShowCaregiverDashboard(type === 'caregiver');
    setShowCaregiverTabs(false);
  };

  const handleBackToAuth = () => {
    setShowAuth(true);
    setUserProfile(null);
    setShowCaregiverDashboard(false);
    setShowCaregiverTabs(false);
  };

  const handleCareGiverModeSwitch = () => {
    setShowCaregiverDashboard(false);
    setShowCaregiverTabs(true);
  }
  const handleCaregiverBack = () => {
    if (showCaregiverTabs) {
      setShowCaregiverTabs(false);
      setShowCaregiverDashboard(true);
    } else {
      setShowCaregiverTabs(true);
    }
  };

  const handleCaregiverSignOut = async () => {
    console.log("handling caregiver sign out");
    await signOut();
    // Let the auth state change handle the navigation back to AuthFlow
    // Don't manually set state as it interferes with the natural auth flow
  };

  const handleCaregiverProfile = () => {
    setShowCaregiverProfile(true);
  };

const handleProfilefetch = async () => {
  if (!user?.id) return; // sanity check — don’t query without user

  try {
    console.log("Fetching profile for:", user.id);
    const { data, error, status } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      console.log("Profile fetch response:", { data,});
    // Case 1: profile not found
    if (status === 406 || data.role === null) {
      console.log("No profile found for user, prompting selection...");
      handleProfileSelect(null);
      setShowAuth(true); // still authenticated, just no profile yet
      return;
    }

    // Case 2: found successfully
    if (error) throw error;
    console.log("Fetched profile role:", data.role);
    handleProfileSelect(data.role);
    setShowAuth(false);

  } catch (error: any) {
    console.error("Profile fetch error:", error.message);
    toast({
      title: "Error fetching profile",
      description: error.message,
      variant: "destructive",
    });
  }
};


  // program starts here
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen cella-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
          <p className="mt-2 text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if not authenticated and showAuth is true
  console.log("showAuth:", showAuth, "user:", user);
 
  if (!user || showAuth) {
    return <AuthFlow onComplete={handleAuthComplete} />;
  }

  // Show profile selector if authenticated but no profile type selected
  console.log("userProfile:", userProfile, "profileType:", profileType);

  console.log("caregiver dashboard state:", showCaregiverDashboard, "caregiver tabs state:", showCaregiverTabs);
  // Show caregiver profile settings
  if (showCaregiverProfile && profileType === 'caregiver') {
    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1 pb-20">
          <CaregiverProfileSettings
            onBack={() => setShowCaregiverProfile(false)}
            children={[]} // Empty for now - will be populated when connected to real child data
            onProfileTypeChange={(type) => {
              if (type === null) {
                // Sign out
                setUserProfile(null);
                setProfileType(null);
                setShowCaregiverDashboard(false);
                setShowCaregiverTabs(false);
                setShowCaregiverProfile(false);
                setShowAuth(true);
                return;
              }
              setProfileType(type);
              if (type === 'caregiver') {
                setShowCaregiverDashboard(true);
                setShowCaregiverTabs(false);
                setShowCaregiverProfile(false);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Show caregiver dashboard initially for caregivers
  if (showCaregiverDashboard) {
    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1 pb-20">
          <CaregiverDashboard onNavigateToTabs={handleCareGiverModeSwitch} />
        </div>
        <Footer
          showNavigation={true}
          navigationType="caregiver-dashboard"
          onSignOut={handleCaregiverSignOut}
          onProfile={handleCaregiverProfile}
        />
      </div>
    );
  }

  // Show caregiver tabs view (Circle and Ask Cella)
  if (showCaregiverTabs && profileType === 'caregiver') {
    const renderCaregiverTab = () => {
      switch (activeCaregiversTab) {
        case 'circle':
          return <WarriorCirclePage profileType={profileType} onBack={handleCaregiverBack} />;
        case 'ask-cella':
          return <WarriorAskCellaPage onBack={handleCaregiverBack} />;
        default:
          return <WarriorCirclePage profileType={profileType} onBack={handleCaregiverBack} />;
      }
    };

    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1 pb-20">
          {renderCaregiverTab()}
        </div>
        <Footer
          showNavigation={true}
          activeTab={activeCaregiversTab}
          onTabChange={setActiveCaregiverTab}
          navigationType="caregiver"
          onBack={handleCaregiverBack}
          onSignOut={handleCaregiverSignOut}
        />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <WarriorHomePage profileType={profileType} activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'calendar':
        return <WarriorCalendarPage />;
      case 'ask-cella':
        return <WarriorAskCellaPage />;
      case 'circle':
        return <WarriorCirclePage profileType={profileType} />;
      case 'health-logs':
        return <HealthLogsPage />;
      case 'profile':
        return <WarriorProfilePage profileType={profileType} onProfileChange={(type) => {
          if (type === null) {
            // Sign out
            setUserProfile(null);
            setProfileType(null);
            setShowCaregiverDashboard(false);
            setShowCaregiverTabs(false);
            setShowAuth(true);
            return;
          }
          setProfileType(type);
          if (type === 'caregiver') {
            setShowCaregiverDashboard(true);
            setShowCaregiverTabs(false);
          }
        }} />;
    default:
      //return <WarriorHomePage profileType={profileType} activeTab={activeTab} onTabChange={setActiveTab} />;
      return <NotFound />
  }
  };

  return (
    <div className="min-h-screen cella-gradient flex flex-col">
      <div className="flex-1 pb-20">
        {renderActiveTab()}
      </div>
      <Footer
        showNavigation={profileType === 'warrior'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        navigationType="warrior"
      />
    </div>
  );
};

export default Index;
