import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AuthProvider from './src/providers/AuthProvider';
import ProtectedRoute from './src/routes/ProtectedRoute';
import PublicRoute from './src/routes/PublicRoute';
import { Sidebar } from './src/components/Sidebar';
import { Topbar } from './src/components/Topbar';
import { RoadmapGenerator } from './src/pages/RoadmapGenerator';
import { DailyGoals } from './src/pages/DailyGoals';
import { ProgressDashboard } from './src/pages/ProgressDashboard';
import { UserProfile } from './src/pages/UserProfile';
import { AuthPage } from './src/pages/AuthPage';
import SetPasswordPage from './src/pages/SetPasswordPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import { HomePage } from './src/pages/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './src/redux/features/userSlice';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

function AppContent() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user and authentication status from Redux store
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);

    if(!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">

                    {/* Sidebar Navigation */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        setIsOpen={setSidebarOpen}
                    />

                    {/* Topbar only on non-auth pages */}
                    <div className="lg:ml-64 flex flex-col min-h-screen">
                        <Topbar
                            onMenuClick={() => setSidebarOpen(true)}
                            user={user}
                        />
                        <main className="flex-1 p-4 lg:p-8">
                            <Routes>
                                <Route path="/" element={<HomePage user={user} />} />
                                <Route path="/roadmap" element={<RoadmapGenerator/>} />
                                <Route path="/goals" element={<DailyGoals />} />
                                <Route path="/dashboard" element={<ProgressDashboard />} />
                                <Route path="/profile" element={<UserProfile />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                    // Global fallback — individual toasts override these
                    duration: 3000,
                    style: {
                        fontFamily: 'inherit',
                    },
                    }}
                />

                <Routes>
                    {/* Public */}
                    <Route element={<PublicRoute />}>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    </Route>

                    <Route path='/set-password' element={<SetPasswordPage />} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/*" element={<AppContent />} />
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
