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
import { Shop } from './src/pages/Shop';
import { UserProfile } from './src/pages/UserProfile';
import { AuthPage } from './src/pages/AuthPage';
import SetPasswordPage from './src/pages/SetPasswordPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import { HomePage } from './src/pages/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './src/redux/features/userSlice';
import axios from 'axios';

function AppContent() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const location = useLocation();

    // Get user and authentication status from Redux store
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);

    if(!user) return null;

    // console.log("PATH:", location.pathname);
    // console.log("AUTH:", isAuthenticated);

    // Check if user is authenticated before rendering any component
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
    //                 { withCredentials: true });
    //             dispatch(setUser(response.data.user));
    //         } catch (error) {
    //             console.error('Error fetching user:', error);
    //             dispatch(clearUser());
    //         }
    //     };
    //     fetchUser();
    // }, [dispatch]);

    const handleLogout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, 
            {},
            { withCredentials: true });
        dispatch(clearUser());
        navigate('/auth');
    };

    // If user is not authenticated and not on auth pages, redirect
    // if (
    //     !isAuthenticated &&
    //     !(
    //         location.pathname === "/auth" ||
    //         location.pathname.startsWith("/reset-password")
    //     )
    // ) {
    //     return <Navigate to="/auth" replace />;
    // }

    // // If user is authenticated and on auth page, redirect to home
    // if (isAuthenticated && location.pathname === '/auth') {
    //     return <Navigate to="/" replace />;
    // }

    // // Hide Sidebar/Topbar on Auth pages
    // const isAuthPage =
    //     location.pathname === "/auth" ||
    //     location.pathname.startsWith("/reset-password");

    // if(loading){
    //     return (
    //             <div className="flex items-center justify-center h-screen">
    //                 <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    //             </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">

                    {/* Sidebar Navigation */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        setIsOpen={setSidebarOpen}
                        onLogout={handleLogout}
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
                                <Route path="/goals" element={<DailyGoals user={user} />} />
                                <Route path="/dashboard" element={<ProgressDashboard user={user} />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/profile" element={<UserProfile user={user} onUpdateProfile={(data) => dispatch(setUser(data))} onLogout={handleLogout} />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>

            {/* {isAuthPage && (
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                </Routes>
            )} */}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
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
