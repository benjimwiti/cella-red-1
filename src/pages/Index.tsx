
import { useState } from 'react';
import ProfileSelector from '@/components/ProfileSelector';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [profileType, setProfileType] = useState<'patient' | 'caregiver' | null>(null);

  const handleProfileSelect = (type: 'patient' | 'caregiver') => {
    setProfileType(type);
  };

  if (!profileType) {
    return <ProfileSelector onProfileSelect={handleProfileSelect} />;
  }

  return <Dashboard profileType={profileType} />;
};

export default Index;
