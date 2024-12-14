import React from 'react';
import { Award, BookOpen, Clock, CheckCircle, UserPlus, LogOut, Calendar } from 'lucide-react';
import type { User } from '../types/auth';
import { getCourses, updateCourse } from '../utils/courseManagement';
import { useState, useEffect, useCallback } from 'react';
import type { Course } from '../types/course';
import { isCertificationValid } from '../utils/certificate';
import { getStoredActivities } from '../utils/activity';
import ActivityModal from '../components/ActivityModal';
import type { Activity } from '../types/activity';
import { formatActivityMessage } from '../utils/activity';
import { formatRelativeTime } from '../utils/date';
import { downloadCalendarInvite } from '../utils/calendar';
import EnrolledCourseModal from '../components/EnrolledCourseModal';
import type { CourseChapter } from '../types/course';

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const getActiveCourseCount = () => {
    return enrolledCourses.filter(course => 
      course.enrolledAt && 
      course.status === 'active' && 
      !course.completedAt &&
      course.chapters.some(chapter => chapter.milestones.some(m => !m.completed))
    ).length;
  };

  const getValidCertificationsCount = () => {
    return enrolledCourses.filter(course => 
      course.chapters.every(ch => ch.milestones.every(m => m.completed)) && // Must be completed
      isCertificationValid(course) && // Certificate must be valid
      user?.permissions.canDownloadCertificates // User must have permission
    ).length;
  };

  const getUpcomingChapters = (): Array<{ course: Course; chapter: CourseChapter }> => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = enrolledCourses
      .filter(course => 
        course.enrolledAt && // Only show chapters from enrolled courses
        !course.completedAt && // Don't show chapters from completed courses
        course.status === 'active'
      )
      .flatMap(course => 
        course.chapters
          .filter(chapter => {
            const chapterDate = new Date(chapter.startDate);
            chapterDate.setHours(0, 0, 0, 0);
            const hasUncompletedMilestones = chapter.milestones.some(m => !m.completed);
            return (
              chapterDate >= now && // Show future chapters
              hasUncompletedMilestones // Only show chapters with incomplete milestones
            );
          })
          .map(chapter => ({ course, chapter }))
      )
      .sort((a, b) => {
        const dateA = new Date(`${a.chapter.startDate}T${a.chapter.startTime}`);
        const dateB = new Date(`${b.chapter.startDate}T${b.chapter.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });

    return upcoming;
  };

  const isWithinNextTwoDays = (dateString: string, timeString: string): boolean => {
    const date = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    return date <= twoDaysFromNow;
  };

  const calculateTotalStudyTime = () => {
    return enrolledCourses.reduce((total, course) => {
      // Only count chapters where all milestones are completed
      const completedChaptersDuration = course.chapters.reduce((sum, chapter) => {
        if (chapter.milestones.every(m => m.completed)) {
          return sum + chapter.duration;
        }
        return sum;
      }, 0);
      return total + completedChaptersDuration;
    }, 0);
  };

  useEffect(() => {
    loadCourses();
    setActivities(getStoredActivities());
  }, []);

  const loadCourses = async () => {
    try {
      const loadedCourses = await getCourses();
      setAllCourses(loadedCourses);
      // Get all enrolled courses, including completed ones for statistics
      setEnrolledCourses(loadedCourses.filter(course => course.enrolledAt));
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMilestoneComplete = async (courseId: string, chapterId: string, milestoneId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;
    
    try {
      // Optimistically update UI
      setSelectedCourse(prev => prev && ({
        ...prev,
        chapters: prev.chapters.map(chapter => {
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
      }));

      // Update the course chapters
      if (!course) return;

      const updatedChapters = course.chapters.map(chapter => {
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
      });

      await updateCourse(courseId, { chapters: updatedChapters });
      loadCourses(); // Refresh data
    } catch (err) {
      console.error('Failed to complete milestone');
      // Revert optimistic update
      setSelectedCourse(course);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleCourseClick = useCallback((courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  }, [allCourses]);

  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome back, {user.firstName}!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-[#ff751d] mr-2" />
                <h3 className="text-lg font-semibold">Current Courses</h3>
              </div>
              <span className="text-2xl font-bold text-[#ff751d]">
                {isLoading ? '-' : getActiveCourseCount()}
              </span>
            </div>
            <p className="text-sm text-gray-600">Ongoing enrolled courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-[#ff751d] mr-2" />
                <h3 className="text-lg font-semibold">Certifications</h3>
              </div>
              <span className="text-2xl font-bold text-[#ff751d]">
                {isLoading ? '-' : getValidCertificationsCount()}
              </span>
            </div>
            <p className="text-sm text-gray-600">Valid certifications</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-[#ff751d] mr-2" />
                <h3 className="text-lg font-semibold">Study Time</h3>
              </div>
              <span className="text-2xl font-bold text-[#ff751d]">
                {isLoading ? '-' : `${Math.round(calculateTotalStudyTime() / 60)}h`}
              </span>
            </div>
            <p className="text-sm text-gray-600">Completed learning hours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activities.slice(0, 10).map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {(() => {
                    switch (activity.type) {
                      case 'enrollment':
                        return <UserPlus className="h-5 w-5 text-green-500 mt-0.5" />;
                      case 'unenrollment':
                        return <LogOut className="h-5 w-5 text-red-500 mt-0.5" />;
                      case 'milestone_completion':
                        return <CheckCircle className="h-5 w-5 text-[#ff751d] mt-0.5" />;
                      case 'chapter_completion':
                        return <BookOpen className="h-5 w-5 text-[#ff751d] mt-0.5" />;
                      case 'course_completion':
                        return <Award className="h-5 w-5 text-[#ff751d] mt-0.5" />;
                    }
                  })()}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {(() => {
                        const message = formatActivityMessage(activity);
                        if (activity.courseId && activity.courseName) {
                          const beforeCourseName = message.split('"')[0];
                          const afterCourseName = message.split('"')[2] || '';
                          return (
                            <>
                              {beforeCourseName}"
                              <button
                                onClick={() => handleCourseClick(activity.courseId)}
                                className="text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                              >
                                {activity.courseName}
                              </button>
                              "{afterCourseName}
                            </>
                          );
                        }
                        return message;
                      })()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {activities.length > 10 && (
                <button
                  onClick={() => setShowAllActivities(true)}
                  className="w-full text-center text-sm text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                >
                  View All Activity
                </button>
              )}
              {activities.length === 0 && 
                <p className="text-center text-gray-500">No recent activity</p>
              }
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            {getUpcomingChapters().length > 0 ? (
              <div className="space-y-4">
                {getUpcomingChapters().map(({ course, chapter }) => {
                  const isUrgent = isWithinNextTwoDays(chapter.startDate, chapter.startTime);
                  const sessionDate = new Date(`${chapter.startDate}T${chapter.startTime}`);

                  return (
                    <div
                      key={chapter.id}
                      className={`border-l-4 ${
                        isUrgent ? 'border-[#ff751d]' : 'border-gray-200'
                      } pl-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <button
                            onClick={() => handleCourseClick(course.id)}
                            className="text-sm font-medium text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                          >
                            {course.title}
                          </button>
                          <p className="text-sm text-gray-700">
                            {chapter.title}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            <div>
                              {sessionDate.toLocaleDateString()} at {chapter.startTime}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadCalendarInvite(
                            chapter.title,
                            chapter.description,
                            chapter.startDate,
                            chapter.startTime,
                            chapter.duration,
                            chapter.meeting?.url
                          )}
                          className={`flex items-center space-x-1 text-sm ${
                            isUrgent 
                              ? 'text-[#ff751d] hover:text-[#e66b1a]' 
                              : 'text-gray-500 hover:text-gray-700'
                          } transition-colors`}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Add to Calendar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">No upcoming sessions</p>
            )}
          </div>
        </div>
      </div>

      <ActivityModal
        isOpen={showAllActivities}
        onClose={() => setShowAllActivities(false)}
        activities={activities}
      />
      {selectedCourse && (
        <EnrolledCourseModal
          course={selectedCourse}
          user={user}
          onClose={() => setSelectedCourse(null)}
          onUnenroll={() => {}}
          onMilestoneComplete={handleMilestoneComplete}
        />
      )}
    </div>
  );
}