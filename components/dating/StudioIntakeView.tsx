'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  INTEREST_CHIPS,
  EXCLUSION_CHIPS,
  type InterestId,
} from '@/lib/dating/interests';
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
  showCancel: boolean;
}

const WARDROBE_LOOKS: Array<{
  id: StylePref;
  label: string;
  hint: string;
  imageUrl: string;
}> = [
  {
    id: 'casual',
    label: 'Casual',
    hint: 'Henleys, knits, denim, boots',
    imageUrl:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sharp',
    label: 'Sharp',
    hint: 'Tailoring, coats, collars, leather',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'street',
    label: 'Street',
    hint: 'Jackets, layers, modern sneakers',
    imageUrl:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80',
  },
];

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
  const [step, setStep] = useState<'configure' | 'confirm'>('configure');
  const [dress, setDress] = useState<StylePref>('casual');
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>([]);
  const [hobbyText, setHobbyText] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel =
    models.find((m) => m.id === selectedModelId) || models[0];

  const selectedWardrobe =
    WARDROBE_LOOKS.find((w) => w.id === dress) || WARDROBE_LOOKS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const hasSelectedInterests =
    interests.length > 0 || hobbyText.trim().length > 0;
  const canProceed =
    Boolean(selectedModelId) && hasSelectedInterests && !isLoading;

  const handleFinalSubmit = () => {
    if (!canProceed || !selectedModelId) return;
    onSubmit({
      modelId: selectedModelId,
      interests,
      dress,
      excludeTags,
      hobbyText,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-2xl sm:max-w-3xl w-full mx-auto space-y-6">
        {/* 1. Header Bar with Integrated Face Model Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="relative" ref={dropdownRef}>
            {models.length > 1 ? (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    step === 'configure' &&
                    setIsModelDropdownOpen(!isModelDropdownOpen)
                  }
                  disabled={step === 'confirm'}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left disabled:opacity-80"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
                    {currentModel?.samples?.[0]?.uri ? (
                      <img
                        src={currentModel.samples[0].uri}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-tight font-oxanium">
                        {currentModel?.name || 'Select Model'}
                      </span>
                      {step === 'configure' && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                            isModelDropdownOpen ? 'rotate-180 text-white' : ''
                          }`}
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {currentModel?.samples?.length || 0} sample photos ·{' '}
                      {step === 'configure' ? 'Click to switch' : 'Active Model'}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-oxanium">
                      Select Face Model ({models.length})
                    </div>
                    {models.map((model) => {
                      const isActive = selectedModelId === model.id;
                      const avatar = model.samples?.[0]?.uri;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            onSelectModel(model.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-zinc-900 text-white font-semibold'
                              : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                <ImageIcon className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs truncate font-oxanium">
                              {model.name || 'Model'}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                              {model.samples?.length || 0} samples
                            </p>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
                  {currentModel?.samples?.[0]?.uri ? (
                    <img
                      src={currentModel.samples[0].uri}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-white tracking-tight font-oxanium">
                      {currentModel?.name || 'Trained Face Model'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {currentModel?.samples?.length || 0} training samples
                  </p>
                </div>
              </div>
            )}
          </div>

          {showCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-oxanium"
            >
              Cancel <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. MAIN WORKFLOW: Step 1 (Configure) vs Step 2 (Inline Smooth Confirmation) */}
        {step === 'configure' ? (
          /* STEP 1: CONFIGURATION FORM */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Section 1: Wardrobe Tone */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-medium text-zinc-200 font-oxanium">
                    Which look should we lead with?
                  </h2>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Leads ~65% of shots
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Sets the dominant wardrobe tone (~65%), balanced with the other two looks.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {WARDROBE_LOOKS.map((opt) => {
                  const isActive = dress === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setDress(opt.id)}
                      className={`relative rounded-lg border p-2 sm:p-3 text-left transition-all active:scale-[0.98] flex flex-col justify-between group ${
                        isActive
                          ? 'bg-zinc-900 border-white text-white shadow-md ring-1 ring-white/20'
                          : 'bg-zinc-950/70 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {/* Visual Outfit Image */}
                      <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-zinc-900 mb-2 border border-zinc-800/60">
                        <img
                          src={opt.imageUrl}
                          alt={opt.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-semibold text-white font-oxanium">
                            {opt.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate sm:whitespace-normal mt-0.5 leading-snug">
                          {opt.hint}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Activities & Interests */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-medium text-zinc-200 font-oxanium">
                    What do you actually do?
                  </h2>
                  <span
                    className={`text-[11px] font-mono ${
                      hasSelectedInterests
                        ? 'text-zinc-400'
                        : 'text-amber-400 font-medium'
                    }`}
                  >
                    {interests.length > 0
                      ? `${interests.length} selected`
                      : 'Select at least 1 activity'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Tap the activities that represent your genuine lifestyle.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {INTEREST_CHIPS.map((chip) => {
                  const isActive = interests.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleInterest(chip.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                        isActive
                          ? 'bg-white text-black border-white font-semibold shadow-sm'
                          : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Exclusions */}
            <div className="space-y-2">
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-zinc-200 font-oxanium">
                  Anything to leave out?{' '}
                  <span className="text-zinc-500 font-normal font-sans">
                    (Optional)
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  We will completely exclude these themes from your 100 photos.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {EXCLUSION_CHIPS.map((chip) => {
                  const isActive = excludeTags.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleExclusion(chip.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                        isActive
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 font-semibold'
                          : 'bg-zinc-950/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm grayscale opacity-70">
                        {chip.emoji}
                      </span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Custom Specific Hobbies */}
            <div className="space-y-2">
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-zinc-200 font-oxanium">
                  Custom Specific Hobbies{' '}
                  <span className="text-zinc-500 font-normal font-sans">
                    (Optional)
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Add any niche interests separated by commas, only one word each.
                </p>
              </div>
              <input
                type="text"
                value={hobbyText}
                onChange={(e) => setHobbyText(e.target.value)}
                placeholder="e.g. bouldering, vinyl records, film photography"
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* Errors */}
            {creditError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold font-oxanium">Insufficient Credits</p>
                  <p className="opacity-90 mt-0.5">{creditError}</p>
                </div>
              </div>
            )}

            {generalError && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold font-oxanium">Error</p>
                  <p className="opacity-90 mt-0.5">{generalError}</p>
                </div>
              </div>
            )}

            {/* Bottom Review Action Bar */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-zinc-400 text-center sm:text-left">
                Includes <span className="text-white font-semibold">100 Photos</span> +{' '}
                <span className="text-accent font-semibold">30 Custom Retakes</span>
              </div>

              <Button
                onClick={() => setStep('confirm')}
                disabled={!canProceed}
                className={`w-full sm:w-auto font-semibold text-xs sm:text-sm h-10 px-6 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-oxanium ${
                  canProceed
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
                }`}
              >
                {!hasSelectedInterests ? (
                  <>Select At Least 1 Activity</>
                ) : !selectedModelId ? (
                  <>Select Face Model</>
                ) : (
                  <>
                    Review & Confirm Setup
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: INLINE SMOOTH EXPANDING CONFIRMATION BLUEPRINT */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl">
              {/* Review Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-oxanium tracking-tight">
                    Photoshoot Blueprint Confirmation
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Review your curated parameters before dispatching 100 AI photo generations.
                  </p>
                </div>
              </div>

              {/* Grid: 2 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card A: Model & Wardrobe */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-oxanium">
                    Model & Wardrobe Lead
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                      <img
                        src={selectedWardrobe.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white font-oxanium">
                        {selectedWardrobe.label} (~65% Lead)
                      </div>
                      <div className="text-xs text-zinc-400">
                        {currentModel?.name || 'Trained Model'}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        {selectedWardrobe.hint}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card B: Lifestyle & Custom Hobbies */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-oxanium">
                    Lifestyle & Exclusions
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {interests.map((id) => {
                        const chip = INTEREST_CHIPS.find((c) => c.id === id);
                        return (
                          <span
                            key={id}
                            className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[11px]"
                          >
                            {chip?.emoji} {chip?.label}
                          </span>
                        );
                      })}
                      {hobbyText && (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">
                          + {hobbyText}
                        </span>
                      )}
                    </div>
                    {excludeTags.length > 0 && (
                      <div className="text-[11px] text-red-400 font-mono pt-1">
                        Excluding: {excludeTags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card C: 5 Lineup Profile Roles Breakdown */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-oxanium font-medium text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    Structured Delivery (100 Photos):
                  </span>
                  <span className="text-white font-mono">100 / 100 Delivered</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <div className="text-white font-bold font-oxanium text-sm">
                      3
                    </div>
                    <div className="text-[10px] text-zinc-400">Opener</div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <div className="text-white font-bold font-oxanium text-sm">
                      23
                    </div>
                    <div className="text-[10px] text-zinc-400">Full Body</div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <div className="text-white font-bold font-oxanium text-sm">
                      20
                    </div>
                    <div className="text-[10px] text-zinc-400">What You Do</div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <div className="text-white font-bold font-oxanium text-sm">
                      40
                    </div>
                    <div className="text-[10px] text-zinc-400">Out in World</div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 col-span-2 sm:col-span-1">
                    <div className="text-white font-bold font-oxanium text-sm">
                      14
                    </div>
                    <div className="text-[10px] text-zinc-400">The Rest</div>
                  </div>
                </div>
              </div>

              {/* Errors if any */}
              {creditError && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-oxanium">
                      Insufficient Credits
                    </p>
                    <p className="opacity-90 mt-0.5">{creditError}</p>
                  </div>
                </div>
              )}

              {generalError && (
                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-oxanium">Error</p>
                    <p className="opacity-90 mt-0.5">{generalError}</p>
                  </div>
                </div>
              )}

              {/* Dual Action Confirmation Row */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('configure')}
                  disabled={isLoading}
                  className="w-full sm:w-auto border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm h-11 px-5 rounded-lg font-oxanium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  ← Edit Parameters
                </Button>

                <Button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm h-11 px-7 rounded-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 font-oxanium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching 100 Generations...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-black" strokeWidth={2.5} />
                      Confirm & Start 100-Photo Shoot
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
