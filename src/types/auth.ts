export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  status: 'active' | 'invited' | 'inactive';
  permissions: {
    canAccessCourses: boolean;
    canTakeExams: boolean;
    canDownloadCertificates: boolean;
  };
  company?: string;
  phone?: string;
  title?: string;
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
  };
  role: 'user' | 'admin';
  avatar?: string;
  invitationCode?: string;
  progress?: {
    coursesCompleted: number;
    certificationsEarned: number;
    lastActive: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserInvitation {
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  company?: string;
  phone?: string;
  role: 'user' | 'admin';
  permissions: User['permissions'];
}