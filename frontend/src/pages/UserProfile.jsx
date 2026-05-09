import React, { useState, useRef } from 'react';
import {
    User as UserIcon,
    Mail,
    MapPin,
    Camera,
    Trash2,
    LogOut,
    Save,
    Package,
    Settings,
    Bookmark,
    ChevronRight,
    Check,
    Ruler,
    Weight,
    Lock,
    UserCircle2
} from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { useSelector, useDispatch } from 'react-redux';
import {DefaultAvatar} from '../components/DefaultAvatar';
import { setAvatar, onProfileUpdate, removeAvatar, clearUser } from '../redux/features/userSlice';
import axios from 'axios';
import {showError, showSuccess, showPromise, showInfo} from '../utils/toast';
import logger from '../utils/logger';
import {persistor} from '../redux/store';

// --- Mock Data ---

const SAVED_BLOGS = [
    {
        id: '2',
        title: 'The Truth About Intermittent Fasting',
        excerpt: 'Separating the science from the hype. Here is what experts really say about timed eating windows.',
        category: 'Diet',
        author: 'Mike Nutritionist',
        imageUrl: 'https://picsum.photos/800/600?random=2',
        readTime: '8 min',
        likes: 850,
        isSaved: true,
    },
    {
        id: '5',
        title: 'High Protein Vegetarian Meals',
        excerpt: 'Delicious, plant-based recipes that pack a punch of protein for muscle recovery.',
        category: 'Diet',
        author: 'Green Chef',
        imageUrl: 'https://picsum.photos/800/600?random=5',
        readTime: '10 min',
        likes: 900,
        isSaved: true,
    },
];

export const UserProfile = () => {

    const {user, avatarUrl} = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('settings');
    // Local state to manage form inputs before saving
    const [formData, setFormData] = useState(user || {});
    const [showSuccess, setShowSuccess] = useState(false);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, 
            {},
            { withCredentials: true });
        dispatch(clearUser());
        await persistor.purge(); // Clear all persisted storage
        navigate('/auth');
    };

    const handleImageUpload = async (e) => {
        try {
           const file = e.target.files?.[0];
           if(!file){
            showError("No file selecetd");
            return;
           }

           // Upload avatar to backend
           const fd = new FormData();
           fd.append("image", file);

           const uploadPromise = axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/upload-avatar`,
            fd,
            {withCredentials: true}
           );

           showPromise(uploadPromise, {
            loading: "Uploading...",
            success: "Profile pic updated",
            error: "Failed updating profile pic"
           })

           const response = await uploadPromise;

           if(response?.status === 200 && response?.data?.avatar){
            dispatch(setAvatar(response?.data?.avatar));
           }

           e.target.value = "";
        } catch (error) {
           logger.error(`[FILE UPLOAD ERROR] ${error.message}`);
        }
    };

    const removeProfilePic = async () => {
        try {
           const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/remove-avatar`,
            {withCredentials: true}
           );
           dispatch(removeAvatar());
           showSuccess(response?.data?.message || "Profile pic removed");
        } catch (error) {
           logger.error(`[FILE DELETE ERROR] ${error.message}`);
           showError(error.message || "Some error occured while removing profile pic");
        }
    };

    const handleSave = async () => {
        try {

            const uploadPromise = axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/update`,
                formData,
                {withCredentials: true}
            );

            showPromise(uploadPromise, {
                loading: "Saving Changes",
                success: "Changes saved",
                error: "Failed saving changes"
            });

            const response = await uploadPromise;

            if(response?.status === 200 && response?.data?.user){
                dispatch(onProfileUpdate(response?.data?.user));
                setShowSuccess(true);
            }

        } catch (error) {
            logger.error(`[PROFILE UPDATE ERROR] ${error.message}`);
        }
    };

    const resetPasswordHandler = async () => {
        try {
         
           if(!formData?.email || formData?.email?.length === 0){
            showInfo("Please enter your email");
            return;
           } 

           const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
            {email: formData?.email},
            {withCredentials: true}
           );

           if(response?.status === 200){
            showSuccess(response?.data?.message);
           }
        } catch (error) {
           logger.error(`[PASSWORD RESET ERROR] ${error.message}`);
           showError(error.message || "Couldn't reset password");
        }
    }

    return (
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-6rem)] animate-in fade-in duration-500">

            {/* Header Profile Card */}
            <div className="relative mb-8">
                {/* Banner */}
                <div className="h-48 rounded-3xl bg-gradient-to-r from-indigo-900 to-cyan-900 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                </div>

                {/* Profile Info Overlay */}
                <div className="px-8 flex flex-col md:flex-row items-end -mt-16 gap-6 relative z-10">
                    <div className="relative group">
                        {avatarUrl
                            ? <div className="w-32 h-32 rounded-full border-4 border-slate-950     overflow-hidden bg-slate-800 shadow-2xl">
                                <img src={avatarUrl} alt={formData?.name ?? ''} className="w-full h-full object-cover" />
                            </div>
                            : <DefaultAvatar size={96} />
                        }
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full border-4 border-slate-950 shadow-lg transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                    {formData?.name ?? ''}
                                </h1>
                                <p className="text-slate-400 mt-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {formData?.location ?? ''} • Member since {formData?.memberSince ?? ''}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2">
                        {[
                            { id: 'settings', label: 'Profile Settings', icon: Settings },
                            { id: 'saved', label: 'Saved Blogs', icon: Bookmark },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                            ? 'bg-slate-800 text-cyan-400 shadow-sm'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Account Actions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                        <button 
                           onClick={removeProfilePic} 
                           className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <UserCircle2 className="w-5 h-5" />
                            Remove Picture
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">

                    {/* --- SETTINGS TAB --- */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden">

                                <h2 className="text-xl font-bold text-white mb-6 pt-2">Personal Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={formData?.name ?? ''}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="email"
                                                value={formData?.email ?? ''}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="password"
                                                value={formData?.password ?? ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button 
                                          onClick={resetPasswordHandler}
                                          className='pl-2 text-xs text-slate-400 hover:text-slate-200'
                                        >
                                          Reset Password?
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={formData?.location ?? ''}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Stats Section */}
                                <h3 className="text-lg font-bold text-white mb-4">Physical Stats</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Weight (kg)</label>
                                        <div className="relative">
                                            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="number"
                                                placeholder="e.g. 75"
                                                value={formData?.weight ?? ''}
                                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Height (cm)</label>
                                        <div className="relative">
                                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="number"
                                                placeholder="e.g. 180"
                                                value={formData?.height ?? ''}
                                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8">
                                    <label className="text-sm font-medium text-slate-400">Bio</label>
                                    <textarea
                                        value={formData?.bio ?? ''}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all h-32 resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                                    {/* <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                       <Trash2 className="w-4 h-4" />
                                       Delete Account
                                    </button> */}
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SAVED TAB --- */}
                    {activeTab === 'saved' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white mb-2">Saved Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {SAVED_BLOGS.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                            {SAVED_BLOGS.length === 0 && (
                                <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
                                    <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white">No saved items yet</h3>
                                    <p className="text-slate-500">Bookmarked articles will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

