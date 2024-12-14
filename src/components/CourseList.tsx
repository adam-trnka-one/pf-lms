import React from 'react';
import { Clock, BookOpen, Award, Users } from 'lucide-react';
import type { Course } from '../types/course';

interface CourseListProps {
  courses: Course[];
  enrolledCourses: Set<string>;
  onEnroll: (courseId: string) => Promise<void>;
  onUnenroll: (courseId: string) => Promise<void>;
}

export default function CourseList({ courses, enrolledCourses, onEnroll, onUnenroll }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
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
                <Users className="h-4 w-4 mr-1" />
                <span>{course.enrolledCount} enrolled</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="group">
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[300px]">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-r border-b border-gray-200"></div>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)} hours</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>
                  {course.chapters.length} {course.chapters.length === 1 ? 'chapter' : 'chapters'} / {' '}
                  {course.chapters.reduce((sum, ch) => sum + ch.milestones.length, 0)} {' '}
                  {course.chapters.reduce((sum, ch) => sum + ch.milestones.length, 0) === 1 ? 'milestone' : 'milestones'}
                </span>
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
              
              {enrolledCourses.has(course.id) ? (
                <button
                  onClick={() => onUnenroll(course.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Unenroll
                </button>
              ) : (
                <button
                  onClick={() => onEnroll(course.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#ff751d] rounded-md hover:bg-[#e66b1a] transition-colors"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}