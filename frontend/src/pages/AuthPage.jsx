import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, ArrowRight, Activity, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';
import GoogleLogin from '../components/GoogleLogin';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    // Controlled form state
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        email: '',
        password: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Send data to backend and update user state
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${isLogin ? 'login' : 'register'}`,
            formData,
            { withCredentials: true })
            .then((res) => {
                dispatch(setUser(res.data.user));
                setIsLoading(false);
                navigate("/");
            })
            .catch((err) => {
                alert(err.response.data.message);
                setIsLoading(false);
            })
    };

    const handleForgotPassword = () => {

        if (!formData.email || formData.email.length === 0) {
            alert("Please enter your email");
            return;
        }

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
            {
                email: formData.email
            },
            { withCredentials: true }
        )
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Server Error");
            })

    };

    return (
        <div className="h-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 relative font-sans">
            {/* Background decorative elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Card */}
            <div className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="p-6 pb-0 text-center">
                    <div className="inline-flex items-center justify-center p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-3 shadow-lg shadow-cyan-500/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join FitPulse AI'}
                    </h1>
                    <p className="text-slate-400 text-xs">
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Start your AI-powered fitness journey today'}
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="px-6 mt-4">
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${isLogin
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${!isLogin
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3">

                    {!isLogin && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Name */}
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3">
                                {/* Age */}
                                <div className="relative group flex-1">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="number"
                                        required
                                        placeholder="Age"
                                        min="10" max="100"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>
                                {/* Gender */}
                                <div className="relative group flex-1">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>male</option>
                                        <option>female</option>
                                        <option>other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>

                    {/* Forgot Password Link (Login Only) */}
                    {isLogin && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-3 text-sm"
                    >
                        {isLoading ? (
                            <Activity className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <GoogleLogin />

                </form>
            </div>
        </div>
    );
};

