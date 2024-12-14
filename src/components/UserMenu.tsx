import React, { useState, useRef, useEffect } from 'react';
import { Settings, User as UserIcon, Shield, LogOut } from 'lucide-react';
import { User } from '../types/auth';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function UserMenu({ user, onLogout, onProfileClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-gray-50 rounded-full py-1 px-2 transition-colors"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ff751d&color=fff`}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onProfileClick();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              role="menuitem"
            >
              <UserIcon className="mr-3 h-4 w-4 text-gray-500" />
              Profile
            </a>
            
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              role="menuitem"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              Settings
            </a>

            {user.role === 'admin' && (
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                role="menuitem"
              >
                <Shield className="mr-3 h-4 w-4 text-gray-500" />
                Admin Settings
              </a>
            )}

            <div className="border-t border-gray-100">
              <button
                onClick={onLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}