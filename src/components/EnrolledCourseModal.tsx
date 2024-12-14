import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, Award, Users } from 'lucide-react';
import type { Course } from '../types/course';
import type { User } from '../types/auth';
import CollapsibleChapterList from './CollapsibleChapterList';

interface EnrolledCourseModalProps {
  course: Course;
  user: User;
  onClose: () => void;
  onUnenroll: (courseId: string) => Promise<void>;
  onMilestoneComplete?: (courseId: string, chapterId: string, milestoneId: string) => Promise<void>;
}

export default function EnrolledCourseModal({ 
  course, 
  user, 
  onClose, 
  onUnenroll,
  onMilestoneComplete 
}: EnrolledCourseModalProps) {
  const [currentCourse, setCurrentCourse] = useState(course);

  const totalMilestones = currentCourse.chapters.reduce((sum, chapter) => 
    sum + chapter.milestones.length, 0);
  const completedMilestones = currentCourse.chapters.reduce((sum, chapter) => 
    sum + chapter.milestones.filter(m => m.completed).length, 0);
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const handleMilestoneComplete = async (chapterId: string, milestoneId: string) => {
    if (!onMilestoneComplete) return;

    // Optimistically update UI
    setCurrentCourse(prev => ({
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

    try {
      await onMilestoneComplete(course.id, chapterId, milestoneId);
    } catch (err) {
      // Revert optimistic update on error
      setCurrentCourse(course);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative h-32 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 117, 29, 0.9), rgba(255, 178, 133, 0.9)), url(${course.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=ff751d&color=fff&size=400`})`
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">
                  {Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)}h
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm text-gray-600">
                  <div>{completedMilestones}/{totalMilestones}</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">{course.certificateValidity.months}mo</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">{course.enrolledCount}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Overall Progress</span>
                <span className="text-[#ff751d]">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff751d] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <CollapsibleChapterList 
                chapters={currentCourse.chapters}
                currentUser={user}
                onMilestoneComplete={handleMilestoneComplete}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    onUnenroll(course.id);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Unenroll from Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}