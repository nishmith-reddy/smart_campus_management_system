export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  contact?: string;
  idNumber?: string; // Employee ID or Roll Number
  status: 'pending' | 'approved';
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  currentSemester: number;
  cgpa: number;
  contact: string;
  admissionYear: number;
}

export interface Faculty {
  id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  specialization: string;
  contact: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
  syllabus: string;
  facultyId: string; // Assigned faculty member's ID
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
  remarks?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  maxPoints: number;
  createdBy: string; // Faculty ID
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  content: string; // Link or text description of their submitted work
  status: 'submitted' | 'graded';
  pointsObtained?: number;
  gradeRemarks?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'exam' | 'event' | 'general';
  date: string;
  author: string;
}

export interface Fee {
  id: string;
  studentId: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  paymentDate?: string;
  transactionId?: string;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  examType: 'Midterm' | 'Final Exam' | 'Practical' | 'Assignment Project';
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
}
