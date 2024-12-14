import React, { useState } from 'react';
import { LogIn, HelpCircle, UserPlus, Mail, Lock } from 'lucide-react';
import { LoginCredentials } from '../types/auth';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onForgotPassword: () => void;
  onAcceptInvitation: () => void;
  error?: string | null;
}

export default function LoginForm({ onLogin, onForgotPassword, onAcceptInvitation, error }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(credentials);
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
            Sign in to your account
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Access your certification program
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
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-t-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
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
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-b-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-center bg-red-50 p-3 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between space-x-4">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#ff751d] hover:text-[#e66b1a] transition-colors flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Forgot password?
            </button>
            <button
              type="button"
              onClick={onAcceptInvitation}
              className="text-sm text-[#ff751d] hover:text-[#e66b1a] transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Accept invitation
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ff751d] hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50 transition-colors shadow-lg shadow-orange-500/30"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-[#ff9b5c] group-hover:text-[#ffb285]" />
            </span>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}