import React, { useState } from 'react';
import { Lock, ArrowRight, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {useSelector} from "react-redux";
import {showSuccess, showError, showInfo} from '../utils/toast';
import logger from '../utils/logger';

const ResetPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.user || {});
    const { token } = useParams();

    const handleInputChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 8) {
            showError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        // Send backend request for password reset
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
            {
                newPassword: passwords.newPassword
            },
            { withCredentials: true }
        )
            .then((res) => {
                setIsLoading(false);
                setSuccess(true);
                showSuccess(res?.data?.message || "Password reset successful");
            })
            .catch((err) => {
                setIsLoading(false);
                logger.error(`[PASSWORD RESER ERROR] ${err.response?.data?.message}`);
                showError(err.response?.data?.message || "Something went wrong");
            })
    };

    const handleCancel = () => {
        navigate('/auth');
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
                {/* Background decorative elements */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden text-center p-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
                    <p className="text-slate-400 mb-6">Your password has been successfully updated.</p>
                    <button
                        onClick={(isAuthenticated) => (isAuthenticated) ? navigate('/') : navigate('/auth')}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
                    >
                        {isAuthenticated 
                           ? "Go To Home"
                           : "Back To Login" 
                        }
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decorative elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Card */}
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="p-8 pb-0 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/20">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400 text-sm">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">

                    {/* New Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="New Password"
                            value={passwords.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="Confirm New Password"
                            value={passwords.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all border border-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Submit
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

