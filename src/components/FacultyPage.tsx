import React, { useState } from 'react';
import { User, Faculty } from '../types';
import { Search, Plus, Trash2, Edit3, UserPlus, Filter, X, Check, Mail, Badge, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface FacultyPageProps {
  currentUser: User;
  faculty: Faculty[];
  onAddFaculty: (newFaculty: Faculty) => void;
  onUpdateFaculty: (updatedFaculty: Faculty) => void;
  onDeleteFaculty: (facultyId: string) => void;
}

export default function FacultyPage({
  currentUser,
  faculty,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty
}: FacultyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  // New Faculty State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [specialization, setSpecialization] = useState('');
  const [contact, setContact] = useState('');

  const isAdmin = currentUser.role === 'admin';

  const filteredFaculty = faculty.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fac.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !employeeId) return;

    const newFac: Faculty = {
      id: 'f-' + Math.random().toString(36).substr(2, 9),
      userId: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      employeeId,
      department,
      designation,
      specialization,
      contact
    };

    onAddFaculty(newFac);
    setIsAdding(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    onUpdateFaculty(editingFaculty);
    setEditingFaculty(null);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setEmployeeId('');
    setDepartment('Computer Science');
    setDesignation('Assistant Professor');
    setSpecialization('');
    setContact('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Faculty Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">Faculty researchers, professors, and administrative officers</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingFaculty(null);
              resetForm();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Faculty Member
          </button>
        )}
      </div>

      {/* Add Faculty Form */}
      {isAdding && isAdmin && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="h-4.5 w-4.5 text-indigo-600" /> Register Faculty Profile Details
            </h3>
            <button onClick={() => setIsAdding(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Faculty Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Prof. Jenkins"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jenkins@scms.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. SCMS-FAC-201"
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Head of Department">Head of Department (HOD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Specialization Area</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Cryptography / Neural Networks"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1-555-0211"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Create Faculty Profile
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Edit Faculty Form */}
      {editingFaculty && isAdmin && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Edit3 className="h-4.5 w-4.5 text-indigo-600" /> Modify Faculty Profile: {editingFaculty.name}
            </h3>
            <button onClick={() => setEditingFaculty(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Faculty Name</label>
              <input
                type="text"
                required
                value={editingFaculty.name}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={editingFaculty.email}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={editingFaculty.employeeId}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <select
                value={editingFaculty.department}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
              <select
                value={editingFaculty.designation}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Head of Department">Head of Department (HOD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Specialization</label>
              <input
                type="text"
                value={editingFaculty.specialization}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone</label>
              <input
                type="text"
                value={editingFaculty.contact}
                onChange={(e) => setEditingFaculty({ ...editingFaculty, contact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs"
              />
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Save Faculty Details
              </button>
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, code, skill..."
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

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.length > 0 ? (
          filteredFaculty.map((fac) => (
            <div key={fac.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:border-indigo-300 transition-all flex flex-col justify-between relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-750 rounded-xl flex items-center justify-center font-bold text-md border border-indigo-100">
                      {fac.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{fac.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">{fac.employeeId}</p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingFaculty(fac);
                          setIsAdding(false);
                        }}
                        className="p-1.5 bg-white text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Edit details"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${fac.name}'s professional profile?`)) {
                            onDeleteFaculty(fac.id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Department</span>
                    <span className="font-bold text-slate-700">{fac.department}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Designation</span>
                    <span className="font-bold text-slate-700 text-right">{fac.designation}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Specialization</span>
                    <span className="font-mono text-indigo-600 text-right text-[11px] font-bold">{fac.specialization || 'General Studies'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{fac.email}</span>
                </div>
                {fac.contact && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{fac.contact}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-sm text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            No matching faculty profiles found.
          </div>
        )}
      </div>
    </div>
  );
}
