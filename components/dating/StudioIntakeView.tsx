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
  RotateCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  INTEREST_CHIPS,
  EXCLUSION_CHIPS,
  EXCLUSION_CONFLICTS,
  type InterestId,
} from '@/lib/dating/interests';
import {
  CUSTOM_CREDITS_DEFAULT,
  FRAMES_PER_SHOOT,
  type ExcludableTag,
} from '@/lib/dating/types';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

interface StudioIntakeViewProps {
  userId: string;
  hasPack: boolean;
  isPaymentPendingSync?: boolean;
  onRefreshPackStatus?: () => void;
  models: Model[];
  selectedModelId: number | null;
  onSelectModel: (id: number) => void;
  onSubmit: (params: {
    modelId: number;
    interests: InterestId[];
    excludeTags: ExcludableTag[];
    includeSimpleCandids: boolean;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
  creditError: string;
  generalError: string;
  showCancel: boolean;
  shootsPerDelivery: number;
  totalPhotos: number;
  initialDraft?: {
    interests?: InterestId[];
    excludeTags?: ExcludableTag[];
    includeSimpleCandids?: boolean;
  } | null;
  initialStep?: 'configure' | 'confirm';
  ownerDiagnostics?: {
    testMode: 'mock' | 'sample' | 'off';
    sampleShoots: number;
  } | null;
}

export const StudioIntakeView: React.FC<StudioIntakeViewProps> = ({
  userId,
  hasPack,
  isPaymentPendingSync = false,
  onRefreshPackStatus,
  models,
  selectedModelId,
  onSelectModel,
  onSubmit,
  onCancel,
  isLoading,
  creditError,
  generalError,
  showCancel,
  shootsPerDelivery,
  totalPhotos,
  initialDraft,
  initialStep,
  ownerDiagnostics,
}) => {
  const [step, setStep] = useState<'configure' | 'confirm'>(
    initialStep || (initialDraft ? 'confirm' : 'configure')
  );
  const [interests, setInterests] = useState<InterestId[]>(
    initialDraft?.interests || []
  );
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>(
    initialDraft?.excludeTags || []
  );
  const [includeSimpleCandids, setIncludeSimpleCandids] = useState(
    initialDraft?.includeSimpleCandids !== undefined
      ? initialDraft.includeSimpleCandids
      : true
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync draft state if initialDraft is hydrated after mount
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.interests) setInterests(initialDraft.interests);
      if (initialDraft.excludeTags) setExcludeTags(initialDraft.excludeTags);
      if (initialDraft.includeSimpleCandids !== undefined) {
        setIncludeSimpleCandids(initialDraft.includeSimpleCandids);
      }
      if (initialStep) setStep(initialStep);
    }
  }, [initialDraft, initialStep]);

  const handleUnlockAndCheckout = async () => {
    if (!selectedModelId) return;
    setIsCheckingOut(true);
    setCheckoutError('');

    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'unrealshot_pending_shoot',
          JSON.stringify({
            modelId: selectedModelId,
            interests,
            excludeTags,
            includeSimpleCandids,
            timestamp: Date.now(),
          })
        );
      }
    } catch (e) {
      console.warn('Failed to save pending shoot state to sessionStorage:', e);
    }

    try {
      const response = await fetch('/api/dodopayments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/payment-success?resume=dating-shoot`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.checkout_url) {
        throw new Error(data.message || data.error || 'Failed to initiate checkout session');
      }

      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err instanceof Error ? err.message : 'Could not launch checkout');
      setIsCheckingOut(false);
    }
  };

  const currentModel =
    models.find((m) => m.id === selectedModelId) || null;
  const interestLimit = Math.min(6, shootsPerDelivery);

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
    if (interests.includes(id)) {
      setInterests((current) => current.filter((interest) => interest !== id));
      return;
    }
    if (interests.length >= interestLimit) return;
    const conflicting = (Object.entries(EXCLUSION_CONFLICTS) as Array<[
      ExcludableTag,
      InterestId | undefined
    ]>).find(([, interest]) => interest === id)?.[0];
    if (conflicting) {
      setExcludeTags((current) => current.filter((tag) => tag !== conflicting));
    }
    setInterests((current) => [...current, id]);
  };

  const toggleExclusion = (id: ExcludableTag) => {
    if (excludeTags.includes(id)) {
      setExcludeTags((current) => current.filter((tag) => tag !== id));
      return;
    }
    const conflictingInterest = EXCLUSION_CONFLICTS[id];
    if (conflictingInterest) {
      setInterests((current) =>
        current.filter((interest) => interest !== conflictingInterest)
      );
    }
    setExcludeTags((current) => [...current, id]);
  };

  const hasSelectedInterests = interests.length > 0;
  const canProceed =
    Boolean(selectedModelId) && hasSelectedInterests && !isLoading;
  const needsPurchase = !hasPack || Boolean(creditError);

  const handleFinalSubmit = () => {
    if (!canProceed || !selectedModelId) return;
    onSubmit({
      modelId: selectedModelId,
      interests,
      excludeTags,
      includeSimpleCandids,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 select-none font-sans">
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
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border transition-all text-left disabled:opacity-80 ${
                    selectedModelId
                      ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700'
                      : 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20'
                  }`}
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
                        {currentModel?.name || 'Select Face Model'}
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
                      {step === 'configure' ? (selectedModelId ? 'Click to switch' : 'Click to select') : 'Active Model'}
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
            ) : models.length === 1 ? (
              <button
                type="button"
                onClick={() => step === 'configure' && onSelectModel(models[0].id)}
                disabled={step === 'confirm'}
                className={`flex items-center gap-3 p-1.5 pr-3 rounded-lg border transition-all text-left ${
                  selectedModelId === models[0].id
                    ? 'border-zinc-800 bg-zinc-900/40'
                    : 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer animate-pulse'
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
                  {models[0]?.samples?.[0]?.uri ? (
                    <img
                      src={models[0].samples[0].uri}
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
                      {models[0]?.name || 'Trained Face Model'}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      selectedModelId === models[0].id
                        ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold'
                    }`}>
                      {selectedModelId === models[0].id ? 'Active' : 'Click to Select'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {selectedModelId === models[0].id ? `${models[0]?.samples?.length || 0} training samples` : 'Select this model to continue'}
                  </p>
                </div>
              </button>
            ) : null}
          </div>

          {showCancel && (
            <button
              onClick={onCancel}
              className="h-12 text-xs text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-oxanium"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {ownerDiagnostics && (
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-3 text-xs text-emerald-200">
            <p className="font-semibold font-oxanium">
              Intelligent portfolio → Gemini prompts
            </p>
            <p className="mt-1 opacity-80 font-mono text-[10px] leading-relaxed">
              Test mode {ownerDiagnostics.testMode}
              {ownerDiagnostics.testMode === 'sample'
                ? ` · ${ownerDiagnostics.sampleShoots} complete Fal sample shoots`
                : ''}
            </p>
          </div>
        )}

        {/* 2. MAIN WORKFLOW: Step 1 (Configure) vs Step 2 (Inline Smooth Confirmation) */}
        {step === 'configure' ? (
          /* STEP 1: CONFIGURATION FORM */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Activities & Interests */}
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
                      ? `${interests.length}/${interestLimit} selected`
                      : 'Select at least 1 activity'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Choose up to {interestLimit} real parts of your life. Every selection will be visibly represented in at least one shoot—not merely used as inspiration.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {INTEREST_CHIPS.map((chip) => {
                  const isActive = interests.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleInterest(chip.id)}
                      disabled={!isActive && interests.length >= interestLimit}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                        isActive
                          ? 'bg-white text-black border-white font-semibold shadow-sm'
                          : interests.length >= interestLimit
                            ? 'bg-zinc-950/60 text-zinc-700 border-zinc-900 cursor-not-allowed'
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

            {/* This is a portfolio-mix preference, not one of the six activities. */}
            <div className="space-y-2">
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-zinc-200 font-oxanium">
                  What kind of moments should be in the mix?
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  This does not use one of your activity selections.
                </p>
              </div>
              <button
                type="button"
                aria-pressed={includeSimpleCandids}
                onClick={() => setIncludeSimpleCandids((current) => !current)}
                className={`w-full rounded-xl border p-3 text-left transition-all active:scale-[0.995] ${
                  includeSimpleCandids
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-semibold font-oxanium">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Simple candids
                  <span className="ml-auto text-[10px] font-mono font-normal text-zinc-500">
                    {includeSimpleCandids ? 'Included' : 'Off'}
                  </span>
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-zinc-500">
                  Include at least two shoots where you—not an activity or prop—carry the photograph.
                </span>
              </button>
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
                  These are absolute: the planner cannot place them anywhere in your delivery. Selecting a direct conflict removes the matching activity.
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
                Includes{' '}
                <span className="text-white font-semibold">
                  {shootsPerDelivery} shoots · {totalPhotos} photos
                </span>{' '}
                + <span className="text-accent font-semibold">{CUSTOM_CREDITS_DEFAULT} Photo Retakes</span>
                {' '}· <span className="text-emerald-400 font-semibold">$39 (one-time)</span>
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
                    Review &amp; Confirm Setup
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
                    Review your setup before we shoot {shootsPerDelivery} sessions for you.
                  </p>
                </div>
              </div>

              {/* Grid: summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card A: Model */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-oxanium">
                    Model &amp; context-aware wardrobe
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                      {currentModel?.samples?.[0]?.uri ? (
                        <img src={currentModel.samples[0].uri} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 m-4 text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white font-oxanium">
                        {currentModel?.name || 'Trained Model'}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                        Clothing is chosen separately for every real occasion, activity, weather and location.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card B: Lifestyle & Custom Hobbies */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-oxanium">
                    Lifestyle &amp; Exclusions
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
                      {includeSimpleCandids && (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200 text-[11px]">
                          ✨ Simple candids · at least 2 shoots
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

              {/* Card C: Delivery breakdown */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-oxanium font-medium text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    {shootsPerDelivery} shoots · {totalPhotos} photos
                  </span>
                  <span className="text-white font-mono">
                    {FRAMES_PER_SHOOT} frames each
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Each shoot is one location, one outfit and one light, shot {FRAMES_PER_SHOOT} times during one believable occasion. The moment decides each expression, body position and crop.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                  {[
                    { label: 'One occasion', hint: 'A life moment' },
                    { label: 'One place', hint: 'Stable world' },
                    { label: 'One outfit', hint: 'Context correct' },
                    { label: 'Four moments', hint: 'Scene led' },
                  ].map((frame) => (
                    <div
                      key={frame.label}
                      className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80"
                    >
                      <div className="text-white font-bold font-oxanium text-sm">
                        {frame.label}
                      </div>
                      <div className="text-[10px] text-zinc-400">{frame.hint}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to start / Recovery Card */}
              {isPaymentPendingSync ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 shadow-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold font-oxanium text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      Payment received. Synchronizing your photoshoot pack…
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Your payment was successful and your wallet credits are syncing with our server. Please wait a moment or click &quot;Check Sync Status&quot;.
                  </p>
                </div>
              ) : needsPurchase ? (
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/30 text-zinc-200 shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold font-oxanium text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Your {shootsPerDelivery} shoots are ready to start
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      $39 one-time
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {shootsPerDelivery} shoots · {totalPhotos} photos · {CUSTOM_CREDITS_DEFAULT} Photo Retakes included. Your shoot starts instantly after checkout.
                  </p>
                </div>
              ) : null}

              {checkoutError && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-oxanium">Checkout Error</p>
                    <p className="opacity-90 mt-0.5">{checkoutError}</p>
                  </div>
                </div>
              )}

              {/* Dual Action Confirmation Row */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('configure')}
                  disabled={isLoading || isCheckingOut}
                  className="w-full sm:w-auto border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm h-11 px-5 rounded-lg font-oxanium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Edit Parameters
                </Button>

                {isPaymentPendingSync ? (
                  <Button
                    onClick={onRefreshPackStatus}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm h-11 px-7 rounded-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 font-oxanium cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    Check Sync Status
                  </Button>
                ) : !needsPurchase ? (
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isLoading || isCheckingOut}
                    className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm h-11 px-7 rounded-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 font-oxanium cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking your shoots...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-black" strokeWidth={2.5} />
                        Confirm &amp; start {shootsPerDelivery} shoots (1 Pack Available)
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUnlockAndCheckout}
                    disabled={isLoading || isCheckingOut}
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm h-11 px-7 rounded-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 font-oxanium cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Launching checkout...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Unlock &amp; start {shootsPerDelivery} shoots — $39 →
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
