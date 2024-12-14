import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Shield, User as UserIcon, Edit, Power, Eye, Link, Key } from 'lucide-react';
import type { User } from '../../types/auth';
import UserStatsModal from './UserStatsModal';
import { getInvitationLink } from '../../utils/invitationUtils';
import { getStoredUser } from '../../utils/auth';
import { getStoredCourses, getUserCourseData } from '../../utils/storageUtils';
import { formatDate } from '../../utils/date';

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onUpdatePermissions: (userId: string, permissions: Partial<User['permissions']>) => Promise<void>;
  onToggleStatus: (userId: string, currentStatus: User['status']) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
}

export default function UserList({ users, onEditUser, onUpdatePermissions, onToggleStatus, onResetPassword }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentUser = getStoredUser();

  return (
    <>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Progress
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permissions
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => {
            const userData = getUserCourseData(user.id);
            const enrolledCourses = userData.enrolledCourses || [];
            const courses = getStoredCourses();
            const userCourses = courses.filter(course => enrolledCourses.includes(course.id));
            const completedCourses = userCourses.filter(course => 
              course.chapters.every(ch => ch.milestones.every(m => m.completed))
            );
            const totalTimeSpent = userCourses.reduce((total, course) => {
              const completedChaptersDuration = course.chapters
                .filter(chapter => chapter.milestones.every(m => m.completed))
                .reduce((sum, chapter) => sum + chapter.duration, 0);
              return total + completedChaptersDuration;
            }, 0);

            return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'invited' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                  {user.status === 'invited' && user.invitationCode && (
                    <div className="mt-1">
                      <button
                        onClick={async () => {
                          const link = getInvitationLink(user.email, user.invitationCode || '');
                          await navigator.clipboard.writeText(link);
                          alert('Invitation link copied to clipboard!');
                        }}
                        className="inline-flex items-center text-xs text-[#ff751d] hover:text-[#e66b1a]"
                      >
                        <Link className="h-3 w-3 mr-1" />
                        Copy Invitation Link
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-[#ff751d] mr-1" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="text-sm text-gray-500">{enrolledCourses.length} courses enrolled</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    {Object.entries(user.permissions || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdatePermissions(user.id, { [key]: !value })}
                          className="text-sm text-gray-600 hover:text-[#ff751d] transition-colors"
                        >
                          {value ? (
                            <ToggleRight className="h-4 w-4 text-[#ff751d]" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                        <span className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => onResetPassword(user.id)}
                      className="text-[#ff751d] hover:text-[#e66b1a]"
                      title="Reset Password"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEditUser(user)}
                    className="text-[#ff751d] hover:text-[#e66b1a]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(user.id, user.status)}
                    disabled={user.role === 'admin' && user.id === currentUser?.id || user.role === 'admin'}
                    className={`${
                      user.status === 'active' 
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {selectedUser && (
      <UserStatsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    )}
    </>
  );
}