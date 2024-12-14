import React from 'react';
import { X, Award, BookOpen, CheckCircle, LogOut, UserPlus } from 'lucide-react';
import { Activity } from '../types/activity';
import { formatActivityMessage } from '../utils/activity';
import { formatRelativeTime } from '../utils/date';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

export default function ActivityModal({ isOpen, onClose, activities }: ActivityModalProps) {
  if (!isOpen) return null;

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'enrollment':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'unenrollment':
        return <LogOut className="h-5 w-5 text-red-500" />;
      case 'milestone_completion':
        return <CheckCircle className="h-5 w-5 text-[#ff751d]" />;
      case 'chapter_completion':
        return <BookOpen className="h-5 w-5 text-[#ff751d]" />;
      case 'course_completion':
        return <Award className="h-5 w-5 text-[#ff751d]" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Activity History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formatActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No activity history yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}