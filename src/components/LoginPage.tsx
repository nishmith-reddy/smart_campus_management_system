import React, { useState } from 'react';
import { User, Student, Faculty, UserRole } from '../types';
import { Shield, BookOpen, GraduationCap, ArrowRight, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  users: (User & { password?: string })[];
  onRegisterUser: (newUser: User & { password?: string }, extraData: any) => void;
}

export default function LoginPage({ onLoginSuccess, users, onRegisterUser }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  
  // Extra fields for registration
  const [department, setDepartment] = useState('Computer Science');
  const [idNumber, setIdNumber] = useState('');
  const [contact, setContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      if (user.status === 'pending') {
        setErrorMessage('Your account is pending administrator approval. Please contact Admin.');
        return;
      }
      onLoginSuccess(user);
    } else {
      setErrorMessage('Invalid email or password. Try the quick-login shortcuts below!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password || !name || !idNumber) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setErrorMessage('Email is already registered.');
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
      status: role === 'admin' ? 'approved' : 'approved' // Set approved by default for quick testability, but notify user
    };

    const extraData = {
      rollNumber: idNumber,
      employeeId: idNumber,
      department,
      contact
    };

    onRegisterUser(newUser, extraData);
    setSuccessMessage('Account registered successfully! You can now log in.');
    setIsRegistering(false);
    
    // Clear registration fields
    setEmail(newUser.email);
    setPassword(password);
  };

  const fillQuickLogin = (rolePreset: 'admin' | 'faculty' | 'student') => {
    if (rolePreset === 'admin') {
      setEmail('admin@scms.com');
      setPassword('admin123');
    } else if (rolePreset === 'faculty') {
      setEmail('faculty@scms.com');
      setPassword('faculty123');
    } else {
      setEmail('student@scms.com');
      setPassword('student123');
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-indigo-950">
            SCMS Portal
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRegistering ? 'Create your account' : 'Sign in to Smart Campus'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:underline"
          >
            {isRegistering ? 'sign in to an existing account' : 'register a new campus account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-4 shadow-xl border border-slate-200/80 rounded-2xl sm:px-10"
        >
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {!isRegistering ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@scms.com"
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nishmith Reddy"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nishmith@gmail.com"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Portal Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {role === 'student' ? 'Roll Number / Student ID' : 'Employee ID'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. SCMS-STU-301' : 'e.g. SCMS-FAC-901'}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone Contact
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +1-555-0909"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all"
                >
                  <UserPlus className="h-4 w-4" /> Register Portal Account
                </button>
              </div>
            </form>
          )}

          {/* Quick Shortcuts */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-1.5 justify-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Quick Sandbox Credentials
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => fillQuickLogin('admin')}
                className="flex flex-col items-center justify-center py-2.5 px-1 border border-slate-200 hover:border-indigo-200 bg-slate-50 rounded-xl hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <Shield className="h-4 w-4 text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-700">Admin</span>
                <span className="text-[9px] text-slate-400 font-mono">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('faculty')}
                className="flex flex-col items-center justify-center py-2.5 px-1 border border-slate-200 hover:border-indigo-200 bg-slate-50 rounded-xl hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <BookOpen className="h-4 w-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-700">Faculty</span>
                <span className="text-[9px] text-slate-400 font-mono">faculty123</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('student')}
                className="flex flex-col items-center justify-center py-2.5 px-1 border border-slate-200 hover:border-indigo-200 bg-slate-50 rounded-xl hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <GraduationCap className="h-4 w-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-700">Student</span>
                <span className="text-[9px] text-slate-400 font-mono">student123</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
