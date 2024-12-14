import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Video, CheckCircle, Circle, Lock, Calendar, CalendarPlus, Youtube, Play, FileText, Link } from 'lucide-react';
import type { CourseChapter } from '../types/course';
import type { User } from '../types/auth';
import QuestionaryForm from './QuestionaryForm';
import { downloadCalendarInvite } from '../utils/calendar';
import { sanitizeHtml, sanitizeUrl } from '../utils/sanitize';

interface CollapsibleChapterListProps {
  chapters: CourseChapter[];
  currentUser?: User;
  onMilestoneComplete?: (chapterId: string, milestoneId: string) => void;
}

export default function CollapsibleChapterList({ chapters, currentUser, onMilestoneComplete }: CollapsibleChapterListProps) {
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find the first available chapter with uncompleted milestones
    const firstAvailableChapter = [...chapters]
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .filter(chapter => {
        const chapterDate = new Date(chapter.startDate);
        chapterDate.setHours(0, 0, 0, 0);
        return chapterDate <= today && chapter.milestones.some(m => !m.completed);
      })
      .shift();

    return firstAvailableChapter ? { [firstAvailableChapter.id]: true } : {};
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="space-y-4">
      {chapters.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((chapter, index) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chapterDate = new Date(chapter.startDate);
        chapterDate.setHours(0, 0, 0, 0);
        const isAvailable = chapterDate <= today;

        return (
          <div key={chapter.id} className="bg-white rounded-lg shadow-md">
            <button
              onClick={() => isAvailable && toggleChapter(chapter.id)}
              className={`w-full px-6 py-4 flex items-center justify-between text-left ${
                isAvailable ? 'hover:bg-gray-50' : 'cursor-not-allowed'
              } transition-colors`}
            >
              <div className="flex items-center space-x-2">
                {!isAvailable ? (
                  <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : expandedChapters[chapter.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="font-medium text-gray-900">
                  Chapter {index + 1}: {chapter.title}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {chapter.milestones.every(m => m.completed) ? (
                    <span className="text-green-600">Completed</span>
                  ) : isAvailable ? (
                    <span className="text-green-600">Available now</span>
                  ) : (
                    <span className="text-gray-400">Available {new Date(chapter.startDate).toLocaleDateString()}</span>
                  )}
                </span>
              </div>
            </button>

          {isAvailable && expandedChapters[chapter.id] && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(chapter.startDate).toLocaleDateString()} at {chapter.startTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{chapter.duration} minutes</span>
                  </div>
                  {!chapter.milestones.every(m => m.completed) && (
                    <button
                      onClick={() => downloadCalendarInvite(
                        chapter.title,
                        chapter.description,
                        chapter.startDate,
                        chapter.startTime,
                        chapter.duration,
                        chapter.meeting?.url
                      )}
                      className="flex items-center space-x-1 text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      <span>Add to Calendar</span>
                    </button>
                  )}
                </div>
                {chapter.meeting && isAvailable && (
                  <div className="flex space-x-4">
                    <a
                      href={chapter.meeting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[#ff751d] hover:text-[#e66b1a]"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join {chapter.meeting.type}</span>
                    </a>
                  </div>
                )}
              </div>

              {chapter.video && isAvailable && (
                <div className="mb-4">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                    {chapter.video.type === 'youtube' ? (
                      <iframe
                        src={sanitizeUrl(`https://www.youtube.com/embed/${chapter.video.url.split('v=')[1]}`)}
                        title={`${chapter.title} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : chapter.video.type === 'vimeo' ? (
                      <iframe
                        src={sanitizeUrl(`https://player.vimeo.com/video/${chapter.video.url.split('/').pop()}`)}
                        title={`${chapter.title} video`}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <iframe
                        src={sanitizeUrl(chapter.video.url)}
                        title={`${chapter.title} video`}
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    )}
                  </div>
                </div>
              )}

              {(chapter.documentationUrl || chapter.documents?.length > 0) && (
                <div className="mt-4 space-y-2">
                  {chapter.documentationUrl && (
                    <a
                      href={sanitizeUrl(chapter.documentationUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-[#ff751d] hover:text-[#e66b1a] transition-colors"
                    >
                      <Link className="h-4 w-4" />
                      <span>View Documentation</span>
                    </a>
                  )}
                  
                  {chapter.documents?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {chapter.documents.map(doc => (
                          <a
                            key={doc.id}
                            href={sanitizeUrl(doc.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-900 truncate">{doc.name}</div>
                              <div className="text-xs text-gray-500">{doc.type}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div 
                className="mb-4 prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(chapter.description) }}
              />

              {chapter.milestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Milestones ({chapter.milestones.length})
                  </h4>
                  {chapter.milestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div>
                        <h5 className="font-medium text-gray-800">{milestone.title}</h5>
                        <div 
                          className="text-sm text-gray-600 prose prose-sm max-w-none" 
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(milestone.description) }}
                        />
                        {milestone.type === 'questionary' && !milestone.completed && (
                          <QuestionaryForm
                            milestone={milestone}
                            onComplete={() => onMilestoneComplete?.(chapter.id, milestone.id)}
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {milestone.completed ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm">
                              Completed {milestone.completedAt && 
                                `on ${new Date(milestone.completedAt).toLocaleDateString()}`}
                            </span>
                          </div>
                        ) : milestone.enabled && onMilestoneComplete && isAvailable && 
                            (!milestone.adminOnly || (currentUser?.role === 'admin')) ? (
                          <button
                            onClick={() => onMilestoneComplete(chapter.id, milestone.id)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm
                              ${milestone.adminOnly ? 
                                'bg-purple-500 hover:bg-purple-600' : 
                                'bg-[#ff751d] hover:bg-[#e66b1a]'} 
                              text-white transition-colors`}
                          >
                            <Circle className="h-4 w-4" />
                            <span>
                              {milestone.adminOnly ? 'Complete (Admin)' : 'Complete'}
                              {milestone.type === 'text' && ' (Click to mark as completed)'}
                            </span>
                          </button>
                        ) : (
                          <span className={`px-3 py-1 text-sm rounded-full 
                            ${milestone.adminOnly ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                            {!milestone.enabled ? 'Disabled' : 
                             milestone.adminOnly && currentUser?.role !== 'admin' ? 'Admin only' : 
                             'Not completed'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}