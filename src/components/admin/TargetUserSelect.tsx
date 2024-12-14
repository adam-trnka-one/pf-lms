import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { User } from '../../types/auth';

interface TargetUserSelectProps {
  selectedUsers: string[];
  onChange: (userIds: string[]) => void;
  users: User[];
}

export default function TargetUserSelect({ selectedUsers, onChange, users }: TargetUserSelectProps) {
  const [showSelect, setShowSelect] = useState(false);
  const selectedUserObjects = users.filter(user => selectedUsers.includes(user.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Target Users</h4>
          <p className="text-xs text-gray-500">Leave empty to make course available to all users</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSelect(!showSelect)}
          className="flex items-center space-x-2 text-sm text-[#ff751d] hover:text-[#e66b1a]"
        >
          <UserPlus className="h-4 w-4" />
          <span>Select Users</span>
        </button>
      </div>

      {showSelect && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {users.map(user => (
              <label key={user.id} className="flex items-center justify-between group p-2 hover:bg-white rounded-lg cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={e => {
                      const isChecked = e.target.checked;
                      onChange(
                        isChecked
                          ? [...selectedUsers, user.id]
                          : selectedUsers.filter(id => id !== user.id)
                      );
                    }}
                    className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                  />
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedUserObjects.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500 mb-2">
            {selectedUserObjects.length} user{selectedUserObjects.length === 1 ? '' : 's'} selected
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUserObjects.map(user => (
              <div key={user.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-6 w-6 rounded-full"
                />
                <div className="text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}