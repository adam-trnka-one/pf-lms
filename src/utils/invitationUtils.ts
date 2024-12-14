import { User } from '../types/auth';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storageUtils';

interface Invitation {
  email: string;
  code: string;
  expiresAt: string;
  userId: string;
}

export function getInvitationLink(email: string, invitationCode: string): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    email: encodeURIComponent(email),
    code: invitationCode
  });
  return `${baseUrl}?invitation=${params.toString()}`;
}

export function storeInvitation(invitation: Invitation): void {
  const invitations = getStorageItem<Invitation[]>(STORAGE_KEYS.INVITATIONS, []);
  invitations.push(invitation);
  setStorageItem(STORAGE_KEYS.INVITATIONS, invitations);
}

export function getInvitation(email: string, code: string): Invitation | undefined {
  const invitations = getStorageItem<Invitation[]>(STORAGE_KEYS.INVITATIONS, []);
  return invitations.find(inv => inv.email === email && inv.code === code);
}

export function removeInvitation(email: string, code: string): void {
  const invitations = getStorageItem<Invitation[]>(STORAGE_KEYS.INVITATIONS, []);
  const filteredInvitations = invitations.filter(
    inv => !(inv.email === email && inv.code === code)
  );
  setStorageItem(STORAGE_KEYS.INVITATIONS, filteredInvitations);
}

export function generateInvitationCode(): string {
  return crypto.randomUUID().split('-')[0];
}

export function createInvitation(user: User): Invitation {
  const invitation: Invitation = {
    email: user.email,
    code: generateInvitationCode(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    userId: user.id
  };
  storeInvitation(invitation);
  return invitation;
}