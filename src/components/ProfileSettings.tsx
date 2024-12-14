import React, { useState, useEffect } from 'react';
import { Camera, Save, Mail, Phone, Building2, AtSign, User as UserIcon, Briefcase, Linkedin, Instagram, Lock } from 'lucide-react';
import type { User } from '../types/auth';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import ConfirmDialog from './ConfirmDialog';
import { changePassword } from '../utils/auth';

interface ProfileSettingsProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileSettings({ user, onSave, onCancel }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    company: user.company || '',
    phone: user.phone || '',
    title: user.title || '',
    socialMedia: {
      linkedin: user.socialMedia?.linkedin || '',
      instagram: user.socialMedia?.instagram || ''
    },
    avatar: user.avatar || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [initialFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    company: user.company || '',
    phone: user.phone || '',
    socialMedia: {
      linkedin: user.socialMedia?.linkedin || '',
      instagram: user.socialMedia?.instagram || ''
    },
    avatar: user.avatar || ''
  });

  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showConfirmDialog,
    handleNavigate,
    handleConfirmNavigation,
    handleCancelNavigation
  } = useUnsavedChanges();

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setError(null);
      setHasUnsavedChanges(false);
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError((err as Error).message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="w-[75%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-[#ff751d] to-[#ffb285]">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <img
                src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&background=ff751d&color=fff`}
                alt={`${formData.firstName} ${formData.lastName}`}
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
      
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h2>
          <p className="text-sm text-gray-500 mb-8">Update your personal information and preferences</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
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
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">Social Media</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="linkedin"
                    placeholder="LinkedIn Profile URL"
                    value={formData.socialMedia.linkedin}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      socialMedia: {
                        ...prev.socialMedia,
                        linkedin: e.target.value
                      }
                    }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Instagram className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="instagram"
                    placeholder="Instagram Profile URL"
                    value={formData.socialMedia.instagram}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      socialMedia: {
                        ...prev.socialMedia,
                        instagram: e.target.value
                      }
                    }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Details</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    placeholder="Job Title"
                    value={formData.title || ''}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Security</h3>
                
                {showPasswordForm ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                        required
                      />
                    </div>

                    {passwordError && (
                      <div className="text-sm text-red-600">
                        {passwordError}
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordError(null);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handlePasswordSubmit}
                        disabled={isChangingPassword}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#ff751d] border border-transparent rounded-md hover:bg-[#e66b1a] disabled:opacity-50"
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center space-x-2 text-[#ff751d] hover:text-[#e66b1a]"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                )}
              </div>
            </div>
            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => hasUnsavedChanges ? handleNavigate(onCancel) : onCancel()}
                  className="mr-3 px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email}
                  className="flex items-center space-x-2 px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff751d] hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}