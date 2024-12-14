export type ActivityType = 
  | 'enrollment'
  | 'unenrollment'
  | 'milestone_completion'
  | 'chapter_completion'
  | 'course_completion';

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  courseId: string;
  courseName: string;
  chapterId?: string;
  chapterName?: string;
  milestoneId?: string;
  milestoneName?: string;
}

export interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}