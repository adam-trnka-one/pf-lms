import { Notification, NotificationType } from '../types/notification';
import { Course, CourseChapter } from '../types/course';
import { getStorageItem, setStorageItem } from './localStorage';
import { isCertificationValid } from './certificate';

const STORAGE_KEY = 'lms_notifications';

export function getStoredNotifications(): Notification[] {
  return getStorageItem(STORAGE_KEY, []);
}

export function setStoredNotifications(notifications: Notification[]): void {
  setStorageItem(STORAGE_KEY, notifications);
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
  const notifications = getStoredNotifications();
  const newNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  notifications.unshift(newNotification);
  setStoredNotifications(notifications);
}

export function markAsRead(notificationId: string): void {
  const notifications = getStoredNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId ? { ...notification, isRead: true } : notification
  );
  setStoredNotifications(updatedNotifications);
}

export function markAllAsRead(): void {
  const notifications = getStoredNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    isRead: true
  }));
  setStoredNotifications(updatedNotifications);
}

export function clearAllNotifications(): void {
  setStoredNotifications([]);
}

export function generateNotifications(courses: Course[]): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoDaysFromNow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const existingNotifications = getStoredNotifications();
  const notifications: Omit<Notification, 'id' | 'timestamp' | 'isRead'>[] = [];

  courses.forEach(course => {
    // Check for expiring certificates
    if (course.completedAt) {
      const completionDate = new Date(course.completedAt);
      const validityEndDate = new Date(completionDate);
      validityEndDate.setMonth(validityEndDate.getMonth() + course.certificateValidity.months);
      
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      if (validityEndDate > today && validityEndDate <= thirtyDaysFromNow) {
        notifications.push({
          type: 'expiring_certificate',
          title: 'Certificate Expiring Soon',
          message: `Your certificate for "${course.title}" will expire on ${validityEndDate.toLocaleDateString()}`,
          courseId: course.id,
          courseName: course.title,
          expiresAt: validityEndDate.toISOString()
        });
      }
    }

    // Check for upcoming chapters
    if (course.enrolledAt && !course.completedAt) {
      course.chapters.forEach(chapter => {
        const chapterDate = new Date(chapter.startDate);
        chapterDate.setHours(0, 0, 0, 0);
        
        // Check if chapter just became available today
        if (chapterDate.getTime() === today.getTime() && !chapter.milestones.every(m => m.completed)) {
          // Check if we haven't already notified about this chapter
          const alreadyNotified = existingNotifications.some(n => 
            n.type === 'chapter_available' && 
            n.chapterId === chapter.id &&
            n.courseId === course.id
          );

          if (!alreadyNotified) {
          notifications.push({
            type: 'chapter_available',
            title: 'New Chapter Available',
            message: `Chapter "${chapter.title}" in "${course.title}" is now available!`,
            courseId: course.id,
            courseName: course.title,
            chapterId: chapter.id,
            chapterName: chapter.title
          });
          }
        }

        if (chapterDate > today && chapterDate <= twoDaysFromNow) {
          notifications.push({
            type: 'upcoming_chapter',
            title: 'Upcoming Chapter',
            message: `Chapter "${chapter.title}" in "${course.title}" starts on ${chapterDate.toLocaleString()}`,
            courseId: course.id,
            courseName: course.title,
            chapterId: chapter.id,
            chapterName: chapter.title,
            expiresAt: chapter.startDate
          });
        }
      });

      // Check for incomplete chapters
      const incompleteChapters = course.chapters.filter(chapter => 
        !chapter.milestones.every(m => m.completed) &&
        new Date(chapter.startDate) < today
      );

      incompleteChapters.forEach(chapter => {
        notifications.push({
          type: 'incomplete_chapter',
          title: 'Incomplete Chapter',
          message: `You have incomplete milestones in "${chapter.title}" (${course.title})`,
          courseId: course.id,
          courseName: course.title,
          chapterId: chapter.id,
          chapterName: chapter.title
        });
      });
    }
  });

  // Add notifications
  notifications.forEach(addNotification);
}