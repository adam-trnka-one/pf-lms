import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleSection({
  title,
  icon,
  children,
  defaultExpanded = true
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          <span className="text-[#ff751d]">{icon}</span>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}