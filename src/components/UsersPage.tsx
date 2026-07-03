import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, Trash2, CheckCircle2, ShieldCheck, ShieldAlert, Search, Filter, AlertCircle, X, Shield, UserPlus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface UsersPageProps {
  currentUser: User;
  users: User[];
  onApproveUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onChangeUserRole: (userId: string, newRole: UserRole) => void;
  onAddUser: (newUser: User & { password?: string }, extraData: any) => void;
}

export default function UsersPage({
  currentUser,
  users,
  onApproveUser,
  onDeleteUser,
  onChangeUserRole,
  onAddUser
}: UsersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science');
  const [idNumber, setIdNumber] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('student');
    setDepartment('Computer Science');
    setIdNumber('');
    setContact('');
    setError('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !name || !idNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setError('Email is already registered.');
      return;
    }

    const newUserId = 'u-' + Math.random().toString(36).substr(2, 9);
    
    const newUser: User & { password?: string } = {
      id: newUserId,
      email,
      password,
      name,
      role,
      avatar: role === 'student' 
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      department,
      contact,
      idNumber,
      status: 'approved'
    };

    const extraData = {
      rollNumber: idNumber,
      employeeId: idNumber,
      department,
      contact
    };

    onAddUser(newUser, extraData);
    setSuccess(`Successfully created ${role} account for ${name}!`);
    setIsAdding(false);
    resetForm();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.idNumber && user.idNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'faculty':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'student':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Portal User Accounts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Approve new account registrations, promote roles, and audit access credentials</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            resetForm();
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Create User Account
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl p-4 shadow-sm">
          {success}
        </div>
      )}

      {/* Add User Modal/Form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="h-4.5 w-4.5 text-indigo-600" /> Register New Portal Account & Student/Faculty Record
            </h3>
            <button 
              onClick={() => setIsAdding(false)} 
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nishmith Reddy"
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
                placeholder="e.g. student@scms.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Login Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose portal password"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {role === 'student' ? 'Roll Number / Student ID' : role === 'faculty' ? 'Employee ID' : 'Admin ID'}
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={role === 'student' ? 'e.g. SCMS-STU-301' : role === 'faculty' ? 'e.g. SCMS-FAC-901' : 'e.g. SCMS-ADM-05'}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Contact</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. +1-555-0909"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Create User & Sync Record
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Registers</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{users.length} accounts</h3>
          </div>
          <Users className="h-8 w-8 text-blue-500/20" />
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Pending Approvals</span>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {users.filter(u => u.status === 'pending').length} accounts
            </h3>
          </div>
          <ShieldAlert className="h-8 w-8 text-amber-500/20" />
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Approved Logins</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {users.filter(u => u.status === 'approved').length} active
            </h3>
          </div>
          <ShieldCheck className="h-8 w-8 text-emerald-500/20" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, credentials..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
          >
            <option value="All">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* User Accounts list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">User Identity</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Associated Department</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Reg ID Number</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Access Role</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Portal Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-55/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
                          alt={user.name} 
                          className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{user.department || 'All Campus'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600 font-semibold">
                      {user.idNumber || 'SCMS-N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => onChangeUserRole(user.id, e.target.value as UserRole)}
                        disabled={user.id === currentUser.id} // Cannot demote yourself
                        className={`text-[10px] font-bold px-2 py-1 rounded-xl outline-none focus:ring-1 focus:ring-slate-300 border border-slate-200 bg-white font-mono text-center uppercase tracking-wide cursor-pointer ${getRoleBadge(user.role)}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Student</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-100 rounded-full animate-pulse">
                          <AlertCircle className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      {user.status === 'pending' && (
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all cursor-pointer text-[10px] shadow-sm"
                        >
                          Approve Registration
                        </button>
                      )}
                      
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Revoke credentials and delete login account for ${user.name}?`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-100 transition-all cursor-pointer inline-flex items-center"
                          title="Revoke access"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">No registered campus user accounts match search constraints.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
