export interface Chapter {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  duration: number; // in minutes
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  type: 'theory' | 'homework' | 'exam';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  totalDuration: number; // in minutes
  progress: number; // percentage
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number; // in minutes
  sections: ExamSection[];
}

export interface ExamSection {
  id: string;
  title: string;
  questionCount: number;
  type: 'theoretical' | 'practical';
}