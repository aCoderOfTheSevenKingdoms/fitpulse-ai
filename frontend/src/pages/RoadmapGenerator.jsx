import React, { useState } from 'react';
import { User, Utensils, Dumbbell, Activity, ChevronRight, ChevronLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { onRoadmapGeneration } from '../redux/features/userSlice';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { setActivityDetails, setPlanId } from '../redux/features/planSlice';
import {showInfo, showError} from '../utils/toast';
import logger from '../utils/logger';

export const RoadmapGenerator = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useSelector((state) => state.user);
    const { activityDetails } = useSelector((state) => state.plan);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const initialFormData = (user.isNewUser) ? {
        age: '',
        bmr: '',
        gender: '',
        wakeUpTime: '',
        bedTime: '',
        jobType: '',
        commuteDistance: '',
        dailyWalk: '',
        doesSmoke: '',
        doesDrinkAlcohol: '',
        mealCount: '',
        doesSkipLunch: '',
        junkFoodFreq: '',
        nonVegFreq: '',
        mealDescription: '',
        dietType: '',
        waterIntake: '',
        workoutPlace: '',
        calisthenics: '',
        muscleTraining: '',
        bodyPart: '',
        workoutRoutine: '',
        bloodSugarLevels: '',
        bloodPressureRange: '',
        cholestrol: '',
        medicalConditions: ''
    } : (activityDetails || {});

    const [formData, setFormData] = useState(initialFormData || {});

    const navigate = useNavigate();

    const [isCalcOpen,setIsCalcOpen] = useState(false);

    const dispatch = useDispatch();

    const totalSteps = 4;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return formData.age && formData.bmr && formData.wakeUpTime && formData.bedTime && formData.jobType && formData.commuteDistance && formData.dailyWalk && formData.doesSmoke && formData.doesDrinkAlcohol && formData.gender;
            case 2: return formData.dietType && formData.waterIntake && formData.mealCount && formData.doesSkipLunch && formData.junkFoodFreq && formData.nonVegFreq && formData.mealDescription;
            case 3: return formData.workoutPlace && formData.calisthenics && formData.muscleTraining && formData.bodyPart && formData.workoutRoutine;
            case 4: return formData.medicalConditions; // Optional fields
            default: return false;
        }
    };

    const nextStep = () => {
        if (step < totalSteps && isStepValid()) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        // console.log('Submitting...', formData);

        {/** Make API calls to generate AI roadmap */}
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/plan/generate-plan`, 
            formData, 
            { withCredentials: true }
        ).then((response) => {
            setIsLoading(false);
            // console.log('Usage: ', response.usage);
            // console.log('Response: ', response.data);
            const updatedUser = {
                ...user,
                hasHistory: true,
                isNewUser: false
            }
            dispatch(setActivityDetails(formData));
            dispatch(setPlanId(response?.data?.planId));
            dispatch(onRoadmapGeneration(updatedUser));
            showInfo(response?.data?.message || "Plan Generation Initiated");
            navigate('/goals', { state: { isNewPlan: true } });
        })
        .catch((error) => {
            setIsLoading(false);
            logger.error(`[PLAN GENERATION ERROR] ${error.message}`);
            showError(error.response?.data?.message || 'Failed to generate roadmap. Please try again.');
        })
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header: Progress & Title */}
                <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Create Your Roadmap</h2>
                            <p className="text-slate-400 text-sm">Let AI customize your plan.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                            <span className="text-cyan-400 font-bold">{step}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-400 text-sm font-medium">{totalSteps}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Slides */}
                <div className="relative z-10 min-h-[320px]">

                    {/* Slide 1: Personal Habits */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 text-indigo-400">
                                <User className="w-6 h-6" />
                                <h3 className="text-lg font-semibold text-white">Personal Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How do you identify?</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => handleInputChange('gender', g)}
                                                className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.gender === g
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">What's your age?</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        placeholder="Years"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">What's your BMR?</label>
                                    <button
                                        onClick={() => setIsCalcOpen(true)}
                                        className="ml-1 text-xs text-cyan-100/40"
                                    >Don't know? Click to calculate</button>
                                    <input
                                        type="number"
                                        value={formData.bmr}
                                        onChange={(e) => handleInputChange('bmr', e.target.value)}
                                        placeholder="0.0"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">What time do you usually wake up? (in AM)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['8-10', '11-12', '12+'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('wakeUpTime', t)}
                                                className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.wakeUpTime === t
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">What time do you usually go to bed? (in PM)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['8-10', '11-12', '12+'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('bedTime', t)}
                                                className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.bedTime === t
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Do you travel daily?</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['No, Remote job', 'Yes, school/college', 'Yes, Office', 'Hybrid'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('jobType', t)}
                                                className="font-medium"
                                            >
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div 
                                                    className={`rounded-full border p-1 
                                                                ${formData.jobType === t
                                                                    ? 'bg-cyan-500 border-cyan-500'
                                                                    : 'border-slate-200'
                                                                }`}
                                                    ></div>
                                                    <span>{t}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">If you commute, how far is your workplace? (in KM)</label>
                                    <input
                                        type="number"
                                        value={formData.commuteDistance}
                                        onChange={(e) => handleInputChange('commuteDistance', e.target.value)}
                                        placeholder="in kms"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">On an average, how much do you walk daily? (in steps or distance)</label>
                                    <input
                                        type="number"
                                        value={formData.dailyWalk}
                                        onChange={(e) => handleInputChange('dailyWalk', e.target.value)}
                                        placeholder="in steps or kms"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Do you smoke?</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Yes', 'No', 'Occasionally'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('doesSmoke', t)}
                                                className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.doesSmoke === t
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Do you drink alcohol?</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Never', 'Occasionally', 'Frequently'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('doesDrinkAlcohol', t)}
                                                className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.doesDrinkAlcohol === t
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Slide 2: Dietary Habits */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 text-emerald-400">
                                <Utensils className="w-6 h-6" />
                                <h3 className="text-lg font-semibold text-white">Dietary Preferences</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How many meals do you have in a day?</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['2-3','4'].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => handleInputChange('mealCount', d)}
                                                className={`px-2 py-3 rounded-xl text-sm font-medium border transition-all ${formData.mealCount === d
                                                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How often do you skip lunch?</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Never','Rarely','Often'].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => handleInputChange('doesSkipLunch', d)}
                                                className={`px-2 py-3 rounded-xl text-sm font-medium border transition-all ${formData.doesSkipLunch === d
                                                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label className="text-sm font-medium text-slate-300">How much water do you drink daily?</label>
                                    <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <input
                                                type="range"
                                                min="1" max="5" step="0.5"
                                                value={formData.waterIntake || 2}
                                                onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                            <span className="text-white font-mono w-16 text-right">{formData.waterIntake || 2}L</span>
                                    </div> 
                                </div> 

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How often do you eat street/outside food in a month?</label>
                                    <input
                                        type="number"
                                        value={formData.junkFoodFreq}
                                        onChange={(e) => handleInputChange('junkFoodFreq', e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Are you a vegetarian or non-vegetarian?</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Vegetarian', 'Non-vegetarian'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleInputChange('dietType', t)}
                                                className="font-medium"
                                            >
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div 
                                                    className={`rounded-full border p-1 
                                                                ${formData.dietType === t
                                                                    ? 'bg-cyan-500 border-cyan-500'
                                                                    : 'border-slate-200'
                                                                }`}
                                                    ></div>
                                                    <span>{t}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">If non-veg, how often do you eat it in a week?</label>
                                    <input
                                        type="number"
                                        value={formData.nonVegFreq}
                                        onChange={(e) => handleInputChange('nonVegFreq', e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                            </div>

                            <div className="space-y-2 mt-6">
                                <label className="text-sm font-medium text-slate-300">Describe your meal (keep it brief)</label>
                                <textarea
                                    rows="6"
                                    value={formData.mealDescription}
                                    onChange={(e) => handleInputChange('mealDescription', e.target.value)}
                                    placeholder=""
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                            </div>

                        </div>
                    )}

                    {/* Slide 3: Workout */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 text-orange-400">
                                <Dumbbell className="w-6 h-6" />
                                <h3 className="text-lg font-semibold text-white">Activity Level</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Do you prefer home workouts or gym?</label>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                        {['Home','Gym'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => handleInputChange('workoutPlace', level)}
                                                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${formData.workoutPlace === level
                                                        ? 'bg-orange-500/20 border-orange-500 text-white'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How much time do you spend doing calisthenics?</label>
                                    <input
                                        type="number"
                                        value={formData.calisthenics}
                                        onChange={(e) => handleInputChange('calisthenics', e.target.value)}
                                        placeholder="in hours"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">How much time do you spend on muscle training per session?</label>
                                    <input
                                        type="number"
                                        value={formData.muscleTraining}
                                        onChange={(e) => handleInputChange('muscleTraining', e.target.value)}
                                        placeholder="in hours"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Which body part(s) do you focus on the most?</label>
                                    <input
                                        type="text"
                                        value={formData.bodyPart}
                                        onChange={(e) => handleInputChange('bodyPart', e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>

                            </div>
 
                            <div className="space-y-2 mt-6">
                                <label className="text-sm font-medium text-slate-300">If you already follow a workout routine, tell us about it.</label>
                                <textarea
                                    rows="6"
                                    value={formData.workoutRoutine}
                                    onChange={(e) => handleInputChange('workoutRoutine', e.target.value)}
                                    placeholder=""
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                            </div>

                        </div>
                    )}

                    {/* Slide 4: Health Conditions */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 text-red-400">
                                <Activity className="w-6 h-6" />
                                <h3 className="text-lg font-semibold text-white">Health & Conditions</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-200">Please consult a medical professional before starting any new diet or exercise program. The AI roadmap is a suggestion, not a prescription.</p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">What are your recent blood sugar levels? (if known)</label>
                                        <input
                                            type="text"
                                            value={formData.bloodSugarLevels}
                                            onChange={(e) => handleInputChange('bloodSugarLevels', e.target.value)}
                                            placeholder=""
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">What's your blood pressure range?</label>
                                        <input
                                            type="text"
                                            value={formData.bloodPressureRange}
                                            onChange={(e) => handleInputChange('bloodPressureRange', e.target.value)}
                                            placeholder=""
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Do you have any cholestrol related conditions?</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Yes', 'No'].map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => handleInputChange('cholestrol', t)}
                                                    className="font-medium"
                                                >
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div 
                                                        className={`rounded-full border p-1 
                                                                    ${formData.cholestrol === t
                                                                        ? 'bg-cyan-500 border-cyan-500'
                                                                        : 'border-slate-200'
                                                                    }`}
                                                        ></div>
                                                        <span>{t}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Do you have any injuries or medical conditions?</label>
                                        <textarea
                                            value={formData.medicalConditions}
                                            onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                                            placeholder="E.g., Lower back pain, Asthma, Previous knee surgery..."
                                            className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none"
                                        />
                                    </div>

                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${step === 1
                                ? 'opacity-0 cursor-default'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {step === totalSteps ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
                        >
                            {isLoading ? 'Generating...' : 'Generate Roadmap'}
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${isStepValid()
                                    ? 'bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

            </div>
            <BMRcalculator isCalcOpen={isCalcOpen} setIsCalcOpen={setIsCalcOpen} />
        </div>
    );
};

const BMRcalculator = ({ isCalcOpen, setIsCalcOpen }) => {

    const [inputData, setInputData] = useState({
        gender: '',
        age: '',
        height: '',
        weight: ''
    });
    const [bmr, setBMR] = useState(null);

    const handleInputChange = (field, value) => {
        setInputData(prev => ({ ...prev, [field]: value }));
    }

    const calc = () => {
        let res;

        if(inputData.gender === 'Male'){
            res = (10*inputData.weight) + (6.25*inputData.height) - (5*inputData.age) + 5;
        } else {
            res = (10*inputData.weight) + (6.25*inputData.height) - (5*inputData.age) - 161;
        }

        setBMR(res);
    }

    return (isCalcOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

            {/** Modal Content */}
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">

                {/* Modal Bg Effect */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500" />

                <button
                  onClick={() => setIsCalcOpen(false)}
                  className='text-xs bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-md'
                >esc</button>

                {/** Select Gender */}
                <div className="grid grid-cols-2 gap-2 mt-8">
                    {['Male', 'Female'].map((g) => (
                        <button
                            key={g}
                            onClick={() => handleInputChange('gender', g)}
                            className={`py-2 rounded-xl text-sm font-medium border transition-all ${inputData.gender === g
                                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                            >
                                {g}
                        </button>
                    ))}
                </div>

                {/** Enter Age */}
                <div className="space-y-2 mt-5">
                    <label className="text-sm font-medium text-slate-300">Age (in years)</label>
                        <input
                            type="number"
                            value={inputData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            placeholder="Years"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                </div>

                {/** Enter weight & height */}
                <div className='grid grid-cols-2 gap-3 mt-5'>
                    <div className='space-y-2'>
                        <label className="text-sm font-medium text-slate-300">Height (in cm)</label>
                            <input
                                type="number"
                                value={inputData.height}
                                onChange={(e) => handleInputChange('height', e.target.value)}
                                placeholder="kg"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            />
                    </div>

                    <div className='space-y-2'>
                        <label className="text-sm font-medium text-slate-300">Weight (in kg)</label>
                            <input
                                type="number"
                                value={inputData.weight}
                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                placeholder="cm"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            />
                    </div>
                </div>

                <button
                    onClick={calc}
                    disabled={bmr !== null}
                    className="mt-7 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Calculate
                </button>
                        
                {bmr && (
                    <span
                        className='inline-block mt-6 text-green-500'
                    >
                        Your BMR: {bmr || "Error"}     
                    </span>
                )}        
            </div>
        </div>
    )
}