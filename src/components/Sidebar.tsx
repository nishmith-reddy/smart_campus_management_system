import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  BookMarked, 
  CalendarDays, 
  FileSpreadsheet, 
  Wallet, 
  Megaphone, 
  Users, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout,
  collapsed,
  setCollapsed
}: SidebarProps) {
  
  // All potential tabs:
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
    { id: 'students', label: 'Students', icon: GraduationCap, roles: ['admin', 'faculty', 'student'] },
    { id: 'faculty', label: 'Faculty', icon: BookOpen, roles: ['admin', 'faculty', 'student'] },
    { id: 'courses', label: 'Courses', icon: BookMarked, roles: ['admin', 'faculty', 'student'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarDays, roles: ['admin', 'faculty', 'student'] },
    { id: 'results', label: 'Results & Grades', icon: FileSpreadsheet, roles: ['admin', 'faculty', 'student'] },
    { id: 'fees', label: 'Fees & Invoices', icon: Wallet, roles: ['admin', 'faculty', 'student'] },
    { id: 'notices', label: 'Notice Board', icon: Megaphone, roles: ['admin', 'faculty', 'student'] },
    { id: 'users', label: 'User Database', icon: Users, roles: ['admin'] }, // Admin only!
    { id: 'profile', label: 'My Profile', icon: UserIcon, roles: ['admin', 'faculty', 'student'] },
  ];

  const allowedItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-500/25 text-rose-200 border-rose-500/45';
      case 'faculty':
        return 'bg-emerald-500/25 text-emerald-200 border-emerald-500/45';
      case 'student':
        return 'bg-blue-500/25 text-blue-200 border-blue-500/45';
      default:
        return 'bg-slate-500/25 text-slate-200 border-slate-500/45';
    }
  };

  return (
    <div 
      className={`bg-indigo-950 border-r border-indigo-900 flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-indigo-900/80">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-1.5 rounded-lg shadow-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight text-md">
                Smart Campus
              </span>
            </div>
          ) : (
            <div className="mx-auto bg-gradient-to-tr from-indigo-500 to-blue-500 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-1 rounded-md bg-indigo-900/50 border border-indigo-800 text-indigo-200 hover:text-white transition-colors hover:bg-indigo-800 cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation Menu Items */}
        <nav className="p-3 space-y-1 mt-4">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? 'bg-indigo-800 text-white shadow-sm'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900/50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Micro tooltip / badge for notifications or roles */}
                {isActive && collapsed && (
                  <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Details & Logout */}
      <div className="p-3 border-t border-indigo-900/80">
        {!collapsed ? (
          <div className="p-2.5 rounded-2xl bg-indigo-900/40 border border-indigo-850/50 mb-3 flex items-center gap-3">
            <img 
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
              alt={currentUser.name}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-800"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-white truncate">{currentUser.name}</h4>
              <p className="text-[10px] text-indigo-300 truncate mb-1">{currentUser.email}</p>
              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase border tracking-wider ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <img 
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
              alt={currentUser.name}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-800 cursor-pointer"
              title={`${currentUser.name} (${currentUser.role})`}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 transition-all cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4.5 w-4.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
