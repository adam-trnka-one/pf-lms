import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Users, Activity, GraduationCap } from 'lucide-react';
import { Course, CourseFormData } from '../../types/course';
import { getCourses, toggleCourseStatus, createCourse, updateCourse, cloneCourse, deleteCourse } from '../../utils/courseManagement';
import CourseList from './CourseList';
import CollapsibleSection from './CollapsibleSection';
import CourseDetailsModal from './CourseDetailsModal';
import AddCourseModal from './AddCourseModal';
import EditCourseModal from './EditCourseModal';

interface CourseManagementProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export default function CourseManagement({ onError, onSuccess }: CourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleDuplicateCourse = async (courseId: string) => {
    try {
      const newCourse = await cloneCourse(courseId);
      setCourses(prev => [...prev, newCourse]);
      onSuccess('Course duplicated successfully');
    } catch (err) {
      onError('Failed to duplicate course');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const loadedCourses = await getCourses();
      setCourses(loadedCourses);
    } catch (err) {
      onError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCourseStatus = async (courseId: string) => {
    try {
      const updatedCourse = await toggleCourseStatus(courseId);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
      onSuccess(`Course ${updatedCourse.status === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      onError('Failed to update course status');
    }
  };

  const handleAddCourse = async (courseData: CourseFormData) => {
    try {
      const newCourse = await createCourse(courseData);
      if (newCourse) {
        setCourses(prev => [...prev, newCourse]);
        onSuccess('Course created successfully');
      }
    } catch (err) {
      onError('Failed to create course');
    }
  };

  const handleEditCourse = async (courseId: string, updates: Partial<CourseFormData>) => {
    try {
      const updatedCourse = await updateCourse(courseId, updates);
      if (updatedCourse) {
        setCourses(prev => prev.map(course => course.id === courseId ? updatedCourse : course));
        onSuccess('Course updated successfully');
      }
    } catch (err) {
      onError('Failed to update course');
    }
  };

  const activeCourses = courses.filter(course => course.status === 'active');
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolledCount, 0);

  return (
    <CollapsibleSection
      title="Course Management"
      icon={<GraduationCap className="h-6 w-6" />}
    >
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-[16%]">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full h-full min-h-[88px] flex items-center justify-center space-x-2 px-4 bg-[#ff751d] text-white rounded-lg hover:bg-[#e66b1a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </button>
        </div>
        <div className="w-[26%] bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-[#ff751d] mb-2">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-medium">Total Courses</h3>
          </div>
          <p className="text-2xl font-semibold">{courses.length}</p>
        </div>
        <div className="w-[26%] bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Activity className="h-5 w-5" />
            <h3 className="font-medium">Active Courses</h3>
          </div>
          <p className="text-2xl font-semibold">{activeCourses.length}</p>
        </div>
        <div className="w-[26%] bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Total Enrolled</h3>
          </div>
          <p className="text-2xl font-semibold">{totalEnrolled}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff751d] mx-auto"></div>
        </div>
      ) : (
        <CourseList
          courses={courses}
          onViewDetails={setSelectedCourse}
          onEditCourse={setEditingCourse}
          onDuplicateCourse={handleDuplicateCourse}
          onToggleStatus={handleToggleCourseStatus}
        />
      )}

      {showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCourse}
        />
      )}

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleEditCourse}
        />
      )}

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </CollapsibleSection>
  );
}