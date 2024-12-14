import { Activity } from '../types/activity';
import { getStorageItem, setStorageItem } from './localStorage';

const STORAGE_KEY = 'lms_user_activities';

export function getStoredActivities(): Activity[] {
  return getStorageItem(STORAGE_KEY, []);
}

export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
  const activities = getStoredActivities();
  const newActivity: Activity = {
    ...activity,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
  
  activities.unshift(newActivity);
  setStorageItem(STORAGE_KEY, activities);
}

export function formatActivityMessage(activity: Activity): string {
  switch (activity.type) {
    case 'enrollment':
      return `Enrolled in "${activity.courseName}"`;
    case 'unenrollment':
      return `Unenrolled from "${activity.courseName}"`;
    case 'milestone_completion':
      return `Completed milestone "${activity.milestoneName}" in ${activity.courseName}`;
    case 'chapter_completion':
      return `Completed chapter "${activity.chapterName}" in ${activity.courseName}`;
    case 'course_completion':
      return `Completed course "${activity.courseName}"`;
    default:
      return '';
  }
}