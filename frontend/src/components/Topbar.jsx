import React from 'react';
import { Search, Bell, Bookmark, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DefaultAvatar } from './DefaultAvatar';

export const Topbar = ({ onMenuClick, user }) => {

    const {avatarUrl} = useSelector((state) => state.user);

    return (
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            <button
                onClick={() => onMenuClick?.()}
                className="p-2 mr-4 text-slate-400 hover:text-white lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Right Actions */}
            <div className="flex items-center ml-auto gap-2 sm:gap-4">

                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-sm font-medium">Saved</span>
                </button>

                <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>

                <Link
                    to="/profile"
                    className="flex items-center gap-3 pl-4 rounded-full hover:bg-slate-800 transition-colors"
                >
                    <div className="flex flex-col text-right hidden md:block">
                        <span className="text-sm font-medium text-white">{user?.name}</span>
                        {/* <span className="text-xs text-slate-400">{user?.isPro ? 'Pro Member' : 'Member'}</span> */}
                    </div>
                    {avatarUrl
                      ? <div className="relative w-9 h-9 overflow-hidden rounded-full bg-slate-700 ring-2 ring-slate-800">
                        <img src={user?.avatar} alt="Avatar" className="object-cover w-full h-full" />
                      </div>
                     : <DefaultAvatar size={40} />
                    }
                </Link>
            </div>
        </header>
    );
};

