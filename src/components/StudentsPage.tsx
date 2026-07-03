import React, { useState } from 'react';
import { User, Student } from '../types';
import { Search, Plus, Trash2, Edit3, UserPlus, Filter, X, Check, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentsPageProps {
  currentUser: User;
  students: Student[];
  onAddStudent: (newStudent: Student, password?: string) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export default function StudentsPage({
  currentUser,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}: StudentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [currentSemester, setCurrentSemester] = useState(1);
  const [cgpa, setCgpa] = useState(0.0);
  const [contact, setContact] = useState('');
  const [admissionYear, setAdmissionYear] = useState(2026);
  const [password, setPassword] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // Filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || student.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rollNumber) return;

    const newStudent: Student = {
      id: 's-' + Math.random().toString(36).substr(2, 9),
      userId: 'u-' + Math.random().toString(36).substr(2, 9), // auto simulated
      name,
      email,
      rollNumber,
      department,
      currentSemester: Number(currentSemester),
      cgpa: Number(cgpa),
      contact,
      admissionYear: Number(admissionYear)
    };

    onAddStudent(newStudent, password);
    setIsAdding(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRollNumber('');
    setDepartment('Computer Science');
    setCurrentSemester(1);
    setCgpa(0.0);
    setContact('');
    setAdmissionYear(2026);
    setPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage and view smart campus students matriculated across all departments</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingStudent(null);
              resetForm();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add New Student
          </button>
        )}
      </div>

      {/* Adding Student Modal Form */}
      {isAdding && isAdmin && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="h-4.5 w-4.5 text-indigo-600" /> Enter New Student Profile Details
            </h3>
            <button onClick={() => setIsAdding(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. johndoe@scms.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll Number / Student ID</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. SCMS-STU-105"
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={currentSemester}
                onChange={(e) => setCurrentSemester(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Starting CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                required
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Admission Year</label>
              <input
                type="number"
                required
                value={admissionYear}
                onChange={(e) => setAdmissionYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1-555-0909"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Portal Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Defaults to student123"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Create Student Account & Ledger
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Editing Student Form */}
      {editingStudent && isAdmin && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Edit3 className="h-4.5 w-4.5 text-indigo-600" /> Modify Student academic Details: {editingStudent.name}
            </h3>
            <button onClick={() => setEditingStudent(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Name</label>
              <input
                type="text"
                required
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={editingStudent.rollNumber}
                onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <select
                value={editingStudent.department}
                onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={editingStudent.currentSemester}
                onChange={(e) => setEditingStudent({ ...editingStudent, currentSemester: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                required
                value={editingStudent.cgpa}
                onChange={(e) => setEditingStudent({ ...editingStudent, cgpa: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone</label>
              <input
                type="text"
                value={editingStudent.contact}
                onChange={(e) => setEditingStudent({ ...editingStudent, contact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Check className="h-4 w-4" /> Save Profile Edits
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, roll, email..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll & Semester</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Academics (CGPA)</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                {isAdmin && <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-100">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-mono font-bold text-slate-700">{student.rollNumber}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Semester {student.currentSemester}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-slate-800">{student.cgpa.toFixed(2)}</span>
                        {/* Little progress bar to represent CGPA */}
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden md:block">
                          <div 
                            className={`h-full rounded-full ${student.cgpa >= 3.5 ? 'bg-emerald-500' : student.cgpa >= 3.0 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${(student.cgpa / 4.0) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5">scale / 4.0</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-mono">
                      {student.contact || 'N/A'}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setIsAdding(false);
                          }}
                          className="p-1.5 bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center"
                          title="Edit Student Info"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${student.name}'s academic profile?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-100 hover:bg-rose-100 transition-all cursor-pointer inline-flex items-center"
                          title="Delete Profile"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center py-10 text-sm text-slate-400">
                    No matching student listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
