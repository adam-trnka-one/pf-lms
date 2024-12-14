import React from 'react';
import { X, Bell, Check, Calendar, Award, BookOpen, ChevronRight, CheckCheck } from 'lucide-react';
import type { NotificationCenterProps, Notification } from '../types/notification';
import { formatRelativeTime } from '../utils/date';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}: NotificationCenterProps) {
  if (!isOpen) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'chapter_available':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'upcoming_chapter':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'expiring_certificate':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'incomplete_chapter':
        return <BookOpen className="h-5 w-5 text-red-500" />;
      case 'new_course_available':
        return <Bell className="h-5 w-5 text-green-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md">
        <div className="h-full bg-white shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-white bg-[#ff751d] rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center justify-between px-6 py-2 bg-gray-50">
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-[#ff751d] hover:text-[#e66b1a] flex items-center"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
            <button
              onClick={onClearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 116px)' }}>
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      notification.isRead ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="mt-2 inline-flex items-center text-sm text-[#ff751d] hover:text-[#e66b1a]"
                          >
                            View details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </a>
                        )}
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="flex-shrink-0 text-[#ff751d] hover:text-[#e66b1a]"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="h-12 w-12 mb-4 text-gray-400" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}