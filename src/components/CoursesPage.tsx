import React, { useState } from 'react';
import { User, Student, Faculty, Course, Assignment, Submission } from '../types';
import { BookOpen, Plus, Trash2, Calendar, ClipboardList, Send, FileCheck, CheckCircle2, AlertCircle, Eye, RefreshCw, X, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface CoursesPageProps {
  currentUser: User;
  courses: Course[];
  faculty: Faculty[];
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddAssignment: (newAsg: Assignment) => void;
  onAddSubmission: (newSub: Submission) => void;
  onGradeSubmission: (subId: string, points: number, remarks: string) => void;
}

export default function CoursesPage({
  currentUser,
  courses,
  faculty,
  students,
  assignments,
  submissions,
  onAddCourse,
  onDeleteCourse,
  onAddAssignment,
  onAddSubmission,
  onGradeSubmission
}: CoursesPageProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingAsg, setIsAddingAsg] = useState(false);
  const [activeSubView, setActiveSubView] = useState<string | null>(null); // Assignment ID to show submissions for

  // Student submit state
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  // Grading state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [pointsObtained, setPointsObtained] = useState<number>(100);
  const [gradeRemarks, setGradeRemarks] = useState('');

  // New Course State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(4);
  const [syllabus, setSyllabus] = useState('');
  const [assignedFacultyId, setAssignedFacultyId] = useState(faculty[0]?.id || '');

  // New Assignment State
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('');
  const [asgMaxPoints, setAsgMaxPoints] = useState(100);

  const isAdmin = currentUser.role === 'admin';
  const isFaculty = currentUser.role === 'faculty';
  const isStudent = currentUser.role === 'student';

  const currentStudent = isStudent ? students.find(s => s.email === currentUser.email) : null;
  const currentFaculty = isFaculty ? faculty.find(f => f.email === currentUser.email) : null;

  // Handles adding new course
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newCourse: Course = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      code,
      name,
      department,
      credits: Number(credits),
      semester: Number(semester),
      syllabus,
      facultyId: assignedFacultyId
    };

    onAddCourse(newCourse);
    setIsAddingCourse(false);
    setSelectedCourse(newCourse);
    setCode('');
    setName('');
    setSyllabus('');
  };

  // Handles adding new assignment/task
  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !currentFaculty || !asgTitle) return;

    const newAsg: Assignment = {
      id: 'asg-' + Math.random().toString(36).substr(2, 9),
      title: asgTitle,
      description: asgDesc,
      courseId: selectedCourse.id,
      dueDate: asgDueDate || '2026-07-15',
      maxPoints: Number(asgMaxPoints),
      createdBy: currentFaculty.id
    };

    onAddAssignment(newAsg);
    setIsAddingAsg(false);
    setAsgTitle('');
    setAsgDesc('');
    setAsgDueDate('');
  };

  // Handles student submitting their task response
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAsgId || !currentStudent || !submissionContent) return;

    const newSub: Submission = {
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      assignmentId: submittingAsgId,
      studentId: currentStudent.id,
      submissionDate: new Date().toISOString().split('T')[0],
      content: submissionContent,
      status: 'submitted'
    };

    onAddSubmission(newSub);
    setSubmittingAsgId(null);
    setSubmissionContent('');
  };

  // Handles faculty grading student submission
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;

    onGradeSubmission(gradingSubId, pointsObtained, gradeRemarks);
    setGradingSubId(null);
    setGradeRemarks('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Syllabus & Tasks</h1>
          <p className="text-xs text-slate-400 mt-0.5">Explore courses, submit responses, and record grades</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddingCourse(!isAddingCourse)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create New Course
          </button>
        )}
      </div>

      {/* Add Course Form */}
      {isAddingCourse && isAdmin && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-600" /> Enter Course Information
            </h3>
            <button onClick={() => setIsAddingCourse(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleAddCourseSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS201"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Data Structures"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Syllabus Credits</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instructing Professor</label>
              <select
                value={assignedFacultyId}
                onChange={(e) => setAssignedFacultyId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                {faculty.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name} ({fac.department})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Syllabus Curriculum Summary</label>
              <textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                rows={3}
                placeholder="Describe key topics and grading parameters..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Create Course Record
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course List Selector (Left) */}
        <div className="space-y-3.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Catalogue</h2>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {courses.map((course) => {
              const assignedFac = faculty.find(f => f.id === course.facultyId);
              const isSelected = selectedCourse?.id === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsAddingAsg(false);
                    setActiveSubView(null);
                    setSubmittingAsgId(null);
                    setGradingSubId(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-indigo-600">{course.code}</span>
                    <span className="text-[10px] text-slate-450 font-semibold">Sem {course.semester} • {course.credits} Cr</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{course.name}</h3>
                  <p className="text-[10px] text-slate-500 truncate mt-1.5">Instructor: {assignedFac?.name || 'Unassigned'}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Course Details Panel (Middle & Right) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourse ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Header Details */}
              <div className="flex justify-between items-start gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 font-mono uppercase">
                    {selectedCourse.code} • Semester {selectedCourse.semester}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">{selectedCourse.name}</h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Assigned Professor: {faculty.find(f => f.id === selectedCourse.facultyId)?.name || 'N/A'}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove course ${selectedCourse.code} completely?`)) {
                        onDeleteCourse(selectedCourse.id);
                        setSelectedCourse(courses[0] || null);
                      }
                    }}
                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                    title="Delete Course Catalogue Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Syllabus curriculum info */}
              <div className="py-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Syllabus Overview</h3>
                <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  {selectedCourse.syllabus || 'No syllabus provided for this semester catalogue item.'}
                </p>
              </div>

              {/* Assignments / Tasks list */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-indigo-600" /> Dynamic Tasks & Homework
                  </h3>
                  
                  {isFaculty && currentFaculty?.id === selectedCourse.facultyId && (
                    <button
                      onClick={() => setIsAddingAsg(!isAddingAsg)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {isAddingAsg ? 'Cancel Task' : 'Assign New Task'}
                    </button>
                  )}
                </div>

                {/* Adding Assignment Form (FACULTY) */}
                {isAddingAsg && isFaculty && (
                  <motion.form 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleAddAssignmentSubmit} 
                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-4 space-y-3.5"
                  >
                    <div className="text-xs font-bold text-slate-800">New Homework Specification</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={asgTitle}
                        onChange={(e) => setAsgTitle(e.target.value)}
                        placeholder="Task Title (e.g. Lab Project 1)"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                      />
                      <input
                        type="date"
                        required
                        value={asgDueDate}
                        onChange={(e) => setAsgDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <textarea
                        required
                        value={asgDesc}
                        onChange={(e) => setAsgDesc(e.target.value)}
                        rows={2}
                        placeholder="Task description & guidelines..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Max points:</span>
                        <input
                          type="number"
                          value={asgMaxPoints}
                          onChange={(e) => setAsgMaxPoints(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-800 text-xs font-bold font-mono text-center"
                        />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl self-end transition-all cursor-pointer">
                        Publish Task
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Roster of Assignments */}
                <div className="space-y-3">
                  {assignments.filter(asg => asg.courseId === selectedCourse.id).length > 0 ? (
                    assignments.filter(asg => asg.courseId === selectedCourse.id).map(asg => {
                      // Find student submission if logged in
                      const studentSub = currentStudent 
                        ? submissions.find(s => s.assignmentId === asg.id && s.studentId === currentStudent.id)
                        : null;
                      
                      const courseSubs = submissions.filter(s => s.assignmentId === asg.id);

                      return (
                        <div key={asg.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl relative">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h4 className="font-bold text-slate-850 text-sm">{asg.title}</h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400" /> Due: {asg.dueDate} • {asg.maxPoints} pts max
                              </p>
                            </div>

                            {/* Status label / controls */}
                            {isStudent && (
                              <div>
                                {studentSub ? (
                                  studentSub.status === 'graded' ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded">
                                      Graded: {studentSub.pointsObtained} / {asg.maxPoints}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-50 text-yellow-750 border border-yellow-150 rounded">
                                      Submitted (Pending Score)
                                    </span>
                                  )
                                ) : (
                                  <button
                                    onClick={() => setSubmittingAsgId(asg.id)}
                                    className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <Send className="h-3 w-3" /> Submit Work
                                  </button>
                                )}
                              </div>
                            )}

                            {isFaculty && currentFaculty?.id === selectedCourse.facultyId && (
                              <button
                                onClick={() => {
                                  setActiveSubView(activeSubView === asg.id ? null : asg.id);
                                  setGradingSubId(null);
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" /> Submissions ({courseSubs.length})
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{asg.description}</p>

                          {/* Student submission grading details summary if already graded */}
                          {isStudent && studentSub && studentSub.status === 'graded' && (
                            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-850">
                              <span className="font-bold text-emerald-700 flex items-center gap-1 mb-0.5">
                                <Award className="h-3.5 w-3.5" /> Prof Feedback:
                              </span>
                              <p className="text-slate-600 italic">"{studentSub.gradeRemarks || 'No commentary entered.'}"</p>
                            </div>
                          )}

                          {/* Student submit response area */}
                          {submittingAsgId === asg.id && isStudent && (
                            <motion.form 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              onSubmit={handleStudentSubmit} 
                              className="mt-4 p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-3"
                            >
                              <div className="text-xs font-semibold text-slate-700">Submit Deliverables & Notes</div>
                              <textarea
                                required
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                rows={2.5}
                                placeholder="Paste your GitHub repository, Google Doc, or explain your assignment answers..."
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-850 text-xs focus:outline-none focus:border-indigo-500"
                              />
                              <div className="flex gap-2 justify-end">
                                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded cursor-pointer">
                                  Confirm Submission
                                </button>
                                <button type="button" onClick={() => setSubmittingAsgId(null)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded cursor-pointer hover:bg-slate-50">
                                  Cancel
                                </button>
                              </div>
                            </motion.form>
                          )}

                          {/* Active Submissions List (FACULTY REVIEW COMPONENT) */}
                          {activeSubView === asg.id && isFaculty && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 border-t border-slate-200 pt-4 space-y-3"
                            >
                              <div className="text-xs font-bold text-slate-700">Student Submission Dashboard</div>
                              {courseSubs.length > 0 ? (
                                <div className="space-y-3">
                                  {courseSubs.map(sub => {
                                    const subStudent = students.find(s => s.id === sub.studentId);
                                    return (
                                      <div key={sub.id} className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                          <div>
                                            <span className="font-bold text-slate-800">{subStudent?.name || 'Unknown Student'}</span>
                                            <span className="text-slate-400 ml-2 font-medium">submitted {sub.submissionDate}</span>
                                          </div>
                                          
                                          {sub.status === 'graded' ? (
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                                              Score: {sub.pointsObtained} / {asg.maxPoints}
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                setGradingSubId(sub.id);
                                                setPointsObtained(asg.maxPoints);
                                              }}
                                              className="px-2 py-0.5 bg-amber-600 hover:bg-amber-750 text-white text-[10px] font-bold rounded cursor-pointer"
                                            >
                                              Enter Grade / Feedback
                                            </button>
                                          )}
                                        </div>

                                        <p className="text-xs text-slate-750 bg-slate-50 p-2 rounded border border-slate-100 font-mono text-[11px] whitespace-pre-wrap">{sub.content}</p>

                                        {sub.status === 'graded' && sub.gradeRemarks && (
                                          <div className="text-[11px] text-slate-500">
                                            <span className="font-bold text-slate-400">Comments:</span> "{sub.gradeRemarks}"
                                          </div>
                                        )}

                                        {/* Live Grading Form popover */}
                                        {gradingSubId === sub.id && (
                                          <motion.form 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            onSubmit={handleGradeSubmit} 
                                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3 mt-2"
                                          >
                                            <div className="text-[11px] font-bold text-slate-700">Grade Form for {subStudent?.name}</div>
                                            <div className="flex items-center gap-4 text-xs">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-slate-450 font-medium">Points:</span>
                                                <input
                                                  type="number"
                                                  max={asg.maxPoints}
                                                  min={0}
                                                  required
                                                  value={pointsObtained}
                                                  onChange={(e) => setPointsObtained(Number(e.target.value))}
                                                  className="w-16 p-1 bg-white border border-slate-200 rounded text-slate-800 font-bold font-mono text-center"
                                                />
                                                <span className="text-slate-500">/ {asg.maxPoints}</span>
                                              </div>
                                            </div>
                                            <div>
                                              <input
                                                type="text"
                                                required
                                                placeholder="Enter grading remarks or critical tips..."
                                                value={gradeRemarks}
                                                onChange={(e) => setGradeRemarks(e.target.value)}
                                                className="w-full p-2 bg-white border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                                              />
                                            </div>
                                            <div className="flex justify-end gap-1.5">
                                              <button type="submit" className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded cursor-pointer hover:bg-emerald-700">
                                                Post Grade
                                              </button>
                                              <button type="button" onClick={() => setGradingSubId(null)} className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] rounded cursor-pointer hover:bg-slate-50 font-bold">
                                                Cancel
                                              </button>
                                            </div>
                                          </motion.form>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-[11px] text-slate-400 italic">No students have submitted deliverables yet.</div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 italic">No homework tasks assigned yet.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-sm text-slate-450 bg-white border border-slate-200 rounded-3xl shadow-sm">
              Please click a course card in the catalogue on the left side menu to review dynamic material.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
