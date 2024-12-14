import { User, LoginCredentials } from '../types/auth';
import { getStoredUsers, setStoredUsers, getStoredCurrentUser, setStoredCurrentUser, clearStoredCurrentUser } from './storageUtils';
import { getInvitation, removeInvitation } from './invitationUtils';
import { generateRandomPassword } from './passwordUtils';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'adam.trnka@productfruits.com',
    firstName: 'Adam',
    lastName: 'Trnka',
    password: 'admin',
    status: 'active',
    permissions: {
      canAccessCourses: true,
      canTakeExams: true,
      canDownloadCertificates: true
    },
    role: 'admin',
    progress: {
      coursesCompleted: 0,
      certificationsEarned: 0,
      lastActive: new Date().toISOString()
    }
  }
];

// Initialize users with default admin if storage is empty
let users = getStoredUsers();
if (users.length === 0) {
  users = DEFAULT_USERS;
  setStoredUsers(users);
}

export async function loginUser({ email, password }: LoginCredentials): Promise<User> {
  await delay(1000);
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Don't send password to frontend
  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}

export function getStoredUser(): User | null {
  return getStoredCurrentUser();
}

export function storeUser(user: User): void {
  setStoredCurrentUser(user);
}

export function clearStoredUser(): void {
  clearStoredCurrentUser();
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  await delay(1000);
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Update user data
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;
  setStoredUsers(users);

  // Update stored user if it's the current user
  const storedUser = getStoredUser();
  if (storedUser && storedUser.id === userId) {
    storeUser(updatedUser);
  }

  return updatedUser;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  await delay(1000);
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  if (users[userIndex].password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }

  users[userIndex].password = newPassword;
  setStoredUsers(users);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await delay(1000);
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('No account found with this email address');
  }

  // In a real app, this would send an email with a reset link
  // For demo purposes, we'll just set a temporary reset token
  user.resetToken = crypto.randomUUID();
  user.resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour
  
  setStoredUsers(users);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await delay(1000);
  const users = getStoredUsers();
  const user = users.find(u => u.resetToken === token);
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  if (new Date(user.resetTokenExpiry!) < new Date()) {
    throw new Error('Reset token has expired');
  }

  // Update password and clear reset token
  user.password = newPassword;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  
  setStoredUsers(users);
}

export async function acceptInvitation(email: string, invitationCode: string, password: string): Promise<void> {
  await delay(1000);
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.invitationCode === invitationCode);
  if (!user) {
    throw new Error('Invalid invitation code or email');
  }

  if (user.status !== 'invited') {
    throw new Error('Invalid invitation or user status');
  }

  const userIndex = users.findIndex(u => u.id === user.id);
  users[userIndex] = {
    ...user,
    status: 'active',
    password: password
  };
  delete users[userIndex].invitationCode;
  
  setStoredUsers(users);
}

export async function resetUserPassword(adminUser: User, targetUserId: string): Promise<string> {
  await delay(500);
  if (adminUser.role !== 'admin') {
    throw new Error('Only administrators can reset passwords');
  }

  const users = getStoredUsers();
  const targetUser = users.find(u => u.id === targetUserId);
  
  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.role === 'admin') {
    throw new Error('Cannot reset password for admin users');
  }
  
  if (targetUser.status !== 'active') {
    throw new Error('Can only reset passwords for active users');
  }

  const newPassword = generateRandomPassword();
  const userIndex = users.findIndex(u => u.id === targetUserId);
  users[userIndex] = {
    ...users[userIndex],
    password: newPassword
  };
  
  setStoredUsers(users);
  return newPassword;
}