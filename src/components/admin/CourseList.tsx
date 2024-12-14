import React from 'react';
import { Clock, BookOpen, Users, Edit, Power, Copy, Eye } from 'lucide-react';
import type { Course } from '../../types/course';
import { formatDate } from '../../utils/date';

interface CourseListProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onDuplicateCourse: (courseId: string) => Promise<void>;
  onToggleStatus: (courseId: string) => Promise<void>;
}

export default function CourseList({ courses, onEditCourse, onViewDetails, onDuplicateCourse, onToggleStatus }: CourseListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Instructor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Certificate
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map(course => (
            <tr key={course.id}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={course.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=ff751d&color=fff&size=100`}
                      alt={course.title}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {course.description}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Starts: {new Date(course.startDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${course.status === 'active' ? 'bg-green-100 text-green-800' : 
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}
                >
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=ff751d&color=fff`}
                    alt={course.instructor.name}
                  />
                  <span className="ml-2 text-sm text-gray-900">{course.instructor.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)} hours</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                    <span>
                      {course.chapters.length} {course.chapters.length === 1 ? 'chapter' : 'chapters'} / {' '}
                      {course.chapters.reduce((sum, chapter) => sum + chapter.milestones.length, 0)} {' '}
                      {course.chapters.reduce((sum, chapter) => sum + chapter.milestones.length, 0) === 1 ? 'milestone' : 'milestones'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span>
                      {course.enrolledCount} {course.enrolledCount === 1 ? 'user' : 'users'} enrolled
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 space-y-1">
                  <div>Valid for: {course.certificateValidity.months} months</div>
                  <div className="text-xs text-gray-500">
                    {course.certificateValidity.renewable ? 'Renewable' : 'Non-renewable'}
                    {course.certificateValidity.requiresAssessment && ', Requires Assessment'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button
                  onClick={() => onViewDetails(course)}
                  className="text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditCourse(course)}
                  className="text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDuplicateCourse(course.id)}
                  className="text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onToggleStatus(course.id)}
                  className={`${
                    course.status === 'active' 
                      ? 'text-red-600 hover:text-red-900' 
                      : 'text-green-600 hover:text-green-900'
                  } transition-colors`}
                >
                  <Power className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}