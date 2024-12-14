import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function ForgotPasswordForm({ onBack, onSuccess, onError }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      onSuccess('Password reset instructions have been sent to your email');
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
            Reset your password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="appearance-none rounded-lg relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff751d] focus:border-[#ff751d] focus:z-10 sm:text-sm transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ff751d] hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50 transition-colors shadow-lg shadow-orange-500/30"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
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
        </form>
      </div>
    </div>
  );
}