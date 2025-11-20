import React from 'react';
import ProfilePage from '../../components/identity/ProfilePage';

const ConsumerProfilePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      <ProfilePage />
    </div>
  );
};

export default ConsumerProfilePage;
