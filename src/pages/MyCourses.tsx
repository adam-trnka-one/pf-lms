import React from 'react';
import AvailableCourses from '../components/AvailableCourses';
import EnrolledCourses from '../components/EnrolledCourses';
import FinishedCourses from '../components/FinishedCourses';
import { getCourses, updateCourse, resetCourseProgress, enrollCourse, unenrollCourse } from '../utils/courseManagement';
import { useState, useEffect } from 'react';
import type { Course } from '../types/course';
import type { User } from '../types/auth';
import { getStoredEnrolledCourses, setStoredEnrolledCourses } from '../utils/localStorage';
import { addActivity } from '../utils/activity';

interface MyCoursesProps {
  user: User;
}

export default function MyCourses({ user }: MyCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set(getStoredEnrolledCourses())
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setStoredEnrolledCourses(enrolledCourses);
  }, [enrolledCourses]);

  const loadCourses = async () => {
    try {
      const loadedCourses = await getCourses();
      setCourses(loadedCourses);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollCourse(courseId);

      // Update courses list with enrollment date
      loadCourses();

      // Update enrolled courses set
      setEnrolledCourses(prev => new Set([...prev, courseId]));
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      await unenrollCourse(courseId);

      loadCourses();
      // Remove from enrolled courses
      setEnrolledCourses(prev => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });

    } catch (err) {
      console.error('Failed to unenroll:', err);
    }
  };

  const handleMilestoneComplete = async (courseId: string, chapterId: string, milestoneId: string) => {
    try {
      // Optimistically update the UI
      setCourses(prevCourses => prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            chapters: course.chapters.map(chapter => {
              if (chapter.id === chapterId) {
                return {
                  ...chapter,
                  milestones: chapter.milestones.map(milestone => {
                    if (milestone.id === milestoneId) {
                      return {
                        ...milestone,
                        completed: true,
                        completedAt: new Date().toISOString()
                      };
                    }
                    return milestone;
                  })
                };
              }
              return chapter;
            })
          };
        }
        return course;
      }));

      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const updatedChapters = course.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          const milestone = chapter.milestones.find(m => m.id === milestoneId);
          if (milestone) {
            // Track milestone completion activity
            addActivity({
              type: 'milestone_completion',
              courseId: courseId,
              courseName: course.title,
              chapterId: chapterId,
              chapterName: chapter.title,
              milestoneId: milestoneId,
              milestoneName: milestone.title
            });

            // Check if all milestones in chapter are completed
            const allMilestonesCompleted = chapter.milestones.every(m => 
              m.id === milestoneId || m.completed
            );

            if (allMilestonesCompleted) {
              // Track chapter completion activity
              addActivity({
                type: 'chapter_completion',
                courseId: courseId,
                courseName: course.title,
                chapterId: chapterId,
                chapterName: chapter.title
              });

              // Check if all chapters are completed
              const allChaptersCompleted = course.chapters.every(ch =>
                ch.id === chapterId ? allMilestonesCompleted : ch.milestones.every(m => m.completed)
              );

              if (allChaptersCompleted) {
                // Track course completion activity
                addActivity({
                  type: 'course_completion',
                  courseId: courseId,
                  courseName: course.title
                });
              }
            }
          }

          return {
            ...chapter,
            milestones: chapter.milestones.map(milestone => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  completed: true,
                  completedAt: new Date().toISOString()
                };
              }
              return milestone;
            })
          };
        }
        return chapter;
      });

      await updateCourse(courseId, { chapters: updatedChapters });
      
      // Update local state
      loadCourses(); // Refresh data from server
    } catch (err) {
      // Revert optimistic update on error
      loadCourses();
      console.error('Failed to complete milestone:', err);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Learning Journey</h2>
          <p className="text-sm text-gray-500">Track your progress and complete course milestones to earn certificates.</p>
        </div>
        
        <div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff751d] mx-auto"></div>
            </div>
          ) : (
            <EnrolledCourses
              courses={courses.filter(course => 
                enrolledCourses.has(course.id) && 
                course.chapters.some(ch => !ch.milestones.every(m => m.completed))
              )}
              user={user}
              onUnenroll={handleUnenroll}
              onMilestoneComplete={handleMilestoneComplete}
            />
          )}
        </div>

        <div>
          <AvailableCourses
            courses={courses.filter(course => 
              !enrolledCourses.has(course.id) &&
              course.status === 'active' &&
              (!course.targetUsers?.length || course.targetUsers.includes(user.id)) && (
                new Date(course.startDate).setHours(0, 0, 0, 0) <= 
                new Date().setHours(0, 0, 0, 0)
              )
            )}
            onEnroll={handleEnroll}
            isLoading={isLoading}
          />
        </div>

        <div>
          <FinishedCourses
            courses={courses.filter(course => 
              enrolledCourses.has(course.id) && 
              course.chapters.every(ch => ch.milestones.every(m => m.completed))
            )}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}