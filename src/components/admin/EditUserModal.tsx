import React, { useState } from 'react';
import { X, Mail, Shield, UserPlus, Building2, Phone, AtSign, User as UserIcon } from 'lucide-react';
import type { User } from '../../types/auth';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => Promise<void>;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    company: user.company,
    phone: user.phone,
    permissions: { ...user.permissions }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#ff751d] to-[#ffb285]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-12 w-12 text-[#ff751d] mx-auto" />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit User</h2>
            <p className="text-sm text-gray-500 mb-8">Update user information and permissions</p>

            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">User Information</h3>
                
                <div className="relative">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Details</h3>
                
                <div className="relative">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>

                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">Permissions</h3>
                <div className="space-y-4">
                  {Object.entries(formData.permissions || {}).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between group">
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            [key]: !value
                          }
                        }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:ring-offset-2 ${
                          value ? 'bg-[#ff751d]' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200 mt-8">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.firstName || !formData.lastName}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#ff751d] border border-transparent rounded-md hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}