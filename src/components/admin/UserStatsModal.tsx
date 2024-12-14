import React from 'react';
import { X, Clock, BookOpen, Award, Calendar, CheckCircle, GraduationCap, Timer } from 'lucide-react';
import type { User } from '../../types/auth';
import { getStoredCourses, getUserCourseData } from '../../utils/storageUtils';
import { formatDate } from '../../utils/date';
import { isCertificationValid } from '../../utils/certificate';

interface UserStatsModalProps {
  user: User;
  onClose: () => void;
}

export default function UserStatsModal({ user, onClose }: UserStatsModalProps) {
  const userData = getUserCourseData(user.id);
  const enrolledCourses = userData.enrolledCourses || [];
  const courses = getStoredCourses();
  const userCourses = courses.filter(course => enrolledCourses.includes(course.id));
  
  const completedCourses = userCourses.filter(course => 
    course.chapters.every(ch => ch.milestones.every(m => m.completed))
  );

  const validCertifications = completedCourses.filter(course => 
    isCertificationValid(course) && user.permissions.canDownloadCertificates
  );

  const totalTimeSpent = userCourses.reduce((total, course) => {
    const completedChaptersDuration = course.chapters
      .filter(chapter => chapter.milestones.every(m => m.completed))
      .reduce((sum, chapter) => sum + chapter.duration, 0);
    return total + completedChaptersDuration;
  }, 0);

  const totalMilestones = userCourses.reduce((sum, course) => 
    sum + course.chapters.reduce((chSum, ch) => chSum + ch.milestones.length, 0), 0);
  
  const completedMilestones = userCourses.reduce((sum, course) => 
    sum + course.chapters.reduce((chSum, ch) => 
      chSum + ch.milestones.filter(m => m.completed).length, 0), 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative h-32 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 117, 29, 0.9), rgba(255, 178, 133, 0.9)), url(${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff&size=400`})`
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="pt-8 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{userCourses.length}</div>
                  <div className="text-sm text-gray-500">Enrolled Courses</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{validCertifications.length}</div>
                  <div className="text-sm text-gray-500">Valid Certifications</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Timer className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{Math.round(totalTimeSpent / 60)}</div>
                  <div className="text-sm text-gray-500">Hours Spent</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round((completedMilestones / totalMilestones) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Overall Progress</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Course Progress</h3>
              
              {userCourses.sort((a, b) => {
                const aCompleted = a.chapters.every(ch => ch.milestones.every(m => m.completed));
                const bCompleted = b.chapters.every(ch => ch.milestones.every(m => m.completed));
                if (aCompleted !== bCompleted) return bCompleted ? 1 : -1;
                return new Date(b.enrolledAt || 0).getTime() - new Date(a.enrolledAt || 0).getTime();
              }).map(course => {
                const courseCompletedMilestones = course.chapters.reduce((sum, ch) => 
                  sum + ch.milestones.filter(m => m.completed).length, 0);
                const courseTotalMilestones = course.chapters.reduce((sum, ch) => 
                  sum + ch.milestones.length, 0);
                const courseProgress = Math.round((courseCompletedMilestones / courseTotalMilestones) * 100);
                const isCompleted = courseCompletedMilestones === courseTotalMilestones;
                const enrolledDate = userData.courseProgress?.[course.id]?.enrolledAt;
                
                return (
                  <div key={course.id} className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                    isCompleted ? 'border-green-500' : 'border-[#ff751d]'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                          {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-500">{course.description}</p>
                      </div>
                      <div className="text-sm">
                        {isCompleted ? (
                          <div className="flex items-center text-green-600">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <div className="text-[#ff751d]">In Progress</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className={isCompleted ? 'text-green-600' : 'text-[#ff751d]'}>
                          {courseProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-[#ff751d]'
                          }`}
                          style={{ width: `${courseProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Enrolled: {enrolledDate ? formatDate(enrolledDate) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        <span>{courseCompletedMilestones}/{courseTotalMilestones} milestones</span>
                      </div>
                      {isCompleted && course.completedAt && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Completed: {formatDate(course.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}