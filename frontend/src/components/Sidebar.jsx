import React from 'react';
import { Home, Map, Target, BarChart2, ShoppingBag, Activity, X, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/features/userSlice';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/roadmap', label: 'Generate Roadmap', icon: Map },
    { path: '/goals', label: 'Daily Goals', icon: Target },
    { path: '/dashboard', label: 'Progress Dashboard', icon: BarChart2 }
];

export const Sidebar = ({ isOpen, setIsOpen }) => {

    const dispatch = useDispatch();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            FitPulse AI
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-auto lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => `flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-cyan-500/10 text-cyan-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

