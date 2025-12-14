import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, ArrowRight, Activity, Users } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        // SCENARIO 1: Sign In (Default specific user)
        const defaultUser: UserType = {
          name: 'Anunay Sharma',
          email: 'anunay63@gmail.com',
          location: 'New Delhi',
          bio: 'Fitness enthusiast ready to crush goals.',
          avatar: 'https://ui-avatars.com/api/?name=Anunay+Sharma&background=0D8ABC&color=fff',
          memberSince: 'October 2023',
          isPro: true,
          isNewUser: false,
          hasHistory: true
        };
        onLogin(defaultUser);
      } else {
        // SCENARIO 2: Sign Up (Use form data)
        const newUser: UserType = {
          name: formData.name,
          email: formData.email,
          location: 'Global Member', // Default for new users since form doesn't ask location
          bio: 'I am ready to start my fitness journey with FitPulse AI.',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          isPro: false, // New users start as free tier
          isNewUser: true, // Mark as new user to trigger empty states
          hasHistory: false // No history for new users
        };
        onLogin(newUser);
      }
    }, 1000);
  };

  const handleForgotPassword = () => {
    // In a real app, this would trigger an email
    alert("Redirecting to reset password via email...");
  };

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
             <h1 className="text-2xl font-bold text-white mb-2">
               {isLogin ? 'Welcome Back' : 'Join FitPulse AI'}
             </h1>
             <p className="text-slate-400 text-sm">
               {isLogin 
                 ? 'Enter your credentials to access your account' 
                 : 'Start your AI-powered fitness journey today'}
             </p>
          </div>

          {/* Toggle Switch */}
          <div className="px-8 mt-6">
             <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isLogin 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
             
             {!isLogin && (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                 {/* Name */}
                 <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    />
                 </div>

                 <div className="flex gap-4">
                    {/* Age */}
                    <div className="relative group flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                          type="number" 
                          required
                          placeholder="Age"
                          min="10" max="100"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                    {/* Gender */}
                    <div className="relative group flex-1">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <select 
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                           <option>Male</option>
                           <option>Female</option>
                           <option>Other</option>
                        </select>
                    </div>
                 </div>
               </div>
             )}

             {/* Email */}
             <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
             </div>

             {/* Password */}
             <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
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

             {/* Submit Button */}
             <button 
               type="submit"
               disabled={isLoading}
               className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
             >
               {isLoading ? (
                 <Activity className="w-5 h-5 animate-spin" />
               ) : (
                 <>
                   {isLogin ? 'Sign In' : 'Create Account'}
                   <ArrowRight className="w-4 h-4" />
                 </>
               )}
             </button>

          </form>
       </div>
    </div>
  );
};