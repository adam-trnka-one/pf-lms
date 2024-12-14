import type { Course, CourseChapter, ChapterMilestone } from '../types/course';

function generateNewId(): string {
  return crypto.randomUUID();
}

function duplicateMilestone(milestone: ChapterMilestone): ChapterMilestone {
  return {
    ...milestone,
    id: generateNewId(),
    completed: false,
    completedAt: undefined
  };
}

function duplicateChapter(chapter: CourseChapter): CourseChapter {
  return {
    ...chapter,
    id: generateNewId(),
    milestones: chapter.milestones.map(duplicateMilestone)
  };
}

export function duplicateCourse(course: Course): Course {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + 7); // Start in a week by default

  return {
    ...course,
    id: generateNewId(),
    title: `${course.title} (Copy)`,
    enrolledAt: null,
    completedAt: undefined,
    status: 'draft',
    enrolledCount: 0,
    startDate: startDate.toISOString().split('T')[0],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    chapters: course.chapters.map(duplicateChapter)
  };
}