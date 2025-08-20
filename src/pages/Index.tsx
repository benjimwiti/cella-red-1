
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import ProfileSelector from '@/components/ProfileSelector';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/components/pages/HomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import AskCellaPage from '@/components/pages/AskCellaPage';
import HealthLogsPage from '@/components/pages/HealthLogsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import CirclePage from '@/components/pages/CirclePage';
import CaregiverDashboard from '@/components/CaregiverDashboard';
import AuthFlow from '@/components/auth/AuthFlow';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileType, setProfileType] = useState<'patient' | 'caregiver' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showCaregiverDashboard, setShowCaregiverDashboard] = useState(false);
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
  };

  const handleBackToAuth = () => {
    setShowAuth(true);
    setUserProfile(null);
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
          <CaregiverDashboard />
        </div>
        <Footer />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage profileType={profileType} />;
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
            setShowAuth(true);
            return;
          }
          setProfileType(type);
          if (type === 'caregiver') {
            setShowCaregiverDashboard(true);
          }
        }} />;
      default:
        return <HomePage profileType={profileType} />;
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
