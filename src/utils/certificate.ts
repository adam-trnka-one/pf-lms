import { jsPDF } from 'jspdf';
import type { Course } from '../types/course';
import { getStoredUser } from './auth';

export function shareOnLinkedIn(course: Course): void {
  if (!course.completedAt) {
    console.error('Cannot share certificate - course not completed');
    return;
  }
  
  const issueDate = new Date(course.completedAt);

  // Calculate validity end date
  const validityEndDate = new Date(issueDate);
  validityEndDate.setMonth(validityEndDate.getMonth() + course.certificateValidity.months);

  const title = encodeURIComponent(`${course.title} Certification`);
  const org = encodeURIComponent('ProductFruits');
  const certUrl = encodeURIComponent(window.location.href);
  const issueDateStr = encodeURIComponent(`${issueDate.getFullYear()}${String(issueDate.getMonth() + 1).padStart(2, '0')}`);
  const expirationDateStr = encodeURIComponent(`${validityEndDate.getFullYear()}${String(validityEndDate.getMonth() + 1).padStart(2, '0')}`);
  
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${title}&organizationName=${org}&certUrl=${certUrl}&issueDate=${issueDateStr}&expirationDate=${expirationDateStr}`;
  window.open(linkedInUrl, '_blank');
}

export function isCertificationValid(course: Course): boolean {
  // Find the last completed milestone to determine completion date
  const lastCompletedMilestone = course.chapters
    .flatMap(ch => ch.milestones)
    .filter(m => m.completed)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

  if (!lastCompletedMilestone?.completedAt) {
    return false;
  }

  const completionDate = new Date(lastCompletedMilestone.completedAt);
  const validityEndDate = new Date(completionDate);
  validityEndDate.setMonth(validityEndDate.getMonth() + course.certificateValidity.months);

  return validityEndDate > new Date();
}

export function generateCertificate(course: Course): void {
  const user = getStoredUser();
  if (!user?.permissions.canDownloadCertificates) {
    console.error('User does not have permission to download certificates');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 297, 210, 'F');

  // Add ProductFruits text as logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 117, 29); // #ff751d
  doc.text('ProductFruits', 20, 30);

  // Add decorative border
  doc.setDrawColor(255, 117, 29); // #ff751d
  doc.setLineWidth(1);
  doc.rect(10, 10, 277, 190);

  // Add certificate title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(51, 51, 51);
  doc.text('Certificate of Completion', 148.5, 60, { align: 'center' });

  // Add course details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('This is to certify that', 148.5, 90, { align: 'center' });

  // Add student name placeholder
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('[Student Name]', 148.5, 105, { align: 'center' });

  // Add course completion text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('has successfully completed the course', 148.5, 120, { align: 'center' });

  // Add course name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(course.title, 148.5, 135, { align: 'center' });

  // Find the last completed milestone
  const lastCompletedMilestone = course.chapters
    .flatMap(ch => ch.milestones)
    .filter(m => m.completed)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

  // Add completion date
  const completionDate = lastCompletedMilestone?.completedAt 
    ? new Date(lastCompletedMilestone.completedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`Completed on ${completionDate}`, 148.5, 150, { align: 'center' });

  // Add instructor signature
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.text(course.instructor.name, 148.5, 170, { align: 'center' });
  doc.line(118.5, 175, 178.5, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('Instructor', 148.5, 180, { align: 'center' });

  // Save the PDF
  doc.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
}