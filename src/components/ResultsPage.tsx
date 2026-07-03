import React, { useState } from 'react';
import { User, Student, Course, Result } from '../types';
import { FileSpreadsheet, Plus, Trash2, Award, BookOpen, AlertCircle, Check, X, ClipboardCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsPageProps {
  currentUser: User;
  students: Student[];
  courses: Course[];
  results: Result[];
  onAddResult: (newResult: Result) => void;
  onDeleteResult: (resultId: string) => void;
}

export default function ResultsPage({
  currentUser,
  students,
  courses,
  results,
  onAddResult,
  onDeleteResult
}: ResultsPageProps) {
  const isFaculty = currentUser.role === 'faculty';
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';

  const [isAddingResult, setIsAddingResult] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [examType, setExamType] = useState<'Midterm' | 'Final Exam' | 'Practical' | 'Assignment Project'>('Midterm');
  const [marksObtained, setMarksObtained] = useState(80);
  const [maxMarks, setMaxMarks] = useState(100);
  const [remarks, setRemarks] = useState('');

  const currentStudent = isStudent ? students.find(s => s.email === currentUser.email) : null;

  // Calculate grade letters
  const calculateGrade = (score: number, total: number) => {
    const percent = (score / total) * 100;
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B+';
    if (percent >= 60) return 'B';
    if (percent >= 50) return 'C';
    return 'F';
  };

  const handlePublishResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) return;

    const computedGrade = calculateGrade(marksObtained, maxMarks);

    const newResult: Result = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      studentId,
      courseId,
      examType,
      marksObtained: Number(marksObtained),
      maxMarks: Number(maxMarks),
      grade: computedGrade,
      remarks
    };

    onAddResult(newResult);
    setIsAddingResult(false);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Grade Book & Results</h1>
          <p className="text-xs text-slate-400 mt-0.5">Publish academic scores and view student transcripts</p>
        </div>
        
        {(isFaculty || isAdmin) && (
          <button
            onClick={() => setIsAddingResult(!isAddingResult)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Publish Exam Result
          </button>
        )}
      </div>

      {/* Publish Grade Result Form */}
      {isAddingResult && (isFaculty || isAdmin) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-indigo-600" /> Grade Entry Panel
            </h3>
            <button onClick={() => setIsAddingResult(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handlePublishResult} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assessment Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              >
                <option value="Midterm">Midterm Examination</option>
                <option value="Final Exam">Final Theory Exam</option>
                <option value="Practical">Practical / Laboratory Exam</option>
                <option value="Assignment Project">Assignment / Project Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Marks Obtained</label>
              <input
                type="number"
                min="0"
                max={maxMarks}
                required
                value={marksObtained}
                onChange={(e) => setMarksObtained(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Maximum Marks</label>
              <input
                type="number"
                min="10"
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prof. Grading Comments</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Good analytical logic..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              />
            </div>

            <div className="flex items-end md:col-span-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Publish Grade Result
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STUDENT PERSONAL REPORT CARD VIEW */}
      {isStudent && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-2.5 rounded-xl">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-md font-bold text-slate-800">Official Campus Report Card</h2>
                <p className="text-xs text-slate-400 font-mono">Student ID: {currentStudent?.rollNumber} • Semester {currentStudent?.currentSemester}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center self-start sm:self-auto">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Academic CGPA</span>
              <span className="text-xl font-mono font-bold text-emerald-600">{currentStudent?.cgpa.toFixed(2)} / 4.0</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Gradesheet</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="py-2.5 font-bold uppercase tracking-wider">Course Code</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Course Name</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Evaluation Assessment</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Marks Obtained</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Syllabus Grade</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Feedback / remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {results.filter(r => r.studentId === currentStudent?.id).length > 0 ? (
                    results.filter(r => r.studentId === currentStudent?.id).map(r => {
                      const course = courses.find(c => c.id === r.courseId);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-indigo-600">{course?.code}</td>
                          <td className="py-3 font-semibold text-slate-800">{course?.name}</td>
                          <td className="py-3 text-slate-500">{r.examType}</td>
                          <td className="py-3 font-mono font-bold">{r.marksObtained} / {r.maxMarks}</td>
                          <td className="py-3">
                            <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                              r.grade.startsWith('A') 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : r.grade.startsWith('B')
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                            }`}>
                              {r.grade}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 italic font-medium">"{r.remarks || 'Excellent'}"</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-slate-400 italic text-center">No exam results published for your courses yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY / ADMIN CUMULATIVE TRANSCRIPT VIEW */}
      {(isFaculty || isAdmin) && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardCheck className="h-4.5 w-4.5 text-indigo-600" /> Published Campus Score sheets
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Student Name</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Exam Type</th>
                  <th className="px-4 py-3 font-mono font-bold uppercase tracking-wider">Marks Obtained</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Grade Comments</th>
                  {isAdmin && <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {results.length > 0 ? (
                   results.map((r) => {
                    const student = students.find(s => s.id === r.studentId);
                    const course = courses.find(c => c.id === r.courseId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{student?.name || 'Deleted student'}</td>
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">{course?.code || 'Deleted course'}</td>
                        <td className="px-4 py-3 text-slate-500">{r.examType}</td>
                        <td className="px-4 py-3 font-mono font-bold">{r.marksObtained} / {r.maxMarks}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            r.grade.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          }`}>
                            {r.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 italic max-w-xs truncate">"{r.remarks || 'None'}"</td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Permanently remove this score sheet from the gradebook?')) {
                                  onDeleteResult(r.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                              title="Delete result record"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400 italic">No score sheets recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
