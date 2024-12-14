import React, { useState, useEffect } from 'react';
import { Clock, Video, Plus, Trash2, ChevronDown, ChevronUp, Youtube, Play, FileText, Link, X } from 'lucide-react';
import type { CourseChapter, ChapterMilestone, ChapterMeeting } from '../../types/course';
import RichTextEditor from '../RichTextEditor';
import { sanitizeFileName, sanitizeUrl } from '../../utils/sanitize';

interface ChapterFormProps {
  chapters: CourseChapter[];
  onChange: (chapters: CourseChapter[]) => void;
}

interface ChapterState {
  [key: string]: boolean;
}

export default function ChapterForm({ chapters, onChange }: ChapterFormProps) {
  const [expandedChapters, setExpandedChapters] = useState<ChapterState>({});
  const [localChapters, setLocalChapters] = useState<CourseChapter[]>(chapters);

  // Update local chapters when props change
  useEffect(() => {
    setLocalChapters(chapters);
  }, [chapters]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };
  
  const addChapter = () => {
    const newChapter: CourseChapter = {
      id: crypto.randomUUID(),
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      title: `Chapter ${chapters.length + 1}`,
      description: '',
      duration: 60,
      milestones: [{
        id: crypto.randomUUID(),
        title: 'Complete Chapter Content',
        description: 'Review and understand all chapter materials',
        enabled: true,
        type: 'text',
        adminOnly: false,
        completed: false
      }],
      order: chapters.length
    };
    setLocalChapters(prev => [...prev, newChapter]);
  };

  const updateChapter = (index: number, updates: Partial<CourseChapter>) => {
    const updatedChapters = localChapters.map((chapter, i) =>
      i === index ? { ...chapter, ...updates } : chapter
    );
    setLocalChapters(updatedChapters);
  };

  const removeChapter = (index: number) => {
    const updatedChapters = localChapters.filter((_, i) => i !== index);
    setLocalChapters(updatedChapters);
  };
  
  const reorderChapter = (fromIndex: number, toIndex: number) => {
    const updatedChapters = [...localChapters];
    updatedChapters.splice(toIndex, 0, updatedChapters.splice(fromIndex, 1)[0]);
    const reorderedChapters = updatedChapters.map((chapter, index) => ({ 
      ...chapter, 
      order: index 
    }));
    setLocalChapters(reorderedChapters);
  };

  const addMilestone = (chapterIndex: number) => {
    const newMilestone: ChapterMilestone = {
      id: crypto.randomUUID(),
      title: `Milestone ${chapters[chapterIndex].milestones.length + 1}`,
      description: '',
      enabled: true,
      type: 'text',
      adminOnly: false,
      completed: false
    };
    const updatedChapters = [...localChapters];
    updatedChapters[chapterIndex] = {
      ...updatedChapters[chapterIndex],
      milestones: [...updatedChapters[chapterIndex].milestones, newMilestone]
    };
    setLocalChapters(updatedChapters);
  };

  const updateMilestone = (
    chapterIndex: number,
    milestoneIndex: number,
    updates: Partial<ChapterMilestone>
  ) => {
    const updatedMilestones = localChapters[chapterIndex].milestones.map((milestone, i) =>
      i === milestoneIndex ? { ...milestone, ...updates } : milestone
    );
    const updatedChapters = [...localChapters];
    updatedChapters[chapterIndex].milestones = updatedMilestones;
    setLocalChapters(updatedChapters);
  };

  const removeMilestone = (chapterIndex: number, milestoneIndex: number) => {
    const updatedMilestones = localChapters[chapterIndex].milestones.filter(
      (_, i) => i !== milestoneIndex
    );
    const updatedChapters = [...localChapters];
    updatedChapters[chapterIndex].milestones = updatedMilestones;
    setLocalChapters(updatedChapters);
  };

  const updateMeeting = (chapterIndex: number, meeting: ChapterMeeting | undefined) => {
    const updatedChapters = [...localChapters];
    updatedChapters[chapterIndex] = {
      ...updatedChapters[chapterIndex],
      meeting
    };
    setLocalChapters(updatedChapters);
  };

  // Pass local changes to parent only when explicitly requested
  useEffect(() => {
    onChange(localChapters);
  }, [localChapters]);

  return (
    <div className="space-y-6">
      {localChapters.map((chapter, chapterIndex) => (
        <div key={chapter.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => toggleChapter(chapter.id)}
              className="flex items-center space-x-2 text-left text-gray-900 hover:text-[#ff751d] transition-colors"
            >
              {expandedChapters[chapter.id] ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <span className="text-lg font-medium">{chapter.title || `Chapter ${chapterIndex + 1}`}</span>
            </button>
            <button
              onClick={() => removeChapter(chapterIndex)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {expandedChapters[chapter.id] && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                {chapter.startDate ? `${new Date(chapter.startDate).toLocaleDateString()} at ${chapter.startTime}` : 'Schedule not set'} • {chapter.duration} minutes
              </div>

              <input
                type="text"
                placeholder="Chapter Title"
                value={chapter.title}
                onChange={e => updateChapter(chapterIndex, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
              />

              <RichTextEditor
                value={chapter.description}
                onChange={value => updateChapter(chapterIndex, { description: value })}
                placeholder="Chapter Description"
                height={200}
              />

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Start Date
                   </label>
                   <input
                     type="date"
                     value={chapter.startDate}
                     onChange={e => updateChapter(chapterIndex, { startDate: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Start Time
                   </label>
                   <input
                     type="time"
                     value={chapter.startTime}
                     onChange={e => updateChapter(chapterIndex, { startTime: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Duration (minutes)
                   </label>
                   <div className="relative">
                     <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input
                       type="number"
                       min="0"
                       value={chapter.duration}
                       onChange={e => updateChapter(chapterIndex, { duration: parseInt(e.target.value) })}
                       className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Meeting Link
                   </label>
                   <div className="flex space-x-2">
                     <select
                       value={chapter.meeting?.type || ''}
                       onChange={e => {
                         const type = e.target.value as ChapterMeeting['type'] | '';
                         if (!type) {
                           updateMeeting(chapterIndex, undefined);
                         } else if (!chapter.meeting) {
                           updateMeeting(chapterIndex, { type, url: '' });
                         } else {
                           updateMeeting(chapterIndex, { ...chapter.meeting, type });
                         }
                       }}
                       className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                     >
                       <option value="">None</option>
                       <option value="teams">Teams</option>
                       <option value="zoom">Zoom</option>
                       <option value="meet">Meet</option>
                     </select>
                     {chapter.meeting && (
                       <div className="relative flex-1">
                         <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                         <input
                           type="url"
                           placeholder="Meeting URL"
                           value={chapter.meeting.url}
                           onChange={e => updateMeeting(chapterIndex, {
                             ...chapter.meeting!,
                             url: e.target.value
                           })}
                           className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                         />
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Video Content
                 </label>
                 <div className="flex space-x-2">
                   <select
                     value={chapter.video?.type || ''}
                     onChange={e => {
                       const type = e.target.value as 'youtube' | 'vimeo' | 'loom' | '';
                       if (!type) {
                         const updatedChapter = { ...chapter };
                         delete updatedChapter.video;
                         updateChapter(chapterIndex, updatedChapter);
                       } else if (!chapter.video) {
                         updateChapter(chapterIndex, {
                           ...chapter,
                           video: { type, url: '' }
                         });
                       } else {
                         updateChapter(chapterIndex, {
                           ...chapter,
                           video: { ...chapter.video, type }
                         });
                       }
                     }}
                     className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                   >
                     <option value="">No Video</option>
                     <option value="youtube">YouTube</option>
                     <option value="vimeo">Vimeo</option>
                     <option value="loom">Loom</option>
                   </select>
                   {chapter.video && (
                     <div className="relative flex-1">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         {chapter.video.type === 'youtube' ? (
                           <Youtube className="h-5 w-5 text-gray-400" />
                         ) : (
                           <Play className="h-5 w-5 text-gray-400" />
                         )}
                       </div>
                       <input
                         type="url"
                         placeholder={`${chapter.video.type.charAt(0).toUpperCase() + chapter.video.type.slice(1)} video URL`}
                         value={chapter.video.url}
                         onChange={e => updateChapter(chapterIndex, {
                           ...chapter,
                           video: { ...chapter.video!, url: e.target.value }
                         })}
                         className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                       />
                     </div>
                   )}
                 </div>
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documentation Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    placeholder="Documentation URL"
                    value={chapter.documentationUrl || ''}
                    onChange={e => updateChapter(chapterIndex, {
                      ...chapter,
                      documentationUrl: e.target.value
                    })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documents
                </label>
                <div className="space-y-2">
                  {chapter.documents?.map((doc, docIndex) => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.type}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedDocs = chapter.documents?.filter((_, i) => i !== docIndex);
                          updateChapter(chapterIndex, {
                            ...chapter,
                            documents: updatedDocs
                          });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        placeholder="Document URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d] sm:text-sm"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const url = input.value.trim();
                            if (url) {
                              const safeUrl = sanitizeUrl(url);
                              if (!safeUrl) return;
                              
                              const newDoc = {
                                id: crypto.randomUUID(),
                                name: sanitizeFileName(url.split('/').pop() || 'Document'),
                                url: safeUrl,
                                type: url.split('.').pop()?.toUpperCase() || 'DOCUMENT',
                                uploadedAt: new Date().toISOString()
                              };
                              updateChapter(chapterIndex, {
                                ...chapter,
                                documents: [...(chapter.documents || []), newDoc]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.pptx';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const safeName = sanitizeFileName(file.name);
                              // In a real app, you would upload the file to a server
                              // For demo, we'll create a fake URL
                              const newDoc = {
                                id: crypto.randomUUID(),
                                name: safeName,
                                url: URL.createObjectURL(file),
                                type: file.type.split('/').pop()?.toUpperCase() || 'DOCUMENT',
                                size: file.size,
                                uploadedAt: new Date().toISOString()
                              };
                              updateChapter(chapterIndex, {
                                ...chapter,
                                documents: [...(chapter.documents || []), newDoc]
                              });
                            }
                          };
                          input.click();
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enter document URL and press Enter, or click + to upload a file
                    </p>
                  </div>
                </div>
              </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <h4 className="text-sm font-medium text-gray-900">Milestones</h4>
                   <button
                     onClick={() => addMilestone(chapterIndex)}
                     className="flex items-center space-x-1 text-sm text-[#ff751d] hover:text-[#e66b1a]"
                   >
                     <Plus className="h-4 w-4" />
                     <span>Add Milestone</span>
                   </button>
                 </div>

                 {chapter.milestones.map((milestone, milestoneIndex) => (
                   <div key={milestone.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-md">
                     <div className="flex-1 space-y-2">
                       <input
                         type="text"
                         placeholder="Milestone Title"
                         value={milestone.title}
                         onChange={e => updateMilestone(chapterIndex, milestoneIndex, {
                           title: e.target.value
                         })}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                       />
                       <RichTextEditor
                         value={milestone.description}
                         onChange={value => updateMilestone(chapterIndex, milestoneIndex, { description: value })}
                         placeholder="Milestone Description"
                         height={150}
                       />
                       <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Milestone Type
                        </label>
                        <select
                          value={milestone.type}
                          onChange={e => updateMilestone(chapterIndex, milestoneIndex, {
                            type: e.target.value as 'text' | 'questionary',
                            questions: e.target.value === 'questionary' ? [
                              {
                                question: '',
                                answers: ['', '', '', ''],
                                correctAnswer: 0
                              }
                            ] : undefined
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                        >
                          <option value="text">Text</option>
                          <option value="questionary">Questionary</option>
                        </select>
                      </div>
                      
                      {milestone.type === 'questionary' && milestone.questions && (
                        <div className="mt-4 space-y-4">
                          {milestone.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-4 bg-white rounded-lg border border-gray-200">
                              <input
                                type="text"
                                placeholder="Question"
                                value={q.question}
                                onChange={e => {
                                  const newQuestions = [...milestone.questions!];
                                  newQuestions[qIndex] = {
                                    ...newQuestions[qIndex],
                                    question: e.target.value
                                  };
                                  updateMilestone(chapterIndex, milestoneIndex, { questions: newQuestions });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d] mb-2"
                              />
                              <div className="space-y-2">
                                {q.answers.map((answer, aIndex) => (
                                  <div key={aIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      checked={q.correctAnswer === aIndex}
                                      onChange={() => {
                                        const newQuestions = [...milestone.questions!];
                                        newQuestions[qIndex] = {
                                          ...newQuestions[qIndex],
                                          correctAnswer: aIndex
                                        };
                                        updateMilestone(chapterIndex, milestoneIndex, { questions: newQuestions });
                                      }}
                                      className="text-[#ff751d] focus:ring-[#ff751d]"
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Answer ${aIndex + 1}`}
                                      value={answer}
                                      onChange={e => {
                                        const newQuestions = [...milestone.questions!];
                                        newQuestions[qIndex].answers[aIndex] = e.target.value;
                                        updateMilestone(chapterIndex, milestoneIndex, { questions: newQuestions });
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff751d] focus:border-[#ff751d]"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = [...(milestone.questions || [])];
                              newQuestions.push({
                                question: '',
                                answers: ['', '', '', ''],
                                correctAnswer: 0
                              });
                              updateMilestone(chapterIndex, milestoneIndex, { questions: newQuestions });
                            }}
                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-[#ff751d] hover:border-[#ff751d]"
                          >
                            Add Question
                          </button>
                        </div>
                      )}
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={milestone.enabled}
                          onChange={e => updateMilestone(chapterIndex, milestoneIndex, {
                            enabled: e.target.checked
                          })}
                          className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                        />
                        <span className="text-sm text-gray-700">Enable milestone</span>
                      </label>
                      <label className="flex items-center space-x-2 ml-4">
                        <input
                          type="checkbox"
                          checked={milestone.adminOnly}
                          onChange={e => updateMilestone(chapterIndex, milestoneIndex, {
                            adminOnly: e.target.checked
                          })}
                          className="rounded border-gray-300 text-[#ff751d] focus:ring-[#ff751d]"
                        />
                        <span className="text-sm text-gray-700">Admin completion only</span>
                      </label>
                     </div>
                     <button
                       onClick={() => removeMilestone(chapterIndex, milestoneIndex)}
                       className="text-red-500 hover:text-red-700 p-1"
                     >
                       <Trash2 className="h-4 w-4" />
                     </button>
                   </div>
                 ))}
             </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addChapter}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-[#ff751d] hover:border-[#ff751d] transition-colors"
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Chapter</span>
        </div>
      </button>
    </div>
  );
}