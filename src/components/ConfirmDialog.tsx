import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Unsaved Changes</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              You have unsaved changes. Are you sure you want to leave this page?
            </p>
          </div>
          <div className="flex justify-end space-x-3 px-4 py-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] border border-gray-300 rounded-md"
            >
              Stay
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#ff751d] text-white text-sm font-medium hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] rounded-md"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}