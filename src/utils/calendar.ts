export function generateCalendarEvent(
  chapterTitle: string,
  description: string,
  startDate: string,
  startTime: string,
  durationMinutes: number,
  meetingUrl?: string
): string {
  // Format date and time for iCal
  const [year, month, day] = startDate.split('-');
  const [hours, minutes] = startTime.split(':');
  const start = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // Build event description
  let eventDescription = description;
  if (meetingUrl) {
    eventDescription += `\n\nMeeting Link: ${meetingUrl}`;
  }

  // Generate iCal content
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${chapterTitle}`,
    `DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return event;
}

export function downloadCalendarInvite(
  chapterTitle: string,
  description: string,
  startDate: string,
  startTime: string,
  durationMinutes: number,
  meetingUrl?: string
): void {
  const event = generateCalendarEvent(
    chapterTitle,
    description,
    startDate,
    startTime,
    durationMinutes,
    meetingUrl
  );

  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${chapterTitle.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}