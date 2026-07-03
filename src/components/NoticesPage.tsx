import React, { useState } from 'react';
import { User, Notice } from '../types';
import { Megaphone, Plus, Trash2, Calendar, UserCheck, X, MegaphoneOff, Tag, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface NoticesPageProps {
  currentUser: User;
  notices: Notice[];
  onAddNotice: (newNotice: Notice) => void;
  onDeleteNotice: (noticeId: string) => void;
}

export default function NoticesPage({
  currentUser,
  notices,
  onAddNotice,
  onDeleteNotice
}: NoticesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'exam' | 'event' | 'general'>('general');

  const isAdmin = currentUser.role === 'admin';

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNotice: Notice = {
      id: 'not-' + Math.random().toString(36).substr(2, 9),
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name
    };

    onAddNotice(newNotice);
    setIsAdding(false);
    setTitle('');
    setContent('');
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Campus Notices & Bulletins</h1>
          <p className="text-xs text-slate-400 mt-0.5">Stay updated with official bulletins, exam alerts, and events</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Post New Announcement
          </button>
        )}
      </div>

      {/* Draft New Announcement Form (ADMIN ONLY) */}
      {isAdding && isAdmin && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Megaphone className="h-4.5 w-4.5 text-indigo-600" /> Draft Announcement Bulletin
            </h3>
            <button onClick={() => setIsAdding(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handlePublishNotice} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Notice Heading / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. End Semester Schedule Release"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="general">General Campus Notice</option>
                <option value="academic">Academic / Syllabus Bulletin</option>
                <option value="exam">Official Examination Alert</option>
                <option value="event">Sports / Hackathon / Events</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Announcement Body Description</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Type absolute details, guidelines, venue links, and dates..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Publish Notice Bulletin
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter notice board */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
          >
            <option value="All">All Categories</option>
            <option value="academic">Academic Board</option>
            <option value="exam">Examination Alert</option>
            <option value="event">Sports & Campus Events</option>
            <option value="general">General Notices</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-300 transition-all flex flex-col justify-between relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                    notice.category === 'exam' 
                      ? 'bg-rose-50 text-rose-600 border-rose-100' 
                      : notice.category === 'event'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : notice.category === 'academic'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {notice.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {notice.date}
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to retract the announcement "${notice.title}"?`)) {
                            onDeleteNotice(notice.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-md font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <UserCheck className="h-4 w-4 text-slate-400" />
                <span>Publisher: {notice.author}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <MegaphoneOff className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <span>No notices or general announcements found on the board.</span>
          </div>
        )}
      </div>
    </div>
  );
}
