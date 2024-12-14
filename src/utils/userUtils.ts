import { User } from '../types/auth';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storageUtils';

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

export function getStoredEnrolledCourses(): string[] {
  const currentUser = getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
  if (!currentUser) return [];

  const userData = getUserCourseData(currentUser.id);
  return userData.enrolledCourses || [];
}

export function setStoredEnrolledCourses(enrolledCourses: string[] | Set<string>): void {
  const currentUser = getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
  if (!currentUser) return;
  
  const userCourses = getStorageItem(STORAGE_KEYS.USER_COURSES, {});
  userCourses[currentUser.id] = {
    ...userCourses[currentUser.id],
    enrolledCourses: Array.isArray(enrolledCourses) ? enrolledCourses : Array.from(enrolledCourses)
  };
  setStorageItem(STORAGE_KEYS.USER_COURSES, userCourses);
}