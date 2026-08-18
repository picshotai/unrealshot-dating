'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DRESS_OPTIONS, INTEREST_CHIPS, EXCLUSION_CHIPS, type InterestId } from '@/lib/dating/interests';
import type { StylePref, ExcludableTag } from '@/lib/dating/types';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

interface StudioIntakeViewProps {
  models: Model[];
  selectedModelId: number | null;
  onSelectModel: (id: number) => void;
  onSubmit: (params: {
    modelId: number;
    interests: InterestId[];
    dress: StylePref;
    excludeTags: ExcludableTag[];
    hobbyText: string;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
  creditError: string;
  generalError: string;
  showCancel: boolean; // if false, this is their first shoot and they can't cancel
}

export const StudioIntakeView: React.FC<StudioIntakeViewProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  onSubmit,
  onCancel,
  isLoading,
  creditError,
  generalError,
  showCancel,
}) => {
  const [dress, setDress] = useState<StylePref>('casual');
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>([]);
  const [hobbyText, setHobbyText] = useState('');

  const toggleInterest = (id: InterestId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleExclusion = (id: ExcludableTag) => {
    setExcludeTags((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!selectedModelId) return;
    onSubmit({
      modelId: selectedModelId,
      interests,
      dress,
      excludeTags,
      hobbyText,
    });
  };

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-accent/30 selection:text-white animate-in fade-in duration-500">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="text-white font-medium tracking-tight">
              Curate Your Dating Profile
            </span>
          </div>
          {showCancel && (
            <button
              onClick={onCancel}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              Cancel <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20 space-y-20 pb-40">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Design your aesthetic.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Tell us about your lifestyle. We'll generate 100 hyper-realistic photos 
            perfectly structured for Hinge, Bumble, and Tinder.
          </p>
        </div>

        {/* 1. Select Model */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Select Face Model</h2>
            <p className="text-zinc-500 text-sm">Choose the AI model you've trained to star in this photoshoot.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {models.map((model) => {
              const isActive = selectedModelId === model.id;
              const avatarUrl = model.samples?.[0]?.uri;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-zinc-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                      {model.name || 'Untitled Model'}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 mt-1">
                      {model.samples?.length || 0} sample photos
                    </p>
                  </div>
                  {isActive && (
                    <div className="ml-auto">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Wardrobe Tone */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Which look should we lead with?</h2>
            <p className="text-zinc-500 text-sm">Sets the dominant wardrobe tone (~65%), balanced with the other two looks.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DRESS_OPTIONS.map((opt) => {
              const isActive = dress === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDress(opt.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-zinc-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                      {opt.label}
                    </span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {opt.hint}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Lifestyle / Interests */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">What do you actually do?</h2>
            <p className="text-zinc-500 text-sm">Tap the activities that represent your genuine lifestyle.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INTEREST_CHIPS.map((chip) => {
              const isActive = interests.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleInterest(chip.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-base">{chip.emoji}</span>
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Exclusions */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Anything to leave out? <span className="text-zinc-600 font-normal">(Optional)</span></h2>
            <p className="text-zinc-500 text-sm">We will completely exclude these themes from your 100 photos.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {EXCLUSION_CHIPS.map((chip) => {
              const isActive = excludeTags.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleExclusion(chip.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                    isActive
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-base grayscale opacity-80">{chip.emoji}</span>
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Custom Hobbies */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Custom Hobbies <span className="text-zinc-600 font-normal">(Optional)</span></h2>
            <p className="text-zinc-500 text-sm">Add any niche interests separated by commas.</p>
          </div>
          <input
            type="text"
            value={hobbyText}
            onChange={(e) => setHobbyText(e.target.value)}
            placeholder="e.g., bouldering, vinyl collecting, film photography"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-white focus:bg-zinc-900 transition-all shadow-sm"
          />
        </div>

        {/* Errors */}
        {creditError && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Insufficient Credits</p>
              <p className="text-sm opacity-90 leading-relaxed">{creditError}</p>
            </div>
          </div>
        )}

        {generalError && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Something went wrong</p>
              <p className="text-sm opacity-90 leading-relaxed">{generalError}</p>
            </div>
          </div>
        )}

        {/* Submit Block (Sticky on Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedModelId}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-14 sm:h-16 text-base sm:text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Starting Photoshoot...
                </>
              ) : (
                <>
                  Generate 100 Photos
                  <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
