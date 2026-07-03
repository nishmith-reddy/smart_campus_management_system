import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Phone, ShieldCheck, KeyRound, Check, Award, Building, Compass, Notebook } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfilePageProps {
  currentUser: User;
  onUpdateProfile: (updatedProfile: any) => void;
}

export default function ProfilePage({ currentUser, onUpdateProfile }: ProfilePageProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [contact, setContact] = useState(currentUser.contact || '');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science');
  const [idNumber, setIdNumber] = useState(currentUser.idNumber || '');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      contact,
      department,
      idNumber
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    // Simulate password change success
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const getRoleHeader = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'Campus Master Administrator';
      case 'faculty':
        return 'Active Faculty Member & Research Advisor';
      case 'student':
        return 'Matriculated Undergraduate Student';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Campus Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Customize your personal profile options and credentials securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
                alt={currentUser.name} 
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm mb-4 group-hover:scale-105 transition-transform"
              />

              <h2 className="font-extrabold text-slate-800 text-lg">{currentUser.name}</h2>
              <span className="text-xs text-indigo-600 font-mono mt-1 font-bold bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">{currentUser.role}</span>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">{getRoleHeader()}</p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 text-left space-y-3.5 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-slate-400" />
                <span>Department: {currentUser.department || 'Administration'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Compass className="h-4 w-4 text-slate-400" />
                <span>ID Number: {currentUser.idNumber || 'SCMS-ADM-01'}</span>
              </div>
              {currentUser.contact && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{currentUser.contact}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center relative shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 justify-center">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" /> Security Clearances
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Multi-factor authorization is active. Your smart campus credentials are encrypted with secure hashes.</p>
          </div>
        </div>

        {/* Edit Form (Middle & Right) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserIcon className="h-4.5 w-4.5 text-indigo-600" /> Update Account Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+1-555-0909"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-4 w-4" /> Personal info updated!
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <KeyRound className="h-4.5 w-4.5 text-indigo-600" /> Change Security Password
            </h3>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">New Secure Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {passwordSuccess ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-4 w-4" /> Credentials password reset successfully!
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
