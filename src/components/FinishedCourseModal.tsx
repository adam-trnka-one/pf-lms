import React from 'react';
import { X, Clock, BookOpen, Award, CheckCircle, Download, Lock, Linkedin } from 'lucide-react';
import type { Course } from '../types/course';
import type { User } from '../types/auth';
import { generateCertificate, isCertificationValid, shareOnLinkedIn } from '../utils/certificate';

interface FinishedCourseModalProps {
  course: Course;
  user: User;
  onClose: () => void;
}

export default function FinishedCourseModal({ course, user, onClose }: FinishedCourseModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative h-32 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 117, 29, 0.9), rgba(255, 178, 133, 0.9)), url(${course.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=ff751d&color=fff&size=400`})`
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="pt-8 pb-8 px-8">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">Duration</div>
                  <div className="text-sm text-gray-500">{Math.round(course.chapters.reduce((sum, ch) => sum + ch.duration, 0) / 60)}h planned</div>
                  <div className="text-sm text-gray-500">
                    {course.enrolledAt && course.completedAt && (() => {
                      const timeSpent = Math.round(
                        (new Date(course.completedAt).getTime() - new Date(course.enrolledAt).getTime()) / 
                        (1000 * 60 * 60)
                      );
                      const days = Math.floor(timeSpent / 24);
                      const hours = timeSpent % 24;
                      return `${days > 0 ? `${days}d ` : ''}${hours}h actual`;
                    })()}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">Content</div>
                  <div className="text-sm text-gray-500">{course.chapters.length} chapters</div>
                  <div className="text-sm text-gray-500">
                    {course.chapters.reduce((sum, ch) => sum + ch.milestones.length, 0)} milestones
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">Timeline</div>
                  <div className="text-sm text-gray-500">
                    Started: {new Date(course.enrolledAt || '').toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Finished: {new Date(course.completedAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">Certificate</div>
                  {(() => {
                    // Find the last completed milestone to determine completion date
                    const lastCompletedMilestone = course.chapters
                      .flatMap(ch => ch.milestones)
                      .filter(m => m.completed)
                      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

                    if (!lastCompletedMilestone?.completedAt) {
                      return <div className="text-sm text-red-600">Invalid completion date</div>;
                    }

                    const completionDate = new Date(lastCompletedMilestone.completedAt);
                    const validityEndDate = new Date(completionDate.getTime());
                    validityEndDate.setMonth(validityEndDate.getMonth() + course.certificateValidity.months);
                    const isValid = validityEndDate > new Date();
                    
                    return (
                      <>
                        <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {isValid ? 'Valid until' : 'Expired on'}: {validityEndDate.toLocaleDateString()}
                        </div>
                        <div className="mt-1">
                          <div className="flex items-center space-x-3">
                            {user.permissions.canDownloadCertificates && isCertificationValid(course) ? (
                              <>
                                <button
                                  onClick={() => generateCertificate(course)}
                                  className="inline-flex items-center space-x-1 text-sm text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>PDF</span>
                                </button>
                                <button
                                  onClick={() => shareOnLinkedIn(course)}
                                  className="inline-flex items-center space-x-1 text-sm text-[#0077b5] hover:text-[#005582] transition-colors"
                                >
                                  <Linkedin className="h-4 w-4" />
                                  <span>LinkedIn</span>
                                </button>
                              </>
                            ) : (
                              <div className="inline-flex items-center space-x-1 text-sm text-gray-400">
                                <Lock className="h-4 w-4" />
                                <span>
                                  {!user.permissions.canDownloadCertificates
                                    ? 'Downloads Disabled'
                                    : 'Certificate Expired'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {course.chapters.map((chapter, index) => (
                <div key={chapter.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Chapter {index + 1}: {chapter.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{chapter.duration} minutes</span>
                    </div>
                  </div>
                  {chapter.milestones.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {chapter.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center justify-between bg-white rounded p-3">
                          <div>
                            <div className="text-sm text-gray-700">{milestone.title}</div>
                            {milestone.completedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Completed on {new Date(milestone.completedAt).toLocaleDateString()} at {' '}
                                {new Date(milestone.completedAt).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-green-600">Completed</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}