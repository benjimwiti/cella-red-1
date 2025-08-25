
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import ProfileSelector from '@/components/ProfileSelector';
import BottomNavigation from '@/components/BottomNavigation';
import WarriorHomePage from '@/components/pages/WarriorHomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import AskCellaPage from '@/components/pages/AskCellaPage';
import HealthLogsPage from '@/components/pages/HealthLogsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import CirclePage from '@/components/pages/CirclePage';
import CaregiverDashboard from '@/components/CaregiverDashboard';
import CaregiverBottomNavigation from '@/components/CaregiverBottomNavigation';
import AuthFlow from '@/components/auth/AuthFlow';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileType, setProfileType] = useState<'patient' | 'caregiver' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCaregiversTab, setActiveCaregiverTab] = useState('circle');
  const [showCaregiverDashboard, setShowCaregiverDashboard] = useState(false);
  const [showCaregiverTabs, setShowCaregiverTabs] = useState(false);
  const [showAuth, setShowAuth] = useState(true);

  // Handle tab parameter for direct navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['home', 'calendar', 'circle', 'ask-cella', 'health-logs', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleAuthComplete = (profile: any) => {
    setUserProfile(profile);
    setShowAuth(false);
  };

  const handleProfileSelect = (type: 'patient' | 'caregiver') => {
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

  const handleCaregiverBack = () => {
    if (showCaregiverTabs) {
      setShowCaregiverTabs(false);
      setShowCaregiverDashboard(true);
    } else {
      setShowCaregiverDashboard(false);
      setProfileType(null);
    }
  };

  const handleCaregiverSignOut = () => {
    setUserProfile(null);
    setProfileType(null);
    setShowCaregiverDashboard(false);
    setShowCaregiverTabs(false);
    setShowAuth(true);
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen cella-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
          <p className="mt-2 text-brand-charcoal/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if not authenticated and showAuth is true
  if (!user && showAuth) {
    return <AuthFlow onComplete={handleAuthComplete} />;
  }

  // Show profile selector if authenticated but no profile type selected
  if (userProfile && !profileType) {
    return <ProfileSelector onProfileSelect={handleProfileSelect} onBack={handleBackToAuth} />;
  }

  // Show caregiver dashboard initially for caregivers
  if (showCaregiverDashboard) {
    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1">
          <CaregiverDashboard onNavigateToTabs={() => setShowCaregiverTabs(true)} />
        </div>
        <Footer />
      </div>
    );
  }

  // Show caregiver tabs view (Circle and Ask Cella)
  if (showCaregiverTabs && profileType === 'caregiver') {
    const renderCaregiverTab = () => {
      switch (activeCaregiversTab) {
        case 'circle':
          return <CirclePage profileType={profileType} onBack={handleCaregiverBack} />;
        case 'ask-cella':
          return <AskCellaPage onBack={handleCaregiverBack} />;
        default:
          return <CirclePage profileType={profileType} onBack={handleCaregiverBack} />;
      }
    };

    return (
      <div className="min-h-screen cella-gradient flex flex-col">
        <div className="flex-1 pb-20">
          {renderCaregiverTab()}
        </div>
        <CaregiverBottomNavigation 
          activeTab={activeCaregiversTab} 
          onTabChange={setActiveCaregiverTab}
          onBack={handleCaregiverBack}
          onSignOut={handleCaregiverSignOut}
        />
        <Footer />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <WarriorHomePage profileType={profileType} />;
      case 'calendar':
        return <CalendarPage />;
      case 'ask-cella':
        return <AskCellaPage />;
      case 'circle':
        return <CirclePage profileType={profileType} />;
      case 'health-logs':
        return <HealthLogsPage />;
        case 'profile':
          return <ProfilePage profileType={profileType} onProfileChange={(type) => {
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
        return <WarriorHomePage profileType={profileType} />;
    }
  };

  return (
    <div className="min-h-screen cella-gradient flex flex-col">
      <div className="flex-1 pb-20">
        {renderActiveTab()}
      </div>
      {profileType === 'patient' && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      <Footer />
    </div>
  );
};

export default Index;
