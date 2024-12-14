import React, { useState } from 'react';
import { Clock, BookOpen, Award, Users, Eye } from 'lucide-react';
import CollapsibleChapterList from './CollapsibleChapterList';
import type { Course } from '../types/course';
import type { User } from '../types/auth';
import EnrolledCourseModal from './EnrolledCourseModal';

interface EnrolledCoursesProps {
  courses: Course[];
  user: User;
  onUnenroll: (courseId: string) => Promise<void>;
  onMilestoneComplete?: (courseId: string, chapterId: string, milestoneId: string) => Promise<void>;
}

export default function EnrolledCourses({ courses, user, onUnenroll, onMilestoneComplete }: EnrolledCoursesProps) {  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
        <p className="text-sm text-gray-400">Browse available courses below to start your learning journey.</p>
      </div>
    );
  }

  return (
    <>
    <div className={`grid grid-cols-1 ${courses.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
      {courses.map(course => {
        const totalMilestones = course.chapters.reduce((sum, chapter) => 
          sum + chapter.milestones.length, 0);
        const completedMilestones = course.chapters.reduce((sum, chapter) => 
          sum + chapter.milestones.filter(m => m.completed).length, 0);
        const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

        return (
          <div key={course.id} className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                <img
                  src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=ff751d&color=fff`}
                  alt={course.instructor.name}
                  className="h-10 w-10 rounded-full"
                />
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-[#ff751d]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#ff751d] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)}h</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{completedMilestones}/{totalMilestones}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{course.certificateValidity.months}mo</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => onUnenroll(course.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Unenroll
                </button>
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#ff751d] text-white rounded-md hover:bg-[#e66b1a] transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {selectedCourse && (
      <EnrolledCourseModal
        course={selectedCourse}
        user={user}
        onClose={() => setSelectedCourse(null)}
        onUnenroll={onUnenroll}
        onMilestoneComplete={onMilestoneComplete}
      />
    )}
    </>
  );
}