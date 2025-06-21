
import { useState } from 'react';
import ProfileSelector from '@/components/ProfileSelector';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/components/pages/HomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import AskCellaPage from '@/components/pages/AskCellaPage';
import HealthLogsPage from '@/components/pages/HealthLogsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import CaregiverDashboard from '@/components/CaregiverDashboard';

const Index = () => {
  const [profileType, setProfileType] = useState<'patient' | 'caregiver' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showCaregiverDashboard, setShowCaregiverDashboard] = useState(false);

  const handleProfileSelect = (type: 'patient' | 'caregiver') => {
    setProfileType(type);
    setShowCaregiverDashboard(type === 'caregiver');
  };

  if (!profileType) {
    return <ProfileSelector onProfileSelect={handleProfileSelect} />;
  }

  // Show caregiver dashboard initially for caregivers
  if (showCaregiverDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white flex flex-col">
        <div className="flex-1 pb-20">
          <CaregiverDashboard />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          setShowCaregiverDashboard(false);
        }} />
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
      case 'health-logs':
        return <HealthLogsPage />;
      case 'profile':
        return <ProfilePage profileType={profileType} onProfileChange={(type) => {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white flex flex-col">
      <div className="flex-1 pb-20">
        {renderActiveTab()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
