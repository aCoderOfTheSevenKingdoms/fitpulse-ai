import React, { useState } from 'react';
import { User, Utensils, Dumbbell, Activity, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';

interface FormData {
  age: string;
  weight: string;
  height: string;
  gender: string;
  dietType: string;
  waterIntake: string;
  activityLevel: string;
  goal: string;
  conditions: string;
}

interface RoadmapGeneratorProps {
  onComplete?: (data: FormData) => void;
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    dietType: '',
    waterIntake: '',
    activityLevel: '',
    goal: '',
    conditions: '',
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.age && formData.weight && formData.height && formData.gender;
      case 2: return formData.dietType && formData.waterIntake;
      case 3: return formData.activityLevel && formData.goal;
      case 4: return true; // Optional fields
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < totalSteps && isStepValid()) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Submitting...', formData);
    if (onComplete) {
      onComplete(formData);
    }
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
                  <label className="text-sm font-medium text-slate-300">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        onClick={() => handleInputChange('gender', g)}
                        className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                          formData.gender === g 
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
                  <label className="text-sm font-medium text-slate-300">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Years"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  />
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

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Diet Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['No Restriction', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten Free'].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleInputChange('dietType', d)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium border text-left transition-all ${
                          formData.dietType === d
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
                   <label className="text-sm font-medium text-slate-300">Daily Water Intake</label>
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
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-300">Current Activity</label>
                  {['Sedentary (Office Job)', 'Lightly Active (1-2 days/wk)', 'Moderately Active (3-5 days/wk)', 'Very Active (6+ days/wk)'].map((level) => (
                     <button
                        key={level}
                        onClick={() => handleInputChange('activityLevel', level)}
                        className={`w-full p-4 rounded-xl text-sm font-medium border text-left flex items-center justify-between transition-all ${
                          formData.activityLevel === level
                            ? 'bg-orange-500/20 border-orange-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {level}
                        {formData.activityLevel === level && <Check className="w-4 h-4 text-orange-500" />}
                      </button>
                  ))}
                </div>

                <div className="space-y-4">
                   <label className="text-sm font-medium text-slate-300">Primary Goal</label>
                   <div className="grid grid-cols-1 gap-3">
                      {['Lose Weight', 'Build Muscle', 'Endurance', 'Flexibility'].map((goal) => (
                        <button
                          key={goal}
                          onClick={() => handleInputChange('goal', goal)}
                          className={`p-4 rounded-xl text-sm font-medium border text-left transition-all ${
                            formData.goal === goal
                              ? 'bg-orange-500/20 border-orange-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                   </div>
                </div>
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

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Do you have any injuries or medical conditions?</label>
                    <textarea 
                      value={formData.conditions}
                      onChange={(e) => handleInputChange('conditions', e.target.value)}
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              step === 1 
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
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
            >
              Generate Roadmap
              <Activity className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                isStepValid()
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
    </div>
  );
};