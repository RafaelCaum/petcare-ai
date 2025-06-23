
import React from 'react';
import { User as UserType } from '../types/pet';
import UserProfileHeader from './profile/UserProfileHeader';
import SubscriptionStatus from './profile/SubscriptionStatus';
import PremiumFeatures from './profile/PremiumFeatures';
import AccountSettings from './profile/AccountSettings';
import SupportSection from './profile/SupportSection';

interface ProfilePageProps {
  user: UserType | null;
  onEditProfile: () => void;
  onManageSubscription: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onEditProfile, onManageSubscription }) => {
  console.log('ProfilePage rendering with user:', user);
  console.log('User photoUrl:', user?.photoUrl);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <UserProfileHeader user={user} />
      <SubscriptionStatus user={user} onManageSubscription={onManageSubscription} />
      <PremiumFeatures user={user} />
      <AccountSettings onEditProfile={onEditProfile} onManageSubscription={onManageSubscription} />
      <SupportSection />
    </div>
  );
};

export default ProfilePage;
