import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Award, Clock, BookOpen, CheckCircle, Eye, Lock } from 'lucide-react';
import type { Course } from '../types/course';
import type { User } from '../types/auth';
import FinishedCourseModal from './FinishedCourseModal';

interface FinishedCoursesProps {
  courses: Course[];
  user: User;
}

export default function FinishedCourses({ courses, user }: FinishedCoursesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  if (courses.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-[#ff751d]" />
            <h2 className="text-xl font-semibold text-gray-900">Finished Courses</h2>
            <span className="text-sm text-gray-500">({courses.length})</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const completionDate = new Date(course.completedAt || '');
                const validityEndDate = new Date(completionDate);
                validityEndDate.setMonth(validityEndDate.getMonth() + course.certificateValidity.months);
                const isValid = validityEndDate > new Date();

                return (
                  <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={course.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=ff751d&color=fff&size=400`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          {user.permissions.canDownloadCertificates ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>{isValid ? 'Certificate Valid' : 'Certificate Expired'}</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              <span>Certificate Downloads Disabled</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)}h</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{course.chapters.length} chapters</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>{course.certificateValidity.months}mo</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=ff751d&color=fff`}
                            alt={course.instructor.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600">{course.instructor.name}</span>
                        </div>
                        
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#ff751d] text-white rounded-md hover:bg-[#e66b1a] transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedCourse && (
        <FinishedCourseModal
          course={selectedCourse}
          user={user}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
}