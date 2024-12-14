import React from 'react';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import type { ToastType } from '../components/Toast';

interface AdminDashboardProps {
  onToast: (message: string, type: ToastType) => void;
}

export default function AdminDashboard({ onToast }: AdminDashboardProps) {
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        
        <UserManagement
          onError={message => onToast(message, 'error')}
          onSuccess={message => onToast(message, 'success')}
        />
        
        <CourseManagement
          onError={message => onToast(message, 'error')}
          onSuccess={message => onToast(message, 'success')}
        />
      </div>
    </div>
  );
}