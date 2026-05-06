import React, { useState } from 'react';
import { Sparkles, Flame, TrendingUp } from 'lucide-react';
import { CategoryPills } from '../components/CategoryPills';
import { BlogCard } from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';

const BLOG_POSTS = [
    {
        id: '1',
        title: 'Top 5 Calisthenics Moves for Beginners',
        excerpt: 'Master your bodyweight with these essential foundational movements designed to build core strength.',
        category: 'Workout',
        author: 'Dr. Sarah Fit',
        imageUrl: 'https://picsum.photos/800/600?random=1',
        readTime: '5 min',
        likes: 1240,
        isSaved: false,
    },
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
        id: '3',
        title: 'Sleep Hygiene: The Missing Link to Gains',
        excerpt: 'Why your 8 hours of sleep might be more important than your 2 hours in the gym.',
        category: 'Sleep',
        author: 'Sleep Lab AI',
        imageUrl: 'https://picsum.photos/800/600?random=3',
        readTime: '4 min',
        likes: 2100,
        isSaved: false,
    },
    {
        id: '4',
        title: 'Mental Toughness in Sports',
        excerpt: 'Techniques used by Olympic athletes to stay focused and resilient under extreme pressure.',
        category: 'Mental',
        author: 'Coach Carter',
        imageUrl: 'https://picsum.photos/800/600?random=4',
        readTime: '6 min',
        likes: 543,
        isSaved: false,
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
        isSaved: false,
    },
    {
        id: '6',
        title: 'Active Recovery: What is it?',
        excerpt: "Don’t just sit on the couch. Learn how low-intensity movement can speed up your recovery.",
        category: 'Recovery',
        author: 'Physio Tom',
        imageUrl: 'https://picsum.photos/800/600?random=6',
        readTime: '3 min',
        likes: 330,
        isSaved: false,
    },
];

const CATEGORIES = ['All', 'Workout', 'Diet', 'Sleep', 'Mental', 'Recovery'];

export const HomePage = ({ user }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    const filteredPosts = activeCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === activeCategory);

    return (
        <>
            {/* Welcome Hero Section */}
            <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 overflow-hidden border border-indigo-800/50 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Sparkles className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Ready to crush your goals, {user?.name?.split(' ')[0] || "User"}?
                    </h1>
                    <p className="text-indigo-200 text-lg mb-6">
                        {user?.isNewUser
                            ? "Welcome to FitPulse! Start by setting up your profile to get personalized recommendations."
                            : "Your AI coach has curated 3 new workout tips for you based on yesterday's performance."
                        }
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/goals')}
                            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
                        >
                            <Flame className="w-5 h-5" />
                            Start Workout
                        </button>
                        <button
                            onClick={() => navigate('/goals')}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-600 transition-all"
                        >
                            View Schedule
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-500/10 text-orange-400">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Daily Streak</p>
                        <p className="text-xl font-bold text-white">
                            {user?.hasHistory === false ? '0 Days' : '12 Days'}
                        </p>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Weight</p>
                        <p className="text-xl font-bold text-white">
                            {user?.weight ? `${user?.weight} kg` : 'N/A'}
                            {!user?.isNewUser && user?.weight && user?.hasHistory !== false && <span className="text-xs text-emerald-500 ml-1">-0.5</span>}
                        </p>
                    </div>
                </div>
            </div>

            {/* Blog/Flashcards Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        Recommended for You
                    </h2>
                    <CategoryPills
                        categories={CATEGORIES}
                        selected={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
};

