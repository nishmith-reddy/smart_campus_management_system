import React, { useState, useEffect } from 'react';
import { User, Student, Faculty, Course, Attendance, Assignment, Submission, Result, Fee, Notice, UserRole } from './types';
import { 
  initialUsers, 
  initialStudents, 
  initialFaculty, 
  initialCourses, 
  initialAttendance, 
  initialAssignments, 
  initialSubmissions, 
  initialResults, 
  initialFees, 
  initialNotices 
} from './utils/initialData';

// Component imports
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import StudentsPage from './components/StudentsPage';
import FacultyPage from './components/FacultyPage';
import CoursesPage from './components/CoursesPage';
import AttendancePage from './components/AttendancePage';
import ResultsPage from './components/ResultsPage';
import FeesPage from './components/FeesPage';
import NoticesPage from './components/NoticesPage';
import UsersPage from './components/UsersPage';
import ProfilePage from './components/ProfilePage';

import { motion } from 'motion/react';
import { GraduationCap, Menu, Bell, Search, Settings, LogOut } from 'lucide-react';

export default function App() {
  // Load initial data from localStorage if present, or fallback to initialData.ts
  const [users, setUsers] = useState<(User & { password?: string })[]>(() => {
    const saved = localStorage.getItem('scms_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('scms_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [faculty, setFaculty] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem('scms_faculty');
    return saved ? JSON.parse(saved) : initialFaculty;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('scms_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('scms_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('scms_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('scms_submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [results, setResults] = useState<Result[]>(() => {
    const saved = localStorage.getItem('scms_results');
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [fees, setFees] = useState<Fee[]>(() => {
    const saved = localStorage.getItem('scms_fees');
    return saved ? JSON.parse(saved) : initialFees;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('scms_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('scms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('scms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('scms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('scms_faculty', JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem('scms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('scms_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('scms_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('scms_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('scms_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('scms_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('scms_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('scms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('scms_current_user');
    }
  }, [currentUser]);

  // Auth actions
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRegisterUser = (newUser: User & { password?: string }, extraData: any) => {
    // Add user record
    setUsers(prev => [...prev, newUser]);

    // Create student or faculty ledger record
    if (newUser.role === 'student') {
      const newStudent: Student = {
        id: 's-' + Math.random().toString(36).substr(2, 9),
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rollNumber: extraData.rollNumber,
        department: extraData.department,
        currentSemester: 1,
        cgpa: 0.0,
        contact: extraData.contact,
        admissionYear: 2026
      };
      setStudents(prev => [...prev, newStudent]);
    } else if (newUser.role === 'faculty') {
      const newFaculty: Faculty = {
        id: 'f-' + Math.random().toString(36).substr(2, 9),
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        employeeId: extraData.employeeId,
        department: extraData.department,
        designation: 'Assistant Professor',
        specialization: 'General Studies',
        contact: extraData.contact
      };
      setFaculty(prev => [...prev, newFaculty]);
    }
  };

  // Student directory operations
  const handleAddStudent = (newStudent: Student, password?: string) => {
    setStudents(prev => [...prev, newStudent]);
    // Auto-create matching login user if not exists
    const userExists = users.some(u => u.email.toLowerCase() === newStudent.email.toLowerCase());
    if (!userExists) {
      const newUser: User & { password?: string } = {
        id: newStudent.userId,
        email: newStudent.email,
        password: password || 'student123',
        name: newStudent.name,
        role: 'student',
        department: newStudent.department,
        idNumber: newStudent.rollNumber,
        contact: newStudent.contact,
        status: 'approved'
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    // Sync to user record
    setUsers(prev => prev.map(u => {
      if (u.id === updatedStudent.userId || u.email.toLowerCase() === updatedStudent.email.toLowerCase()) {
        return {
          ...u,
          name: updatedStudent.name,
          department: updatedStudent.department,
          idNumber: updatedStudent.rollNumber,
          contact: updatedStudent.contact
        };
      }
      return u;
    }));
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (student) {
      setUsers(prev => prev.filter(u => u.id !== student.userId));
    }
  };

  // Faculty directory operations
  const handleAddFaculty = (newFaculty: Faculty) => {
    setFaculty(prev => [...prev, newFaculty]);
    const userExists = users.some(u => u.email.toLowerCase() === newFaculty.email.toLowerCase());
    if (!userExists) {
      const newUser: User & { password?: string } = {
        id: newFaculty.userId,
        email: newFaculty.email,
        password: 'faculty123',
        name: newFaculty.name,
        role: 'faculty',
        department: newFaculty.department,
        idNumber: newFaculty.employeeId,
        contact: newFaculty.contact,
        status: 'approved'
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleUpdateFaculty = (updatedFaculty: Faculty) => {
    setFaculty(prev => prev.map(f => f.id === updatedFaculty.id ? updatedFaculty : f));
    setUsers(prev => prev.map(u => {
      if (u.id === updatedFaculty.userId || u.email.toLowerCase() === updatedFaculty.email.toLowerCase()) {
        return {
          ...u,
          name: updatedFaculty.name,
          department: updatedFaculty.department,
          idNumber: updatedFaculty.employeeId,
          contact: updatedFaculty.contact
        };
      }
      return u;
    }));
  };

  const handleDeleteFaculty = (facultyId: string) => {
    const fac = faculty.find(f => f.id === facultyId);
    setFaculty(prev => prev.filter(f => f.id !== facultyId));
    if (fac) {
      setUsers(prev => prev.filter(u => u.id !== fac.userId));
    }
  };

  // Course operations
  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setAssignments(prev => prev.filter(a => a.courseId !== courseId));
  };

  // Attendance operations
  const handleSaveAttendance = (newLogs: Attendance[]) => {
    // Merge new logs, overwrite if matches student + course + date
    setAttendance(prev => {
      const filtered = prev.filter(log => 
        !newLogs.some(n => n.studentId === log.studentId && n.courseId === log.courseId && n.date === log.date)
      );
      return [...filtered, ...newLogs];
    });
  };

  // Assignments & Task submissions
  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments(prev => [...prev, newAsg]);
  };

  const handleAddSubmission = (newSub: Submission) => {
    // If submission exists, update it, otherwise add
    setSubmissions(prev => {
      const filtered = prev.filter(s => !(s.assignmentId === newSub.assignmentId && s.studentId === newSub.studentId));
      return [...filtered, newSub];
    });
  };

  const handleGradeSubmission = (subId: string, points: number, remarks: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          pointsObtained: points,
          gradeRemarks: remarks,
          status: 'graded' as const
        };
      }
      return s;
    }));

    // Auto-create Result entry for student report card
    const sub = submissions.find(s => s.id === subId);
    const asg = sub ? assignments.find(a => a.id === sub.assignmentId) : null;
    if (sub && asg) {
      const computedGrade = (points / asg.maxPoints) * 100 >= 90 ? 'A+' : (points / asg.maxPoints) * 100 >= 80 ? 'A' : 'B';
      const newResult: Result = {
        id: 'res-' + Math.random().toString(36).substr(2, 9),
        studentId: sub.studentId,
        courseId: asg.courseId,
        examType: 'Assignment Project',
        marksObtained: points,
        maxMarks: asg.maxPoints,
        grade: computedGrade,
        remarks: remarks
      };
      setResults(prev => [...prev, newResult]);
    }
  };

  // Results / Gradebook
  const handleAddResult = (newResult: Result) => {
    setResults(prev => [...prev, newResult]);
  };

  const handleDeleteResult = (resultId: string) => {
    setResults(prev => prev.filter(r => r.id !== resultId));
  };

  // Fees / Invoices
  const handleAddFee = (newFee: Fee) => {
    setFees(prev => [...prev, newFee]);
  };

  const handlePayFee = (feeId: string, transactionId: string) => {
    setFees(prev => prev.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'paid' as const,
          paymentDate: new Date().toISOString().split('T')[0],
          transactionId
        };
      }
      return f;
    }));
  };

  const handleDeleteFee = (feeId: string) => {
    setFees(prev => prev.filter(f => f.id !== feeId));
  };

  // Notices
  const handleAddNotice = (newNotice: Notice) => {
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (noticeId: string) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  // Users Page Admin approvals
  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' as const } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Clean up related lists
    setStudents(prev => prev.filter(s => s.userId !== userId));
    setFaculty(prev => prev.filter(f => f.userId !== userId));
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  // Profile Edit
  const handleUpdateProfile = (updatedProfile: any) => {
    if (!currentUser) return;
    
    const updatedUser: User = {
      ...currentUser,
      name: updatedProfile.name,
      email: updatedProfile.email,
      contact: updatedProfile.contact,
      department: updatedProfile.department,
      idNumber: updatedProfile.idNumber
    };

    setCurrentUser(updatedUser);
    
    // Sync current user into full user directory
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedUser } : u));

    // Sync student or faculty lists
    if (currentUser.role === 'student') {
      setStudents(prev => prev.map(s => s.userId === currentUser.id ? { ...s, name: updatedProfile.name, email: updatedProfile.email, contact: updatedProfile.contact, department: updatedProfile.department, rollNumber: updatedProfile.idNumber } : s));
    } else if (currentUser.role === 'faculty') {
      setFaculty(prev => prev.map(f => f.userId === currentUser.id ? { ...f, name: updatedProfile.name, email: updatedProfile.email, contact: updatedProfile.contact, department: updatedProfile.department, employeeId: updatedProfile.idNumber } : f));
    }
  };

  // Active page selector
  const renderActivePage = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            currentUser={currentUser}
            students={students}
            faculty={faculty}
            courses={courses}
            notices={notices}
            fees={fees}
            assignments={assignments}
            submissions={submissions}
            setActiveTab={setActiveTab}
          />
        );
      case 'students':
        return (
          <StudentsPage
            currentUser={currentUser}
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'faculty':
        return (
          <FacultyPage
            currentUser={currentUser}
            faculty={faculty}
            onAddFaculty={handleAddFaculty}
            onUpdateFaculty={handleUpdateFaculty}
            onDeleteFaculty={handleDeleteFaculty}
          />
        );
      case 'courses':
        return (
          <CoursesPage
            currentUser={currentUser}
            courses={courses}
            faculty={faculty}
            students={students}
            assignments={assignments}
            submissions={submissions}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddAssignment={handleAddAssignment}
            onAddSubmission={handleAddSubmission}
            onGradeSubmission={handleGradeSubmission}
          />
        );
      case 'attendance':
        return (
          <AttendancePage
            currentUser={currentUser}
            students={students}
            courses={courses}
            attendance={attendance}
            onSaveAttendance={handleSaveAttendance}
          />
        );
      case 'results':
        return (
          <ResultsPage
            currentUser={currentUser}
            students={students}
            courses={courses}
            results={results}
            onAddResult={handleAddResult}
            onDeleteResult={handleDeleteResult}
          />
        );
      case 'fees':
        return (
          <FeesPage
            currentUser={currentUser}
            students={students}
            fees={fees}
            onAddFee={handleAddFee}
            onPayFee={handlePayFee}
            onDeleteFee={handleDeleteFee}
          />
        );
      case 'notices':
        return (
          <NoticesPage
            currentUser={currentUser}
            notices={notices}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
          />
        );
      case 'users':
        return (
          <UsersPage
            currentUser={currentUser}
            users={users}
            onApproveUser={handleApproveUser}
            onDeleteUser={handleDeleteUser}
            onChangeUserRole={handleChangeUserRole}
            onAddUser={handleRegisterUser}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <div className="text-white text-center py-10">Tab view under development.</div>;
    }
  };

  // Render Login page if not authenticated
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        users={users}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer md:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-green-700 font-bold uppercase bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                Smart Campus Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative">
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
              <Bell className="h-4 w-4" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-800 block">{currentUser.name}</span>
                <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1 justify-end">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full inline-block" />
                  Connected
                </span>
              </div>
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
                alt={currentUser.name} 
                className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-slate-100 cursor-pointer animate-fade-in"
                onClick={() => setActiveTab('profile')}
              />
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <button 
              onClick={handleLogout}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm px-3 shrink-0"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 relative">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="pb-12 max-w-7xl mx-auto"
          >
            {renderActivePage()}
          </motion.div>
        </main>
      </div>

    </div>
  );
}
