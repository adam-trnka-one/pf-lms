// Storage keys
export const STORAGE_KEYS = {
  COURSES: 'lms_courses',
  USER_COURSES: 'lms_user_courses',
  USERS: 'lms_users',
  CURRENT_USER: 'lms_current_user',
  INVITATIONS: 'lms_invitations'
} as const;

// Helper functions
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}

// User storage
export function getStoredUsers() {
  return getStorageItem(STORAGE_KEYS.USERS, []);
}

export function setStoredUsers(users: any[]) {
  setStorageItem(STORAGE_KEYS.USERS, users);
}

// Get admin users
export function getAdminUsers() {
  const users = getStoredUsers();
  return users.filter(user => user.role === 'admin' && user.status === 'active');
}

// Current user storage
export function getStoredCurrentUser() {
  return getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
}

export function setStoredCurrentUser(user: any) {
  setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function clearStoredCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Course storage
export function getStoredCourses() {
  return getStorageItem(STORAGE_KEYS.COURSES, []);
}

export function setStoredCourses(courses: any[]) {
  setStorageItem(STORAGE_KEYS.COURSES, courses);
}

// User course data
export function getUserCourseData(userId: string) {
  const userCourses = getStorageItem(STORAGE_KEYS.USER_COURSES, {});
  return userCourses[userId] || {
    enrolledCourses: [],
    courseProgress: {}
  };
}

export function setUserCourseData(userId: string, data: any) {
  const userCourses = getStorageItem(STORAGE_KEYS.USER_COURSES, {});
  userCourses[userId] = data;
  setStorageItem(STORAGE_KEYS.USER_COURSES, userCourses);
}