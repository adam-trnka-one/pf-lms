import type { Course, ExamSection } from '../types/lms';

export const mockCourse: Course = {
  id: '1',
  title: 'Professional Certification Program',
  description: 'Master the essential skills and concepts with our comprehensive certification program.',
  totalDuration: 240, // 4 hours
  progress: 35,
  chapters: [
    {
      id: '1',
      title: 'Introduction to Core Concepts',
      description: 'Learn the fundamental principles and theoretical framework.',
      duration: 60,
      milestones: [
        {
          id: '1-1',
          title: 'Live Theory Session',
          type: 'theory',
          completed: true
        },
        {
          id: '1-2',
          title: 'Practice Assignment',
          type: 'homework',
          completed: true
        }
      ]
    },
    {
      id: '2',
      title: 'Advanced Applications',
      description: 'Apply your knowledge to real-world scenarios.',
      duration: 60,
      milestones: [
        {
          id: '2-1',
          title: 'Live Workshop',
          type: 'theory',
          completed: true
        },
        {
          id: '2-2',
          title: 'Project Work',
          type: 'homework',
          completed: false
        },
        {
          id: '2-3',
          title: 'Chapter Validation',
          type: 'exam',
          completed: false
        }
      ]
    }
  ]
};

export const mockExamSections: ExamSection[] = [
  {
    id: '1',
    title: 'Theoretical Knowledge',
    questionCount: 25,
    type: 'theoretical'
  },
  {
    id: '2',
    title: 'Practical Implementation',
    questionCount: 15,
    type: 'practical'
  }
];