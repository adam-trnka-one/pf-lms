export type NotificationType = 
  | 'upcoming_chapter'
  | 'expiring_certificate'
  | 'incomplete_chapter'
  | 'new_course_available'
  | 'chapter_available';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  courseId?: string;
  courseName?: string;
  chapterId?: string;
  chapterName?: string;
  isRead: boolean;
  actionUrl?: string;
  expiresAt?: string;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}