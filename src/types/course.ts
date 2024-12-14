export interface ChapterMeeting {
  type: 'teams' | 'zoom' | 'meet';
  url: string;
}

export interface ChapterVideo {
  type: 'youtube' | 'vimeo' | 'loom';
  url: string;
}

export interface ChapterMilestone {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'questionary';
  completedAt?: string;
  enabled: boolean;
  adminOnly: boolean;
  completed: boolean;
  questions?: {
    question: string;
    answers: string[];
    correctAnswer: number;
  }[];
}

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  duration: number;
  startDate: string;
  startTime: string;
  meeting?: ChapterMeeting;
  video?: ChapterVideo;
  documents?: ChapterDocument[];
  documentationUrl?: string;
  milestones: ChapterMilestone[];
  order: number;
}

export interface ChapterDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  enrolledAt: string | null;
  completedAt?: string;
  status: 'active' | 'inactive' | 'draft';
  startDate: string;
  enrolledCount: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
  duration: number; // in minutes
  chapters: CourseChapter[];
  thumbnail?: string;
  certificateValidity: {
    months: number;
    renewable: boolean;
    requiresAssessment: boolean;
  };
  instructor: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  targetUsers?: string[]; // Array of user IDs that can access this course
}

export interface CourseFormData {
  title: string;
  description: string;
  status: Course['status'];
  duration: number;
  chapters: CourseChapter[];
  certificateValidity: {
    months: number;
    renewable: boolean;
    requiresAssessment: boolean;
  };
  instructor: {
    id: string;
    name: string;
  };
  targetUsers?: string[];
}