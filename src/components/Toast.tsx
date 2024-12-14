import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />
};

const backgrounds = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  warning: 'bg-yellow-50'
};

const borders = {
  success: 'border-green-200',
  error: 'border-red-200',
  warning: 'border-yellow-200'
};

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 flex items-center p-4 rounded-lg border ${backgrounds[type]} ${borders[type]} shadow-lg max-w-md animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 mr-8 text-sm font-medium text-gray-800">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-current animate-progress" style={{
        width: '100%',
        backgroundColor: type === 'success' ? '#34D399' : type === 'error' ? '#F87171' : '#FBBF24',
        animation: `progress ${duration}ms linear`
      }} />
    </div>
  );
}