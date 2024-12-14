import { User, UserInvitation } from '../types/auth';
import { getStoredUsers, setStoredUsers } from './storageUtils';
import { createInvitation } from './invitationUtils';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function inviteUser(invitation: UserInvitation): Promise<User> {
  await delay(500);
  
  const users = getStoredUsers();
  const existingUser = users.find(u => u.email === invitation.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email: invitation.email,
    firstName: invitation.firstName || '',
    lastName: invitation.lastName || '',
    username: invitation.username,
    company: invitation.company,
    phone: invitation.phone,
    status: 'invited',
    role: invitation.role,
    permissions: invitation.permissions,
    invitationCode: crypto.randomUUID().split('-')[0]
  };

  // Create invitation
  createInvitation(newUser);

  // Add user to storage
  users.push(newUser);
  setStoredUsers(users);

  return newUser;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  await delay(500);
  
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  setStoredUsers(users);
  return users[userIndex];
}

export async function toggleUserStatus(userId: string): Promise<User> {
  await delay(500);
  
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const currentStatus = users[userIndex].status;
  users[userIndex] = {
    ...users[userIndex],
    status: currentStatus === 'active' ? 'inactive' : 'active'
  };

  setStoredUsers(users);
  return users[userIndex];
}

export async function updateUserPermissions(
  userId: string, 
  permissions: Partial<User['permissions']>
): Promise<User> {
  await delay(500);
  
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex] = {
    ...users[userIndex],
    permissions: {
      ...users[userIndex].permissions,
      ...permissions
    }
  };

  setStoredUsers(users);
  return users[userIndex];
}
