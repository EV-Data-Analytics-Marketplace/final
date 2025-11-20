import React from 'react';
import UserManagement from '../../components/identity/UserManagement';

const AdminUsersPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage all users, roles, and permissions</p>
      </div>
      <UserManagement />
    </div>
  );
};

export default AdminUsersPage;
