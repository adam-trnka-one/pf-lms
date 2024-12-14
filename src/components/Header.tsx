import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { User } from '../types/auth';
import NotificationCenter from './NotificationCenter';
import { useEffect, useState } from 'react';
import { getStoredNotifications, markAsRead, markAllAsRead, clearAllNotifications, generateNotifications } from '../utils/notifications';
import { getCourses } from '../utils/courseManagement';
import type { NavigationPage } from '../types/navigation';

interface HeaderProps {
  user: User;
  currentPage?: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function Header({ user, currentPage, onNavigate, onLogout, onProfileClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getStoredNotifications());

  useEffect(() => {
    const loadNotifications = async () => {
      const courses = await getCourses();
      generateNotifications(courses);
      setNotifications(getStoredNotifications());
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    setNotifications(getStoredNotifications());
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setNotifications(getStoredNotifications());
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="https://productfruits.com/images/pf_logo.svg" 
              alt="ProductFruits Logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'dashboard' ? 'text-[#ff751d] bg-gray-100' : 'text-gray-700 hover:text-[#ff751d] hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate?.('courses')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'courses' ? 'text-[#ff751d] bg-gray-100' : 'text-gray-700 hover:text-[#ff751d] hover:bg-gray-100'
              }`}
            >
              My Courses
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate?.('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'admin' ? 'text-[#ff751d] bg-gray-100' : 'text-gray-700 hover:text-[#ff751d] hover:bg-gray-100'
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-[#ff751d] hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block min-w-[20px] h-5 px-1.5 rounded-full bg-[#ff751d] text-white text-xs font-medium flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-500 hover:text-[#ff751d] hover:bg-gray-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-[#ff751d] hover:bg-gray-100 transition-colors sm:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
    <NotificationCenter
      isOpen={showNotifications}
      onClose={() => setShowNotifications(false)}
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onClearAll={handleClearAll}
    />
    </>
  );
}