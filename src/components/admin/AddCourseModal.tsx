import React, { useState } from 'react';
import { X, BookOpen, Clock, Users, Layers, Image as ImageIcon, UserPlus } from 'lucide-react';
import type { CourseFormData, CourseChapter } from '../../types/course';
import type { User } from '../../types/auth';
import RichTextEditor from '../RichTextEditor';
import InstructorSelect from './InstructorSelect';
import TargetUserSelect from './TargetUserSelect';
import ChapterForm from './ChapterForm';
import { getStoredUsers, getAdminUsers } from '../../utils/storageUtils';

interface AddCourseModalProps {
  onClose: () => void;
  onAdd: (courseData: CourseFormData) => Promise<void>;
}

export default function AddCourseModal({ onClose, onAdd }: AddCourseModalProps) {
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    image: '',
    startDate: '',
    status: 'draft',
    duration: 0,
    chapters: [] as CourseChapter[],
    certificateValidity: {
      months: 12,
      renewable: false,
      requiresAssessment: false
    },
    instructor: {
      id: '',
      name: '',
      avatar: ''
    },
    targetUsers: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const users = getStoredUsers();
  const adminUsers = getAdminUsers();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAdd({
        ...formData,
        chapters: chapters
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChaptersChange = (newChapters: CourseChapter[]) => {
    setChapters(newChapters);
  };

  const handleClose = () => {
    if (formData.title || formData.description || formData.instructor.name || chapters.length > 0) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      {showConfirmClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Discard Changes?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to close? All changes will be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmClose}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative h-32 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 117, 29, 0.9), rgba(255, 178, 133, 0.9)), url(${formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title || 'New Course')}&background=ff751d&color=fff&size=400`})`
            }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="pt-8 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Add New Course</h2>
            <p className="text-sm text-gray-500 mb-8">Create a new certification course</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Course Information</h3>
                
                <div className="relative">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={value => setFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Enter course description..."
                    height={250}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Image
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Course preview"
                          className="h-32 w-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-32 w-48 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="mt-2">
                              <input
                                type="url"
                                placeholder="Enter image URL"
                                className="block w-40 text-sm text-gray-500 px-2 py-1 border rounded"
                                onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                    required
                  />
                </div>

                <div>
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-5 w-5 text-[#ff751d]" />
                        <span>Chapters</span>
                        <span className="text-sm text-gray-500 ml-2">
                          (Total duration: {chapters.reduce((sum, ch) => sum + ch.duration, 0)} minutes)
                        </span>
                      </div>
                    </h3>
                    <ChapterForm
                      chapters={chapters}
                      onChange={handleChaptersChange}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                 <InstructorSelect
                   value={formData.instructor.id}
                   onChange={(id, name) => setFormData(prev => ({
                     ...prev,
                     instructor: {
                       id,
                       name,
                       avatar: adminUsers.find(user => user.id === id)?.avatar
                     }
                   }))}
                   adminUsers={adminUsers}
                 />
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Certificate Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label htmlFor="validityMonths" className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Validity (months)
                      </label>
                      <input
                        type="number"
                        id="validityMonths"
                        min="1"
                        max="120"
                        value={formData.certificateValidity.months}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          certificateValidity: {
                            ...prev.certificateValidity,
                            months: parseInt(e.target.value)
                          }
                        }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff751d] focus:ring-[#ff751d] sm:text-sm h-11 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.certificateValidity.renewable}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            certificateValidity: {
                              ...prev.certificateValidity,
                              renewable: e.target.checked
                            }
                          }))}
                          className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                        />
                        <span className="text-sm text-gray-700">Renewable Certificate</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.certificateValidity.requiresAssessment}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            certificateValidity: {
                              ...prev.certificateValidity,
                              requiresAssessment: e.target.checked
                            }
                          }))}
                          className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                        />
                        <span className="text-sm text-gray-700">Requires Assessment for Renewal</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Course Access</h3>
                  <TargetUserSelect
                    selectedUsers={formData.targetUsers || []}
                    onChange={userIds => setFormData(prev => ({ ...prev, targetUsers: userIds }))}
                    users={users}
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200 mt-8">
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={e => setIsConfirmed(e.target.checked)}
                      className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that all the information provided is correct and I want to create this course
                    </span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.description || !formData.instructor.name || !isConfirmed}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#ff751d] border border-transparent rounded-md hover:bg-[#e66b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff751d] disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}