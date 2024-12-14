import React from 'react';
import { X, Clock, BookOpen, Users, Award, Calendar, CheckCircle } from 'lucide-react';
import type { Course } from '../../types/course';
import type { User } from '../../types/auth';
import { formatDate } from '../../utils/date';
import { getStoredUsers, getUserCourseData } from '../../utils/storageUtils';

interface CourseDetailsModalProps {
  course: Course;
  onClose: () => void;
}

export default function CourseDetailsModal({ course, onClose }: CourseDetailsModalProps) {
  const users = getStoredUsers();
  const enrolledUsers = users.filter(user => {
    const userData = getUserCourseData(user.id);
    return Array.isArray(userData.enrolledCourses) && userData.enrolledCourses.includes(course.id);
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#ff751d] to-[#ffb285]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md">
                <img
                  src={course.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=ff751d&color=fff&size=96`}
                  alt={course.title}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)}h
                  </div>
                  <div className="text-sm text-gray-500">Total Duration</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {course.chapters.length}
                  </div>
                  <div className="text-sm text-gray-500">Chapters</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {course.enrolledCount}
                  </div>
                  <div className="text-sm text-gray-500">Enrolled Users</div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {course.certificateValidity.months}mo
                  </div>
                  <div className="text-sm text-gray-500">Certificate Validity</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Enrolled Users ({enrolledUsers.length})</h3>
              <div className="space-y-4">
                {enrolledUsers.length > 0 ? (
                  enrolledUsers.sort((a, b) => {
                    // Sort by completion status and progress
                    const aData = getUserCourseData(a.id);
                    const bData = getUserCourseData(b.id);
                    const aCompleted = course.chapters.every(ch => ch.milestones.every(m => m.completed));
                    const bCompleted = course.chapters.every(ch => ch.milestones.every(m => m.completed));
                    if (aCompleted !== bCompleted) return bCompleted ? 1 : -1;
                    return (bData.courseProgress?.[course.id]?.enrolledAt || '').localeCompare(
                      aData.courseProgress?.[course.id]?.enrolledAt || ''
                    );
                  }).map(user => {
                    const userData = getUserCourseData(user.id);
                    const completedMilestones = course.chapters.reduce((sum, ch) => 
                      sum + ch.milestones.filter(m => m.completed).length, 0);
                    const totalMilestones = course.chapters.reduce((sum, ch) => sum + ch.milestones.length, 0);
                    const progress = Math.round((completedMilestones / totalMilestones) * 100);
                    const isCompleted = completedMilestones === totalMilestones;
                    const enrolledDate = userData.courseProgress?.[course.id]?.enrolledAt;
                    const completedDate = userData.courseProgress?.[course.id]?.completedAt;

                    return (
                      <div key={user.id} className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                        isCompleted ? 'border-green-500' : 'border-[#ff751d]'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {isCompleted ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Completed</span>
                              </div>
                            ) : (
                              <div className="text-[#ff751d]">In Progress</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className={isCompleted ? 'text-green-600' : 'text-[#ff751d]'}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isCompleted ? 'bg-green-500' : 'bg-[#ff751d]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Enrolled: {enrolledDate ? formatDate(enrolledDate) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <BookOpen className="h-4 w-4" />
                            <span>{completedMilestones}/{totalMilestones} milestones</span>
                          </div>
                          {isCompleted && completedDate && (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>Completed: {formatDate(completedDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500">No users enrolled yet</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Course Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Course Status</h4>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${course.status === 'active' ? 'bg-green-100 text-green-800' : 
                      course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Start Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(course.startDate)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Certificate Details</h4>
                  <div className="mt-1 text-sm text-gray-900">
                    <p>Valid for {course.certificateValidity.months} months</p>
                    <p className="text-sm text-gray-500">
                      {course.certificateValidity.renewable ? 'Renewable' : 'Non-renewable'}
                      {course.certificateValidity.requiresAssessment && ', Requires Assessment'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Instructor</h4>
                  <div className="mt-2 flex items-center">
                    <img
                      src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=ff751d&color=fff`}
                      alt={course.instructor.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-900">{course.instructor.name}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Course Content</h3>
                <div className="space-y-4">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Chapter {index + 1}: {chapter.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{chapter.duration} minutes</span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{chapter.description}</p>
                      {chapter.milestones.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">
                            {chapter.milestones.length} {chapter.milestones.length === 1 ? 'milestone' : 'milestones'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}