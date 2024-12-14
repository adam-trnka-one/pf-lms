import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User as UserIcon, Building2, Phone, AtSign } from 'lucide-react';
import { acceptInvitation } from '../utils/auth';

interface InvitationAcceptFormProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function InvitationAcceptForm({ onBack, onSuccess, onError }: InvitationAcceptFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    invitationCode: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      onError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      onError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await acceptInvitation(formData.email, formData.invitationCode, formData.password);
      onSuccess('Account activated successfully. You can now log in.');
      onBack();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div>
          <img
            src="https://productfruits.com/images/pf_logo.svg"
            alt="ProductFruits Logo"
            className="mx-auto h-16 w-auto mb-8"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Accept Invitation
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Enter your invitation details to activate your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="appearance-none rounded-t-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="invitationCode" className="sr-only">Invitation Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="invitationCode"
                  required
                  value={formData.invitationCode}
                  onChange={e => setFormData(prev => ({ ...prev, invitationCode: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Invitation Code"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Create Password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="appearance-none rounded-b-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center text-sm text-[#ff751d] hover:text-[#e66b1a] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ff751d] hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50 transition-colors shadow-lg shadow-orange-500/30"
          >
            {isLoading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}