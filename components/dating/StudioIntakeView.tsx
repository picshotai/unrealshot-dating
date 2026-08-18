'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Image as ImageIcon,
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
  const [dress, setDress] = useState<StylePref>('casual');
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>([]);
  const [hobbyText, setHobbyText] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel =
    models.find((m) => m.id === selectedModelId) || models[0];

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
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden md:h-auto md:max-h-none md:overflow-visible bg-background text-foreground flex flex-col justify-between md:block px-4 py-3 sm:py-6 md:py-10 sm:px-6 select-none">
      <div className="max-w-2xl md:max-w-3xl w-full mx-auto flex-1 flex flex-col justify-between md:block md:space-y-6 overflow-hidden md:overflow-visible">
        {/* 1. Header Bar with Face Model Selector */}
        <div className="flex items-center justify-between pb-2.5 md:pb-4 border-b border-zinc-800/80 shrink-0">
          <div className="relative" ref={dropdownRef}>
            {models.length > 1 ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pr-2.5 md:p-1.5 md:pr-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
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
                      <span className="text-xs md:text-sm font-semibold text-white tracking-tight">
                        {currentModel?.name || 'Select Model'}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 transition-transform duration-200 ${
                          isModelDropdownOpen ? 'rotate-180 text-white' : ''
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-[10px] md:text-[11px] text-zinc-500 font-mono">
                      {currentModel?.samples?.length || 0} sample photos · Switch
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
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
                            <p className="text-xs truncate">{model.name || 'Model'}</p>
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
              <div className="flex items-center gap-2.5 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
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
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-xs md:text-sm font-semibold text-white tracking-tight">
                      {currentModel?.name || 'Trained Face Model'}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] md:text-[11px] text-zinc-500 font-mono">
                    {currentModel?.samples?.length || 0} sample photos
                  </p>
                </div>
              </div>
            )}
          </div>

          {showCancel && (
            <button
              onClick={onCancel}
              className="text-xs md:text-xs text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              Cancel <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Form Body */}
        <div className="flex-1 flex flex-col justify-around md:justify-start py-2 md:py-0 space-y-2 md:space-y-6 overflow-hidden md:overflow-visible">
          {/* Primary Wardrobe Look - 1 Horizontal Row with Generous Proportions on Desktop */}
          <div className="space-y-1.5 md:space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] md:text-xs font-medium text-zinc-300">
                Primary Wardrobe Look
              </label>
              <span className="text-[10px] md:text-[11px] text-zinc-500 font-mono">
                Leads ~65% of shots
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3.5">
              {WARDROBE_LOOKS.map((opt) => {
                const isActive = dress === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDress(opt.id)}
                    className={`relative rounded-lg border p-1.5 md:p-3 text-left transition-all active:scale-[0.98] flex flex-col justify-between group ${
                      isActive
                        ? 'bg-zinc-900 border-white text-white shadow-md ring-1 ring-white/20'
                        : 'bg-zinc-950/70 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {/* Visual Outfit Image */}
                    <div className="w-full aspect-[4/3] md:aspect-[16/10] rounded-md overflow-hidden bg-zinc-900 mb-1.5 md:mb-2.5 border border-zinc-800/60">
                      <img
                        src={opt.imageUrl}
                        alt={opt.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-semibold text-white">
                          {opt.label}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <p className="text-[10px] md:text-[11px] text-zinc-500 truncate md:whitespace-normal mt-0.5 leading-snug">
                        {opt.hint}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities & Lifestyle */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] md:text-xs font-medium text-zinc-300">
                Activities & Interests
              </label>
              <span className="text-[10px] md:text-[11px] text-zinc-500 font-mono">
                {interests.length > 0 ? `${interests.length} selected` : 'Select what you do'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 md:gap-1.5 max-h-[85px] md:max-h-none overflow-hidden md:overflow-visible">
              {INTEREST_CHIPS.map((chip) => {
                const isActive = interests.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => toggleInterest(chip.id)}
                    className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[11px] md:text-xs font-medium border transition-all flex items-center gap-1 md:gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-[11px] md:text-xs">{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leave Out (Optional) */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-[11px] md:text-xs font-medium text-zinc-300">
              Leave Out <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {EXCLUSION_CHIPS.map((chip) => {
                const isActive = excludeTags.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => toggleExclusion(chip.id)}
                    className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[11px] md:text-xs font-medium border transition-all flex items-center gap-1 md:gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-zinc-950/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    <span className="text-[11px] md:text-xs grayscale opacity-70">
                      {chip.emoji}
                    </span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hobbies Input */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-[11px] md:text-xs font-medium text-zinc-300">
              Custom Specific Hobbies{' '}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={hobbyText}
              onChange={(e) => setHobbyText(e.target.value)}
              placeholder="e.g. bouldering, vinyl records, film photography"
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-1.5 md:py-2.5 text-[11px] md:text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Alerts */}
          {creditError && (
            <div className="p-2 md:p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2 text-[11px] md:text-xs">
              <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 mt-0.5" />
              <p className="truncate md:whitespace-normal">{creditError}</p>
            </div>
          )}

          {generalError && (
            <div className="p-2 md:p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2 text-[11px] md:text-xs">
              <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 mt-0.5" />
              <p className="truncate md:whitespace-normal">{generalError}</p>
            </div>
          )}
        </div>

        {/* 3. Bottom Launch Action */}
        <div className="pt-2 md:pt-6 pb-1 shrink-0 flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedModelId}
            className="w-full max-w-sm bg-white text-black hover:bg-zinc-200 font-bold text-xs md:text-sm h-11 md:h-12 px-6 rounded-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating Photoshoot...
              </>
            ) : (
              <>
                Start 100-Photo Shoot
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
              </>
            )}
          </Button>
          <span className="text-[10px] md:text-[11px] font-mono text-zinc-500 mt-1.5 md:mt-2">
            Includes <span className="text-white">100 Photos</span> +{' '}
            <span className="text-accent">30 Custom Retakes</span>
          </span>
        </div>
      </div>
    </div>
  );
};
