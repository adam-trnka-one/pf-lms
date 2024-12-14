import { Course, CourseFormData } from '../types/course';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storageUtils';
import { getUserCourseData, setUserCourseData } from './userUtils';
import { addActivity } from './activity';
import { getStoredCurrentUser } from './storageUtils';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCourses(): Promise<Course[]> {
  await delay(500);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const currentUser = getStoredCurrentUser();
  
  if (!currentUser) {
    return [];
  }

  // Get user's course data
  const userData = getUserCourseData(currentUser.id);
  const enrolledCourseIds = userData.enrolledCourses || [];

  // Map enrolled status to courses
  return courses.map(course => ({
    ...course,
    enrolledAt: enrolledCourseIds.includes(course.id) ? 
      (userData.courseProgress?.[course.id]?.enrolledAt || null) : null,
    completedAt: userData.courseProgress?.[course.id]?.completedAt || undefined
  }));
}

export async function createCourse(courseData: CourseFormData): Promise<Course> {
  await delay(1000);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  
  const newCourse: Course = {
    ...courseData,
    id: crypto.randomUUID(),
    enrolledAt: null,
    enrolledCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  courses.push(newCourse);
  setStorageItem(STORAGE_KEYS.COURSES, courses);
  return newCourse;
}

export async function updateCourse(courseId: string, updates: Partial<CourseFormData>): Promise<Course> {
  await delay(500);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }

  courses[courseIndex] = {
    ...courses[courseIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  setStorageItem(STORAGE_KEYS.COURSES, courses);
  return courses[courseIndex];
}

export async function enrollCourse(courseId: string): Promise<Course> {
  await delay(500);
  const currentUser = getStoredCurrentUser();
  if (!currentUser) {
    throw new Error('User not logged in');
  }

  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }

  // Update course enrollment count
  courses[courseIndex] = {
    ...courses[courseIndex],
    enrolledCount: courses[courseIndex].enrolledCount + 1,
    updatedAt: new Date().toISOString()
  };

  // Update user's enrolled courses
  const userData = getUserCourseData(currentUser.id);
  userData.enrolledCourses = [...(userData.enrolledCourses || []), courseId];
  userData.courseProgress = {
    ...userData.courseProgress,
    [courseId]: {
      enrolledAt: new Date().toISOString(),
      completedAt: null,
      milestones: {}
    }
  };

  setStorageItem(STORAGE_KEYS.COURSES, courses);
  setUserCourseData(currentUser.id, userData);
  
  // Track enrollment activity
  addActivity({
    type: 'enrollment',
    courseId: courseId,
    courseName: courses[courseIndex].title
  });
  
  return courses[courseIndex];
}

export async function unenrollCourse(courseId: string): Promise<Course> {
  await delay(500);
  const currentUser = getStoredCurrentUser();
  if (!currentUser) {
    throw new Error('User not logged in');
  }

  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }

  // Update course enrollment count
  courses[courseIndex] = {
    ...courses[courseIndex],
    enrolledCount: Math.max(0, courses[courseIndex].enrolledCount - 1),
    updatedAt: new Date().toISOString()
  };

  // Update user's enrolled courses
  const userData = getUserCourseData(currentUser.id);
  userData.enrolledCourses = userData.enrolledCourses.filter(id => id !== courseId);
  delete userData.courseProgress[courseId];

  setStorageItem(STORAGE_KEYS.COURSES, courses);
  setUserCourseData(currentUser.id, userData);
  
  // Track unenrollment activity
  addActivity({
    type: 'unenrollment',
    courseId: courseId,
    courseName: courses[courseIndex].title
  });
  
  return courses[courseIndex];
}

export async function toggleCourseStatus(courseId: string): Promise<Course> {
  await delay(500);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }

  const newStatus = courses[courseIndex].status === 'active' ? 'inactive' : 'active';
  
  courses[courseIndex] = {
    ...courses[courseIndex],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  setStorageItem(STORAGE_KEYS.COURSES, courses);
  return courses[courseIndex];
}

export async function deleteCourse(courseId: string): Promise<void> {
  await delay(500);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }

  if (courses[courseIndex].status !== 'inactive') {
    throw new Error('Only inactive courses can be deleted');
  }

  // Remove course from array
  courses.splice(courseIndex, 1);
  setStorageItem(STORAGE_KEYS.COURSES, courses);
}

export async function cloneCourse(courseId: string): Promise<Course> {
  await delay(500);
  const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
  const sourceCourse = courses.find(course => course.id === courseId);
  
  if (!sourceCourse) {
    throw new Error('Course not found');
  }

  const newCourse: Course = {
    ...sourceCourse,
    id: crypto.randomUUID(),
    title: `${sourceCourse.title} (Copy)`,
    enrolledAt: null,
    enrolledCount: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: sourceCourse.chapters.map(chapter => ({
      ...chapter,
      id: crypto.randomUUID(),
      milestones: chapter.milestones.map(milestone => ({
        ...milestone,
        id: crypto.randomUUID(),
        completed: false,
        completedAt: undefined
      }))
    }))
  };

  courses.push(newCourse);
  setStorageItem(STORAGE_KEYS.COURSES, courses);
  return newCourse;
}