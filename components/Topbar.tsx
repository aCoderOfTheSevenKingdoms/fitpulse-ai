import React from 'react';
import { Search, Bell, Bookmark, Menu, User } from 'lucide-react';
import { User as UserType } from '../types';

interface TopbarProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  user: UserType;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onProfileClick, user }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <button 
        onClick={onMenuClick}
        className="p-2 mr-4 text-slate-400 hover:text-white lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for workouts, nutrition tips..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center ml-auto gap-2 sm:gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            <Bell className="w-5 h-5" />
        </button>
        
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="text-sm font-medium">Saved</span>
        </button>

        <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>

        <button 
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-sm font-medium text-white">{user.name}</span>
            <span className="text-xs text-slate-400">{user.isPro ? 'Pro Member' : 'Member'}</span>
          </div>
          <div className="relative w-9 h-9 overflow-hidden rounded-full bg-slate-700 ring-2 ring-slate-800">
            <img src={user.avatar} alt="Avatar" className="object-cover w-full h-full" />
          </div>
        </button>
      </div>
    </header>
  );
};