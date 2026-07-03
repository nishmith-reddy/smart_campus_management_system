import { User, Student, Faculty, Course, Attendance, Assignment, Submission, Notice, Fee, Result } from '../types';

export const initialUsers: (User & { password?: string })[] = [
  {
    id: 'u-admin',
    email: 'admin@scms.com',
    password: 'admin123',
    name: 'Dr. Nishmith Reddy',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Administration',
    contact: '+1-555-0100',
    idNumber: 'SCMS-ADM-01',
    status: 'approved'
  },
  {
    id: 'u-faculty-1',
    email: 'faculty@scms.com',
    password: 'faculty123',
    name: 'Prof. Sarah Jenkins',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Computer Science',
    contact: '+1-555-0201',
    idNumber: 'SCMS-FAC-101',
    status: 'approved'
  },
  {
    id: 'u-faculty-2',
    email: 'chen@scms.com',
    password: 'faculty123',
    name: 'Dr. Robert Chen',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Electronics',
    contact: '+1-555-0202',
    idNumber: 'SCMS-FAC-102',
    status: 'approved'
  },
  {
    id: 'u-student-1',
    email: 'student@scms.com',
    password: 'student123',
    name: 'Alex Carter',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Computer Science',
    contact: '+1-555-0301',
    idNumber: 'SCMS-STU-201',
    status: 'approved'
  },
  {
    id: 'u-student-2',
    email: 'emily@scms.com',
    password: 'student123',
    name: 'Emily Watson',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Computer Science',
    contact: '+1-555-0302',
    idNumber: 'SCMS-STU-202',
    status: 'approved'
  },
  {
    id: 'u-student-3',
    email: 'marcus@scms.com',
    password: 'student123',
    name: 'Marcus Aurelius',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Electronics',
    contact: '+1-555-0303',
    idNumber: 'SCMS-STU-203',
    status: 'approved'
  },
  {
    id: 'u-student-4',
    email: 'chloe@scms.com',
    password: 'student123',
    name: 'Chloe Bennett',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80',
    department: 'Mechanical',
    contact: '+1-555-0304',
    idNumber: 'SCMS-STU-204',
    status: 'approved'
  }
];

export const initialStudents: Student[] = [
  {
    id: 's-1',
    userId: 'u-student-1',
    name: 'Alex Carter',
    email: 'student@scms.com',
    rollNumber: 'SCMS-STU-201',
    department: 'Computer Science',
    currentSemester: 4,
    cgpa: 3.82,
    contact: '+1-555-0301',
    admissionYear: 2024
  },
  {
    id: 's-2',
    userId: 'u-student-2',
    name: 'Emily Watson',
    email: 'emily@scms.com',
    rollNumber: 'SCMS-STU-202',
    department: 'Computer Science',
    currentSemester: 4,
    cgpa: 3.95,
    contact: '+1-555-0302',
    admissionYear: 2024
  },
  {
    id: 's-3',
    userId: 'u-student-3',
    name: 'Marcus Aurelius',
    email: 'marcus@scms.com',
    rollNumber: 'SCMS-STU-203',
    department: 'Electronics',
    currentSemester: 6,
    cgpa: 3.51,
    contact: '+1-555-0303',
    admissionYear: 2023
  },
  {
    id: 's-4',
    userId: 'u-student-4',
    name: 'Chloe Bennett',
    email: 'chloe@scms.com',
    rollNumber: 'SCMS-STU-204',
    department: 'Mechanical',
    currentSemester: 2,
    cgpa: 3.24,
    contact: '+1-555-0304',
    admissionYear: 2025
  }
];

export const initialFaculty: Faculty[] = [
  {
    id: 'f-1',
    userId: 'u-faculty-1',
    name: 'Prof. Sarah Jenkins',
    email: 'faculty@scms.com',
    employeeId: 'SCMS-FAC-101',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Machine Learning & AI',
    contact: '+1-555-0201'
  },
  {
    id: 'f-2',
    userId: 'u-faculty-2',
    name: 'Dr. Robert Chen',
    email: 'chen@scms.com',
    employeeId: 'SCMS-FAC-102',
    department: 'Electronics',
    designation: 'Head of Department',
    specialization: 'VLSI Systems & Digital Circuits',
    contact: '+1-555-0202'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'c-1',
    code: 'CS201',
    name: 'Advanced Data Structures',
    department: 'Computer Science',
    credits: 4,
    semester: 4,
    syllabus: 'Topics include: Balanced trees (AVL, RB), Heaps, Graphs algorithms, and Dynamic programming.',
    facultyId: 'f-1'
  },
  {
    id: 'c-2',
    code: 'CS202',
    name: 'Machine Learning Basics',
    department: 'Computer Science',
    credits: 3,
    semester: 4,
    syllabus: 'Introduction to supervised & unsupervised learning, regression, classification, and neural network foundations.',
    facultyId: 'f-1'
  },
  {
    id: 'c-3',
    code: 'EE301',
    name: 'Microprocessor Systems',
    department: 'Electronics',
    credits: 4,
    semester: 6,
    syllabus: 'Study of 8086 microcontrollers, assembly language programming, peripheral interfacing, and register organization.',
    facultyId: 'f-2'
  },
  {
    id: 'c-4',
    code: 'ME102',
    name: 'Fluid Mechanics',
    department: 'Mechanical',
    credits: 4,
    semester: 2,
    syllabus: 'Principles of fluid statics, fluid dynamics, Navier-Stokes equations, and viscous flows in pipes.',
    facultyId: 'f-2' // Subbing for mechanical HOD
  }
];

export const initialAttendance: Attendance[] = [
  // Student 1 (Alex Carter) CS201 Attendance
  { id: 'att-1', studentId: 's-1', courseId: 'c-1', date: '2026-06-25', status: 'present', remarks: 'Active participation' },
  { id: 'att-2', studentId: 's-1', courseId: 'c-1', date: '2026-06-28', status: 'present' },
  { id: 'att-3', studentId: 's-1', courseId: 'c-1', date: '2026-06-30', status: 'absent', remarks: 'Medical excuse' },
  { id: 'att-4', studentId: 's-1', courseId: 'c-1', date: '2026-07-02', status: 'present' },
  
  // Student 1 (Alex Carter) CS202 Attendance
  { id: 'att-5', studentId: 's-1', courseId: 'c-2', date: '2026-06-26', status: 'present' },
  { id: 'att-6', studentId: 's-1', courseId: 'c-2', date: '2026-06-29', status: 'present' },
  { id: 'att-7', studentId: 's-1', courseId: 'c-2', date: '2026-07-01', status: 'present' },

  // Student 2 (Emily Watson) CS201 Attendance
  { id: 'att-8', studentId: 's-2', courseId: 'c-1', date: '2026-06-25', status: 'present' },
  { id: 'att-9', studentId: 's-2', courseId: 'c-1', date: '2026-06-28', status: 'present' },
  { id: 'att-10', studentId: 's-2', courseId: 'c-1', date: '2026-06-30', status: 'present' },
  { id: 'att-11', studentId: 's-2', courseId: 'c-1', date: '2026-07-02', status: 'present' },

  // Student 3 (Marcus) EE301 Attendance
  { id: 'att-12', studentId: 's-3', courseId: 'c-3', date: '2026-06-24', status: 'present' },
  { id: 'att-13', studentId: 's-3', courseId: 'c-3', date: '2026-06-27', status: 'absent', remarks: 'No notice provided' },
  { id: 'att-14', studentId: 's-3', courseId: 'c-3', date: '2026-07-01', status: 'present' }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Balanced Red-Black Trees Implementation',
    description: 'Implement a fully working Red-Black Tree in Java or C++. Include methods for Insertion, Deletion, and Node Coloring validation rules. Document worst-case height and rotations with diagrams.',
    courseId: 'c-1',
    dueDate: '2026-07-10',
    maxPoints: 100,
    createdBy: 'f-1'
  },
  {
    id: 'asg-2',
    title: 'Linear & Logistic Regression Lab Work',
    description: 'Apply regression models on the provided houses dataset. Plot prediction outputs vs actual metrics using Matplotlib. Write a 2-page report explaining Cost Minimization and Gradient Descent iterations.',
    courseId: 'c-2',
    dueDate: '2026-07-15',
    maxPoints: 50,
    createdBy: 'f-1'
  },
  {
    id: 'asg-3',
    title: '8086 Assembly Matrix Multiplication',
    description: 'Write an 8086 assembly program to perform multiplication of two 3x3 matrices loaded in memory. Emulate using emu8086 and dump flag states.',
    courseId: 'c-3',
    dueDate: '2026-07-08',
    maxPoints: 100,
    createdBy: 'f-2'
  }
];

export const initialSubmissions: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 's-2', // Emily Watson
    submissionDate: '2026-07-01',
    content: 'Completed Java implementation with visualizer panels. GitHub link: github.com/emily-watson/rb-tree-java. All edge cases verified.',
    status: 'graded',
    pointsObtained: 98,
    gradeRemarks: 'Incredible work on tree rotations. Code is exceptionally clean.'
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-2',
    studentId: 's-1', // Alex Carter
    submissionDate: '2026-07-02',
    content: 'My Jupyter Notebook submitted. Implemented Mini-Batch Gradient Descent as a bonus comparison. Validation MSE = 0.023.',
    status: 'submitted'
  }
];

export const initialResults: Result[] = [
  // Alex Carter
  { id: 'res-1', studentId: 's-1', courseId: 'c-1', examType: 'Midterm', marksObtained: 88, maxMarks: 100, grade: 'A', remarks: 'Good analytical skills' },
  { id: 'res-2', studentId: 's-1', courseId: 'c-2', examType: 'Midterm', marksObtained: 45, maxMarks: 50, grade: 'A+', remarks: 'Outstanding project approach' },
  
  // Emily Watson
  { id: 'res-3', studentId: 's-2', courseId: 'c-1', examType: 'Midterm', marksObtained: 95, maxMarks: 100, grade: 'A+', remarks: 'Perfect score in algorithm dry runs' },
  
  // Marcus
  { id: 'res-4', studentId: 's-3', courseId: 'c-3', examType: 'Midterm', marksObtained: 72, maxMarks: 100, grade: 'B', remarks: 'Requires improvement in assembly syntax debugging' }
];

export const initialFees: Fee[] = [
  { id: 'fee-1', studentId: 's-1', title: 'Semester Tuition Fee - Sem 4', amount: 4500, dueDate: '2026-07-20', status: 'unpaid' },
  { id: 'fee-2', studentId: 's-1', title: 'Campus Infrastructure & Laboratory Fee', amount: 350, dueDate: '2026-07-15', status: 'paid', paymentDate: '2026-06-20', transactionId: 'TXN-94021-930' },
  { id: 'fee-3', studentId: 's-2', title: 'Semester Tuition Fee - Sem 4', amount: 4500, dueDate: '2026-07-20', status: 'paid', paymentDate: '2026-06-25', transactionId: 'TXN-59302-120' },
  { id: 'fee-4', studentId: 's-3', title: 'Semester Tuition Fee - Sem 6', amount: 4800, dueDate: '2026-07-20', status: 'unpaid' },
  { id: 'fee-5', studentId: 's-4', title: 'Semester Tuition Fee - Sem 2', amount: 4200, dueDate: '2026-07-20', status: 'paid', paymentDate: '2026-06-18', transactionId: 'TXN-10394-049' }
];

export const initialNotices: Notice[] = [
  {
    id: 'not-1',
    title: 'End-Semester Theory & Practical Exams Schedule',
    content: 'The end-semester examinations for Semesters 2, 4 & 6 will commence on November 15, 2026. Hall tickets will be released on the portal 10 days prior. Clear all pending fees before November 1 to avoid withholding hall tickets.',
    category: 'exam',
    date: '2026-07-01',
    author: 'Office of Controller of Examinations'
  },
  {
    id: 'not-2',
    title: 'Smart Campus Annual Hackathon 2026 Registrations Open',
    content: 'Collaborate and build amazing apps! Registrations are now open for the annual smart campus hackathon. Cash prizes up to $5000 and internship offers from top recruiters are up for grabs. Register by July 25.',
    category: 'event',
    date: '2026-06-28',
    author: 'Dr. Nishmith Reddy (Director)'
  },
  {
    id: 'not-3',
    title: 'Mandatory Summer Placement Orientation for Sem 6 Students',
    content: 'All Semester 6 students across all branches must attend the placement orientation session on July 10, 2026, at 2 PM in the main auditorium. Resumes must be updated on the campus portal prior to attendance.',
    category: 'academic',
    date: '2026-07-02',
    author: 'Training & Placement Officer'
  },
  {
    id: 'not-4',
    title: 'Power Outage & Main Server Maintenance on July 5',
    content: 'The main administrative servers and campus high-performance computing labs will be offline on July 5, 2026, from 8 AM to 2 PM due to electrical substation repairs and server maintenance.',
    category: 'general',
    date: '2026-07-02',
    author: 'Campus IT Infrastructure Cell'
  }
];
