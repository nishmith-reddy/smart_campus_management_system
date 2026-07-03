import React from 'react';
import { User, Student, Faculty, Course, Notice, Fee, Assignment, Submission } from '../types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Megaphone, 
  Wallet, 
  CheckSquare, 
  Calendar, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  FilePlus,
  ArrowUpRight,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardPageProps {
  currentUser: User;
  students: Student[];
  faculty: Faculty[];
  courses: Course[];
  notices: Notice[];
  fees: Fee[];
  assignments: Assignment[];
  submissions: Submission[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardPage({
  currentUser,
  students,
  faculty,
  courses,
  notices,
  fees,
  assignments,
  submissions,
  setActiveTab
}: DashboardPageProps) {

  // Global counts
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const totalCourses = courses.length;
  const totalNotices = notices.length;

  // Role Specific Calculations
  const getAdminStats = () => {
    const totalCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalPending = fees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
    const collectionPercentage = Math.round((totalCollected / (totalCollected + totalPending)) * 100) || 0;
    
    return {
      totalCollected,
      totalPending,
      collectionPercentage
    };
  };

  const getFacultyStats = () => {
    // Current faculty record
    const currentFac = faculty.find(f => f.email === currentUser.email);
    const facultyCourses = currentFac ? courses.filter(c => c.facultyId === currentFac.id) : [];
    const facultyCourseIds = facultyCourses.map(c => c.id);
    
    const assignedAsgs = assignments.filter(a => facultyCourseIds.includes(a.courseId));
    const assignedAsgIds = assignedAsgs.map(a => a.id);
    
    const totalSubs = submissions.filter(s => assignedAsgIds.includes(s.assignmentId));
    const pendingGrading = totalSubs.filter(s => s.status === 'submitted').length;

    return {
      coursesCount: facultyCourses.length,
      assignmentsCount: assignedAsgs.length,
      pendingGrading,
      facultyCourses
    };
  };

  const getStudentStats = () => {
    const currentStu = students.find(s => s.email === currentUser.email);
    const studentFees = currentStu ? fees.filter(f => f.studentId === currentStu.id) : [];
    const pendingFeesSum = studentFees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
    
    // Enrollment is CS or EE or ME courses
    const studentCourses = currentStu 
      ? courses.filter(c => c.department.toLowerCase() === currentStu.department.toLowerCase())
      : [];
    const studentCourseIds = studentCourses.map(c => c.id);
    
    const relevantAsgs = assignments.filter(a => studentCourseIds.includes(a.courseId));
    const completedSubs = currentStu 
      ? submissions.filter(s => s.studentId === currentStu.id)
      : [];
    
    const pendingAsgCount = relevantAsgs.length - completedSubs.length;

    return {
      cgpa: currentStu?.cgpa || 0,
      pendingFeesSum,
      pendingAsgCount,
      studentCourses,
      relevantAsgs
    };
  };

  const adminStats = getAdminStats();
  const facultyStats = getFacultyStats();
  const studentStats = getStudentStats();

  // Upcoming events
  const calendarEvents = [
    { id: 1, title: 'Server Substation Maintenance', date: 'July 5, 2026', time: '08:00 AM - 02:00 PM', type: 'system' },
    { id: 2, title: 'Orientation for Summer Placements', date: 'July 10, 2026', time: '02:00 PM', type: 'academic' },
    { id: 3, title: 'Annual Hackathon Team Deadline', date: 'July 25, 2026', time: '11:59 PM', type: 'event' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-blue-900 border border-indigo-200/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 font-semibold text-sm mb-1.5 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Smart Campus Management System
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-indigo-200">{currentUser.name}</span>!
            </h1>
            <p className="text-sm text-indigo-100/80 mt-1 max-w-xl">
              You are connected as <span className="text-white font-bold">{currentUser.role}</span>. Here's what's happening today at SCMS.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('notices')} 
              className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl border border-indigo-700/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Megaphone className="h-3.5 w-3.5" /> Notice Board
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-950 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              View Profile <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Metrics Row (Bento Grid Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <GraduationCap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Faculty</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalFaculty}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Courses</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalCourses}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-violet-50 p-3 rounded-xl border border-violet-100">
            <Megaphone className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Notices</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalNotices}</p>
          </div>
        </div>
      </div>

      {/* Role-Based Performance & Quick Actions Dashboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Role-Specific Bento Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Admin Dashboard Widget */}
          {currentUser.role === 'admin' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-rose-500" /> Administrative Controls
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Summary of fiscal collection metrics & credentials control</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">Annual Fee Revenue Status</span>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">${adminStats.totalCollected.toLocaleString()} Collected</h3>
                    <p className="text-xs text-slate-400 mt-1">${adminStats.totalPending.toLocaleString()} Remaining Outstanding</p>
                  </div>
                  {/* Fee Bar Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                      <span>Collection Rate</span>
                      <span>{adminStats.collectionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${adminStats.collectionPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-xs text-slate-500 font-semibold">Quick Admin Activities</span>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => setActiveTab('users')} className="p-2.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm">
                      <Users className="h-4 w-4 text-blue-500" /> Approve Logins
                    </button>
                    <button onClick={() => setActiveTab('courses')} className="p-2.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm">
                      <FilePlus className="h-4 w-4 text-violet-500" /> Add New Course
                    </button>
                    <button onClick={() => setActiveTab('students')} className="p-2.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm">
                      <GraduationCap className="h-4 w-4 text-emerald-500" /> Student Ledger
                    </button>
                    <button onClick={() => setActiveTab('fees')} className="p-2.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm">
                      <Wallet className="h-4 w-4 text-yellow-500" /> Manage Invoices
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Faculty Dashboard Widget */}
          {currentUser.role === 'faculty' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600" /> Educator Overview
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Overview of active lectures and pending paper-grading activities</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-semibold">Course Load</span>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">{facultyStats.coursesCount}</p>
                  <p className="text-[10px] text-slate-400 mt-1">active sections</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-semibold">Assignments Made</span>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">{facultyStats.assignmentsCount}</p>
                  <p className="text-[10px] text-slate-400 mt-1">on notice board</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center relative overflow-hidden group">
                  <span className="text-xs text-slate-500 font-semibold">To Be Graded</span>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">{facultyStats.pendingGrading}</p>
                  <button onClick={() => setActiveTab('courses')} className="text-[10px] text-indigo-600 font-bold mt-1 inline-flex items-center gap-1 hover:underline cursor-pointer">
                    Grade Now <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Course details */}
              <div className="mt-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Your Assigned Lectures</h3>
                <div className="space-y-2">
                  {facultyStats.facultyCourses.map(course => (
                    <div key={course.id} className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-slate-800">{course.code}</span>
                        <span className="text-slate-500 ml-2">{course.name}</span>
                      </div>
                      <span className="text-xs text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded-md font-semibold">{course.credits} Credits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Student Dashboard Widget */}
          {currentUser.role === 'student' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-indigo-600" /> Academic Dashboard
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Overview of your grades, balances, and deadlines</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-semibold">Cumulative GPA</span>
                  <p className="text-3xl font-extrabold text-indigo-600 mt-1">{studentStats.cgpa.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Excellent Standing</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-semibold">Pending Tasks</span>
                  <p className="text-3xl font-extrabold text-rose-600 mt-1">{studentStats.pendingAsgCount}</p>
                  <button onClick={() => setActiveTab('courses')} className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer mt-1 block mx-auto">View Assignment List</button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-semibold">Unpaid Dues</span>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">${studentStats.pendingFeesSum.toLocaleString()}</p>
                  <button onClick={() => setActiveTab('fees')} className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer mt-1 block mx-auto">Settle Invoice Now</button>
                </div>
              </div>

              {/* Task deadlines list */}
              <div className="mt-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Your Courses & Assignments</h3>
                <div className="space-y-2">
                  {studentStats.studentCourses.map(course => {
                    const asgs = studentStats.relevantAsgs.filter(a => a.courseId === course.id);
                    return (
                      <div key={course.id} className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col md:flex-row justify-between md:items-center text-sm gap-2">
                        <div>
                          <span className="font-bold text-slate-800">{course.code}</span>
                          <span className="text-slate-500 ml-2 text-xs md:text-sm">{course.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg self-start md:self-auto">
                          {asgs.length} assignments assigned
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Announcement Preview Grid */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone className="h-4.5 w-4.5 text-violet-600" /> Bulletin Board (Recent Notices)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Important campus alerts & executive bulletins</p>
              </div>
              <button onClick={() => setActiveTab('notices')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1">
                View All <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              {notices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      notice.category === 'exam' 
                        ? 'bg-rose-50 text-rose-600 border-rose-200' 
                        : notice.category === 'event'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : notice.category === 'academic'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notice.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Publisher: {notice.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Calendar & Events Widget */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Calendar className="h-4.5 w-4.5 text-indigo-600" /> Campus Calendar
            </h2>
            
            {/* Visual Mini Calendar representation */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-semibold mb-5">
              <span className="p-1.5 text-slate-300">28</span>
              <span className="p-1.5 text-slate-300">29</span>
              <span className="p-1.5 text-slate-300">30</span>
              <span className="p-1.5 bg-indigo-600 text-white rounded-lg font-bold shadow-sm">1</span>
              <span className="p-1.5 text-slate-700">2</span>
              <span className="p-1.5 text-slate-700">3</span>
              <span className="p-1.5 text-slate-700">4</span>
              <span className="p-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-bold">5</span>
              <span className="p-1.5 text-slate-700">6</span>
              <span className="p-1.5 text-slate-700">7</span>
              <span className="p-1.5 text-slate-700">8</span>
              <span className="p-1.5 text-slate-700">9</span>
              <span className="p-1.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg font-bold">10</span>
              <span className="p-1.5 text-slate-700">11</span>
              <span className="p-1.5 text-slate-700">12</span>
              <span className="p-1.5 text-slate-700">13</span>
              <span className="p-1.5 text-slate-700">14</span>
              <span className="p-1.5 text-slate-700">15</span>
              <span className="p-1.5 text-slate-700">16</span>
              <span className="p-1.5 text-slate-700">17</span>
              <span className="p-1.5 text-slate-700">18</span>
              <span className="p-1.5 text-slate-700">19</span>
              <span className="p-1.5 text-slate-700">20</span>
              <span className="p-1.5 text-slate-700">21</span>
              <span className="p-1.5 text-slate-700">22</span>
              <span className="p-1.5 text-slate-700">23</span>
              <span className="p-1.5 text-slate-700">24</span>
              <span className="p-1.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg font-bold">25</span>
              <span className="p-1.5 text-slate-700">26</span>
              <span className="p-1.5 text-slate-700">27</span>
              <span className="p-1.5 text-slate-700">28</span>
            </div>

            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Scheduled Events</h3>
              {calendarEvents.map((event) => (
                <div key={event.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{event.title}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      event.type === 'academic' 
                        ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                        : event.type === 'event' 
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-bold text-slate-800">Need Portal Support?</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Our campus IT administrators are active to assist you with login credential issues or portal outages.</p>
            <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Support Desk Live</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
