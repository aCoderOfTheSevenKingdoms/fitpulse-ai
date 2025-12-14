import React, { useState, useRef } from 'react';
import { 
  Flame, 
  Trophy, 
  Upload, 
  Activity, 
  Moon, 
  Utensils, 
  Timer, 
  Footprints, 
  TrendingUp, 
  Medal,
  Lock,
  Camera,
  ClipboardList
} from 'lucide-react';
import { User } from '../types';

// --- Chart Components ---

interface ChartProps {
  data: number[];
  labels: string[];
  color: string;
  maxValue?: number;
}

const SimpleLineChart: React.FC<ChartProps> = ({ data, labels, color, maxValue }) => {
  const max = maxValue || Math.max(...data) * 1.2 || 100;
  
  // Calculate points for SVG (0-100 coordinate space)
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 relative min-h-[100px] group">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="1" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
          
          {/* Area Fill */}
          <polygon points={areaPoints} fill={color} fillOpacity="0.1" />

          {/* Path */}
          <polyline 
            points={points} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="drop-shadow-lg"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* HTML Dots Overlay - prevents distortion */}
        {data.map((val, i) => {
             const left = (i / (data.length - 1)) * 100;
             const top = 100 - (val / max) * 100;
             return (
               <div 
                key={i}
                className="absolute w-3 h-3 bg-slate-900 border-2 rounded-full transition-all duration-300 z-10 group-hover:scale-110"
                style={{ 
                    left: `${left}%`, 
                    top: `${top}%`, 
                    borderColor: color,
                    transform: 'translate(-50%, -50%)'
                }}
               >
                  {/* Tooltip */}
                  <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20"
                  >
                    {val}
                  </div>
               </div>
             );
        })}
      </div>
      <div className="flex justify-between mt-3 px-1">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{l}</span>
        ))}
      </div>
    </div>
  );
};

const SimpleBarChart: React.FC<ChartProps> = ({ data, labels, color, maxValue }) => {
  const max = maxValue || Math.max(...data) * 1.1 || 100;
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex items-end justify-between gap-2 min-h-[100px]">
        {data.map((val, i) => {
          const height = `${(val / max) * 100}%`;
          return (
            <div key={i} className="w-full bg-slate-800/50 rounded-t-sm relative group h-full flex items-end">
               <div 
                 style={{ height: height, backgroundColor: color }} 
                 className="w-full rounded-t-sm transition-all duration-500 opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_10px_currentColor]"
               />
               {/* Tooltip */}
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-white">
                 {val}
               </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 px-1">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{l}</span>
        ))}
      </div>
    </div>
  );
};

// --- Mock Data ---

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const INITIAL_IMAGES = [
  { id: 1, week: 'Week 1', date: 'Oct 1', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop' },
  { id: 2, week: 'Week 4', date: 'Oct 28', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop' },
  { id: 3, week: 'Week 8', date: 'Nov 25', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop' },
];

interface ProgressDashboardProps {
  user?: User;
  onNavigate?: (page: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ user, onNavigate }) => {
  // Use hasHistory to determine if we show mock data or empty data
  const hasHistory = user?.hasHistory !== false; // Default true if undefined (for safety), but App.tsx ensures it's set
  
  const [streakDays] = useState(hasHistory ? 12 : 0);
  const [effectivenessScore] = useState(hasHistory ? 78 : 0); // 0-100
  const [images, setImages] = useState(hasHistory ? INITIAL_IMAGES : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculations for circular progress
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (effectivenessScore / 100) * circumference;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = {
        id: Date.now(),
        week: `Week ${images.length + 1}`, // Auto-increment week logic
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        url: URL.createObjectURL(file),
      };
      // Add new image to the beginning of the list
      setImages([newImage, ...images]);
      
      // Reset input value so same file can be selected again if needed
      event.target.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Zeroed out data for new users
  const emptyWeekData = [0, 0, 0, 0, 0, 0, 0];

  if (user?.isNewUser) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700">
               <ClipboardList className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Complete Your Profile</h2>
            <p className="text-slate-400 mb-8">
              Your analytics dashboard is currently empty. Complete your profile setup and log your first workout to unlock detailed progress tracking, health insights, and body transformation galleries.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('roadmap')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
               <Lock className="w-4 h-4" />
               Generate Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Progress</h2>
          <p className="text-slate-400">Tracking consistency, strength, and transformation.</p>
        </div>
        <button 
          onClick={triggerUpload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors text-sm font-medium"
        >
           <Upload className="w-4 h-4" />
           Upload Photo
        </button>
      </div>

      {/* Top Row: Effectiveness & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Effectiveness Score */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity className="w-32 h-32 text-indigo-400" />
           </div>
           
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Effectiveness Score
           </h3>

           <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                 {/* Circular Progress SVG */}
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    {/* Background Track */}
                    <circle 
                      cx="64" 
                      cy="64" 
                      r={radius} 
                      stroke="#1e293b" 
                      strokeWidth="10" 
                      fill="none" 
                    />
                    {/* Progress Indicator */}
                    <circle 
                      cx="64" 
                      cy="64" 
                      r={radius} 
                      stroke="#6366f1" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{effectivenessScore}</span>
                    <span className="text-xs text-indigo-300 font-bold uppercase">
                      {effectivenessScore > 70 ? 'Good' : effectivenessScore > 30 ? 'Average' : 'Low'}
                    </span>
                 </div>
              </div>
              <div className="flex-1">
                 <p className="text-sm text-slate-300 mb-2">
                    {hasHistory 
                      ? 'Your consistency is improving. The score adapts as you get stronger.' 
                      : 'Log your first workout to generate your effectiveness score.'}
                 </p>
                 <div className="text-xs text-slate-500 font-mono">
                    Next Level: {Math.ceil((effectivenessScore + 10) / 10) * 10}
                 </div>
              </div>
           </div>
        </div>

        {/* Streak Counter */}
        <div className="lg:col-span-2 bg-gradient-to-br from-orange-900/20 to-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                 <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center border-2 border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <Flame className={`w-10 h-10 text-orange-500 fill-orange-500 ${streakDays > 0 ? 'animate-pulse' : ''}`} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-bold text-white">{streakDays}</h3>
                    <p className="text-orange-400 font-medium uppercase tracking-wider text-sm">Day Streak</p>
                 </div>
              </div>

              {/* Weekly Heatmap */}
              <div className="flex gap-3">
                 {WEEK_LABELS.map((day, i) => {
                   // Mock active days only if user has history
                   const isActive = hasHistory && i < 5; 
                   return (
                     <div key={day} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20' 
                            : 'bg-slate-800 text-slate-600 border-slate-700'
                        }`}>
                           {isActive ? <Flame className="w-5 h-5 fill-current" /> : <div className="w-2 h-2 rounded-full bg-slate-700" />}
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{day}</span>
                     </div>
                   );
                 })}
              </div>
           </div>

           {/* Badges */}
           <div className="mt-8 pt-6 border-t border-slate-800/50 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border min-w-max transition-colors ${
                  streakDays >= 15 ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-800/50 border-slate-700/50'
              }`}>
                 <Medal className={`w-5 h-5 ${streakDays >= 15 ? 'text-yellow-500' : 'text-slate-500'}`} />
                 <span className={`text-sm font-bold ${streakDays >= 15 ? 'text-yellow-400' : 'text-slate-400'}`}>15 Day Badge</span>
                 {streakDays < 15 && <Lock className="w-3 h-3 text-slate-600" />}
              </div>
              
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border min-w-max transition-colors ${
                  streakDays >= 30 ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700/50'
              }`}>
                 <Trophy className={`w-5 h-5 ${streakDays >= 30 ? 'text-indigo-500' : 'text-slate-500'}`} />
                 <span className={`text-sm font-bold ${streakDays >= 30 ? 'text-indigo-400' : 'text-slate-400'}`}>30 Day Titan</span>
                 {streakDays < 30 && <Lock className="w-3 h-3 text-slate-600" />}
              </div>
              
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border min-w-max transition-colors ${
                  streakDays >= 60 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700/50'
              }`}>
                 <Medal className={`w-5 h-5 ${streakDays >= 60 ? 'text-emerald-500' : 'text-slate-500'}`} />
                 <span className={`text-sm font-bold ${streakDays >= 60 ? 'text-emerald-400' : 'text-slate-400'}`}>60 Day Master</span>
                 {streakDays < 60 && <Lock className="w-3 h-3 text-slate-600" />}
              </div>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Calories Burnt (Bar) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                 <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Calories Burnt</h3>
           </div>
           <div className="h-40">
              <SimpleBarChart 
                labels={WEEK_LABELS} 
                data={hasHistory ? [1800, 2150, 1900, 2400, 2200, 1600, 2100] : emptyWeekData} 
                color="#f97316" 
              />
           </div>
        </div>

        {/* Sleep Hours (Line) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                 <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Sleep Duration</h3>
           </div>
           <div className="h-40">
              <SimpleLineChart 
                labels={WEEK_LABELS} 
                data={hasHistory ? [6.5, 7.2, 8.0, 7.5, 6.0, 8.5, 7.8] : emptyWeekData} 
                color="#6366f1" 
                maxValue={10}
              />
           </div>
        </div>

        {/* Protein (Bar) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                 <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Protein (g)</h3>
           </div>
           <div className="h-40">
              <SimpleBarChart 
                labels={WEEK_LABELS} 
                data={hasHistory ? [140, 160, 135, 180, 150, 130, 155] : emptyWeekData} 
                color="#10b981" 
              />
           </div>
        </div>

        {/* Workout Duration (Line) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                 <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Workout Mins</h3>
           </div>
           <div className="h-40">
              <SimpleLineChart 
                labels={WEEK_LABELS} 
                data={hasHistory ? [45, 60, 45, 0, 75, 90, 30] : emptyWeekData} 
                color="#3b82f6" 
              />
           </div>
        </div>

         {/* Steps (Line) */}
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl md:col-span-2 xl:col-span-2">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                 <Footprints className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Daily Steps</h3>
           </div>
           <div className="h-40 w-full">
              <SimpleLineChart 
                labels={WEEK_LABELS} 
                data={hasHistory ? [8500, 11200, 9800, 4500, 12500, 9000, 11500] : emptyWeekData} 
                color="#06b6d4" 
              />
           </div>
        </div>

      </div>

      {/* Transformation Gallery */}
      <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
               <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Camera className="w-6 h-6 text-pink-500" />
                  Transformation Journey
               </h3>
               <p className="text-slate-400 mt-1">Upload weekly photos to track your physical changes.</p>
            </div>
            <button 
              onClick={triggerUpload}
              className="flex items-center gap-2 px-5 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-600/20 transition-all"
            >
               <Upload className="w-4 h-4" />
               Upload Photo
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Upload Placeholder */}
            <button 
              onClick={triggerUpload}
              className="aspect-[4/5] bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-slate-500 transition-all group"
            >
               <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
               </div>
               <span className="font-medium">Add This Week</span>
            </button>

            {/* Images */}
            {images.length > 0 ? images.map((img) => (
               <div key={img.id} className="relative aspect-[4/5] group rounded-2xl overflow-hidden cursor-pointer bg-slate-800">
                  <img src={img.url} alt={img.week} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4">
                     <p className="text-white font-bold">{img.week}</p>
                     <p className="text-xs text-slate-300">{img.date}</p>
                  </div>
               </div>
            )) : (
              // Empty state helper text if no images
              <div className="col-span-full py-8 text-center text-slate-500 italic">
                No transformation photos uploaded yet.
              </div>
            )}
         </div>
      </div>

    </div>
  );
};