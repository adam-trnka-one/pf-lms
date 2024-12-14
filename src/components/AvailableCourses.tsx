import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CourseList from './CourseList';
import type { Course } from '../types/course';

interface AvailableCoursesProps {
  courses: Course[];
  onEnroll: (courseId: string) => Promise<void>;
  isLoading: boolean;
}

export default function AvailableCourses({ courses, onEnroll, isLoading }: AvailableCoursesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff751d] mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <CourseList
              courses={courses}
              enrolledCourses={new Set()}
              onEnroll={onEnroll}
              onUnenroll={() => {}}
            />
          ) : (
            <p className="text-center text-gray-500">No available courses at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
}