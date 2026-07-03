import React, { useState } from 'react';
import { User, Student, Course, Attendance } from '../types';
import { CalendarDays, Check, X, ShieldAlert, Sparkles, Filter, CheckSquare, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface AttendancePageProps {
  currentUser: User;
  students: Student[];
  courses: Course[];
  attendance: Attendance[];
  onSaveAttendance: (newLogs: Attendance[]) => void;
}

export default function AttendancePage({
  currentUser,
  students,
  courses,
  attendance,
  onSaveAttendance
}: AttendancePageProps) {
  const isFaculty = currentUser.role === 'faculty';
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';

  // State for faculty entry
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [remarksState, setRemarksState] = useState<{ [studentId: string]: string }>({});

  // Local unsaved roster status
  const [rosterStatus, setRosterStatus] = useState<{ [studentId: string]: 'present' | 'absent' }>({});
  const [logsSaved, setLogsSaved] = useState(false);

  // Student details
  const currentStudent = isStudent ? students.find(s => s.email === currentUser.email) : null;

  // Selected course details
  const activeCourse = courses.find(c => c.id === selectedCourseId);

  // Get enrolled students for selected course department
  const enrolledStudents = activeCourse 
    ? students.filter(s => s.department === activeCourse.department) 
    : [];

  // Handle Faculty Roster toggle
  const handleToggleStatus = (studentId: string, status: 'present' | 'absent') => {
    setRosterStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
    setLogsSaved(false);
  };

  const handleSaveAttendance = () => {
    if (!selectedCourseId) return;
    
    const newLogs: Attendance[] = enrolledStudents.map(student => {
      const status = rosterStatus[student.id] || 'present'; // Default to present
      return {
        id: 'att-' + Math.random().toString(36).substr(2, 9),
        studentId: student.id,
        courseId: selectedCourseId,
        date: attendanceDate,
        status,
        remarks: remarksState[student.id] || ''
      };
    });

    onSaveAttendance(newLogs);
    setLogsSaved(true);
    setTimeout(() => setLogsSaved(false), 3000);
  };

  // Student: calculate attendance metrics
  const getStudentAttendanceMetrics = () => {
    if (!currentStudent) return [];

    return courses.filter(c => c.department === currentStudent.department).map(course => {
      const courseLogs = attendance.filter(log => log.studentId === currentStudent.id && log.courseId === course.id);
      const presents = courseLogs.filter(log => log.status === 'present').length;
      const total = courseLogs.length;
      const rate = total > 0 ? Math.round((presents / total) * 100) : 100; // default 100% if no logs yet

      return {
        courseCode: course.code,
        courseName: course.name,
        presents,
        total,
        rate,
        logs: courseLogs
      };
    });
  };

  const studentMetrics = getStudentAttendanceMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Logs</h1>
        <p className="text-xs text-slate-400 mt-0.5">Faculty recording dashboard & student attendance percentage calculators</p>
      </div>

      {/* FACULTY / ADMIN INTERACTIVE ATTENDANCE PANEL */}
      {(isFaculty || isAdmin) && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Roster Attendance Roll Call</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setRosterStatus({});
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Student attendance list for marking */}
          <div className="space-y-3">
            {enrolledStudents.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider">
                  <span>Student Name</span>
                  <span className="text-right mr-8">Attendance Status</span>
                </div>

                {enrolledStudents.map((student) => {
                  const currentStatus = rosterStatus[student.id] || 'present';
                  return (
                    <div key={student.id} className="p-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8.5 w-8.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 rounded-lg flex items-center justify-center text-xs">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-850">{student.name}</div>
                          <div className="text-[10px] text-slate-450 font-mono">{student.rollNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Excuses / remarks..."
                          value={remarksState[student.id] || ''}
                          onChange={(e) => setRemarksState({ ...remarksState, [student.id]: e.target.value })}
                          className="px-2.5 py-1 text-[10px] bg-white border border-slate-200 rounded-lg text-slate-750 w-32 focus:outline-none focus:border-indigo-500 hidden md:block placeholder-slate-400"
                        />

                        <div className="flex gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'present')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'absent')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-rose-600'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 font-medium">
                    Marking {enrolledStudents.length} students for course {activeCourse?.code} on date {attendanceDate}.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {logsSaved && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="h-4 w-4" /> Saved successfully
                      </span>
                    )}
                    <button
                      onClick={handleSaveAttendance}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Save Attendance Logs
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 italic">
                No students enrolled in department "{activeCourse?.department}" of the catalog course.
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT PERSONAL ATTENDANCE OVERVIEW PAGE */}
      {isStudent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studentMetrics.map(metric => (
              <div key={metric.courseCode} className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase tracking-wider">{metric.courseCode}</span>
                  <h3 className="font-bold text-slate-800 text-sm">{metric.courseName}</h3>
                  <p className="text-xs text-slate-500">Presents: {metric.presents} / {metric.total} sessions logged</p>
                </div>

                {/* Circular Percentage visual indicator */}
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="26" 
                      stroke={metric.rate >= 80 ? '#10b981' : metric.rate >= 75 ? '#6366f1' : '#f43f5e'} 
                      strokeWidth="4.5" 
                      fill="transparent" 
                      strokeDasharray="163.3"
                      strokeDashoffset={163.3 - (163.3 * metric.rate) / 100}
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-slate-800">{metric.rate}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Student historical log calendar detail list */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-indigo-600" /> Historical Attendance Logs
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead>
                  <tr className="text-slate-400">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Course Code</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Remarks / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-750">
                  {attendance.filter(log => log.studentId === currentStudent?.id).length > 0 ? (
                    attendance.filter(log => log.studentId === currentStudent?.id).map((log) => {
                      const course = courses.find(c => c.id === log.courseId);
                      return (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-500">{log.date}</td>
                          <td className="py-3 font-semibold text-slate-800">{course?.code}</td>
                          <td className="py-3">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                              log.status === 'present' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                                : 'bg-rose-50 text-rose-700 border-rose-150'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 italic">"{log.remarks || 'None'}"</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-slate-450 italic text-center">No attendance sessions logged for your courses yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
