import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield } from 'lucide-react';
import type { User } from '../../types/auth';
import { getStoredUsers, setStoredUsers, getStoredCurrentUser } from '../../utils/storageUtils';
import { resetUserPassword } from '../../utils/auth';
import UserList from './UserList';
import CollapsibleSection from './CollapsibleSection';
import EditUserModal from './EditUserModal';
import InviteUserModal from './InviteUserModal';
import { createInvitation } from '../../utils/invitationUtils';

interface UserManagementProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export default function UserManagement({ onError, onSuccess }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const loadedUsers = getStoredUsers();
      setUsers(loadedUsers);
    } catch (err) {
      onError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (invitation: any) => {
    try {
      const newUser: User = {
        id: crypto.randomUUID(),
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        username: invitation.username,
        company: invitation.company,
        phone: invitation.phone,
        status: 'invited',
        role: invitation.role,
        permissions: invitation.permissions,
        invitationCode: crypto.randomUUID().split('-')[0]
      };

      const updatedUsers = [...users, newUser];
      setStoredUsers(updatedUsers);
      setUsers(updatedUsers);

      // Create and store invitation
      createInvitation(newUser);
      
      setShowInviteModal(false);
      onSuccess('User invited successfully');
    } catch (err) {
      onError('Failed to invite user');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      );
      setStoredUsers(updatedUsers);
      setUsers(updatedUsers);
      onSuccess('User updated successfully');
    } catch (err) {
      onError('Failed to update user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: User['status']) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : user
      );
      setStoredUsers(updatedUsers);
      setUsers(updatedUsers);
      onSuccess('User status updated successfully');
    } catch (err) {
      onError('Failed to update user status');
    }
  };

  const handleUpdatePermissions = async (userId: string, updates: Partial<User['permissions']>) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, permissions: { ...user.permissions, ...updates } }
          : user
      );
      setStoredUsers(updatedUsers);
      setUsers(updatedUsers);
      onSuccess('User permissions updated successfully');
    } catch (err) {
      onError('Failed to update user permissions');
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const currentUser = getStoredCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const newPassword = await resetUserPassword(currentUser, userId);
      onSuccess(`Password has been reset to: ${newPassword}`);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  return (
    <CollapsibleSection
      title="User Management"
      icon={<Users className="h-6 w-6" />}
    >
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-[16%]">
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full h-full min-h-[88px] flex items-center justify-center space-x-2 px-4 bg-[#ff751d] text-white rounded-lg hover:bg-[#e66b1a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Invite User</span>
          </button>
        </div>
        <div className="w-[26%] bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-[#ff751d] mb-2">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Total Users</h3>
          </div>
          <p className="text-2xl font-semibold">{users.length}</p>
        </div>
        <div className="w-[26%] bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Active Users</h3>
          </div>
          <p className="text-2xl font-semibold">
            {users.filter(user => user.status === 'active').length}
          </p>
        </div>
        <div className="w-[26%] bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Shield className="h-5 w-5" />
            <h3 className="font-medium">Admin Users</h3>
          </div>
          <p className="text-2xl font-semibold">
            {users.filter(user => user.role === 'admin').length}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff751d] mx-auto"></div>
        </div>
      ) : (
        <UserList
          users={users}
          onEditUser={setEditingUser}
          onUpdatePermissions={handleUpdatePermissions}
          onToggleStatus={handleToggleStatus}
          onResetPassword={handleResetPassword}
        />
      )}

      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updates) => handleUpdateUser(editingUser.id, updates)}
        />
      )}
    </CollapsibleSection>
  );
}