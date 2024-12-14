import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} ProductFruits. All rights reserved.
        </div>
      </div>
    </footer>
  );
}