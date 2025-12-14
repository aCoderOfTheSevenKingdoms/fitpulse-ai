import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BlogCard } from './components/BlogCard';
import { CategoryPills } from './components/CategoryPills';
import { RoadmapGenerator } from './components/RoadmapGenerator';
import { DailyGoals } from './components/DailyGoals';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Shop } from './components/Shop';
import { UserProfile } from './components/UserProfile';
import { AuthPage } from './components/AuthPage';
import { BlogPost, Category, User } from './types';
import { Sparkles, TrendingUp, Flame } from 'lucide-react';

// Mock Data
const INITIAL_USER: User = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  bio: 'Fitness enthusiast and weekend warrior. Love calisthenics and outdoor running.',
  location: 'San Francisco, CA',
  avatar: 'https://picsum.photos/200/200',
  memberSince: 'September 2023',
  isPro: true,
  weight: '74.5',
  height: '180',
  hasHistory: true // Default state for existing user
};

const BLOG_POSTS: BlogPost[] = [
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
    excerpt: 'Don’t just sit on the couch. Learn how low-intensity movement can speed up your recovery.',
    category: 'Recovery',
    author: 'Physio Tom',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    readTime: '3 min',
    likes: 330,
    isSaved: false,
  },
];

const CATEGORIES: Category[] = ['All', 'Workout', 'Diet', 'Sleep', 'Mental', 'Recovery'];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activePage, setActivePage] = useState('home');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const handleRoadmapComplete = (roadmapData: any) => {
    // Update user profile with data from roadmap
    setUser(prev => ({
      ...prev,
      weight: roadmapData.weight,
      height: roadmapData.height,
      isNewUser: false // User is no longer new after generating roadmap
      // hasHistory remains false to show empty dashboard stats
    }));
    setActivePage('goals'); // Redirect to goals or profile after roadmap
  };

  // If user is not logged in, show Auth Page
  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const renderContent = () => {
    switch (activePage) {
      case 'roadmap':
        return <RoadmapGenerator onComplete={handleRoadmapComplete} />;
      case 'goals':
        return <DailyGoals user={user} />;
      case 'progress':
        return <ProgressDashboard user={user} onNavigate={setActivePage} />;
      case 'shop':
        return <Shop />;
      case 'profile':
        return <UserProfile user={user} onUpdateProfile={setUser} onLogout={() => setIsAuthenticated(false)} />;
      case 'home':
      default:
        return (
          <>
            {/* Welcome Hero Section */}
            <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 overflow-hidden border border-indigo-800/50 shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Sparkles className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Ready to crush your goals, {user.name.split(' ')[0]}?
                </h1>
                <p className="text-indigo-200 text-lg mb-6">
                  {user.isNewUser 
                    ? "Welcome to FitPulse! Start by setting up your profile to get personalized recommendations."
                    : "Your AI coach has curated 3 new workout tips for you based on yesterday's performance."
                  }
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActivePage('goals')}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
                  >
                    <Flame className="w-5 h-5" />
                    Start Workout
                  </button>
                  <button 
                    onClick={() => setActivePage('goals')}
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
                        {user.hasHistory === false ? '0 Days' : '12 Days'}
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
                         {user.weight ? `${user.weight} kg` : 'N/A'}
                         {!user.isNewUser && user.weight && user.hasHistory !== false && <span className="text-xs text-emerald-500 ml-1">-0.5</span>}
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        
        {/* Topbar */}
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)} 
          onProfileClick={() => setActivePage('profile')}
          user={user}
        />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;