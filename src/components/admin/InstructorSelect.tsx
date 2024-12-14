import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { User } from '../../types/auth';

interface InstructorSelectProps {
  value: string;
  onChange: (instructorId: string, instructorName: string) => void;
  adminUsers: User[];
}

export default function InstructorSelect({ value, onChange, adminUsers }: InstructorSelectProps) {
  const [showSelect, setShowSelect] = useState(false);
  const selectedUser = adminUsers.find(user => user.id === value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Course Instructor</h4>
          <p className="text-xs text-gray-500">Select an administrator to be the course instructor</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSelect(!showSelect)}
          className="flex items-center space-x-2 text-sm text-[#ff751d] hover:text-[#e66b1a]"
        >
          <Users className="h-4 w-4" />
          <span>Select Instructor</span>
        </button>
      </div>

      {showSelect && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {adminUsers.map(user => (
              <label key={user.id} className="flex items-center justify-between group p-2 hover:bg-white rounded-lg cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={value === user.id}
                    onChange={() => onChange(user.id, `${user.firstName} ${user.lastName}`)}
                    className="rounded-full border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
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

      {selectedUser && (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
          <img
            src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.firstName + ' ' + selectedUser.lastName)}&background=ff751d&color=fff`}
            alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {selectedUser.firstName} {selectedUser.lastName}
            </div>
            <div className="text-xs text-gray-500">{selectedUser.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}