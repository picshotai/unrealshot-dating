'use client';

import React, { useEffect, useCallback } from 'react';
import {
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LINEUP_LABELS,
  LINEUP_HINTS,
  lineupRoleFor,
  type LineupRole,
} from '@/lib/dating/lineup';
import type { DatingBucket } from '@/lib/dating/types';

export interface PhotoItem {
  id: string;
  slot: number;
  bucket: DatingBucket;
  imageUrl: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  role?: LineupRole;
  roleLabel?: string;
  roleHint?: string;
}

interface PhotoInspectorModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
  onRegenerate: (photoId: string) => Promise<void>;
  isRegenerating: boolean;
  customCreditsRemaining: number;
}

const ROLE_COLORS: Record<LineupRole, string> = {
  opener: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  fullBody: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  whatYouDo: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  outThere: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  more: 'bg-zinc-800 text-zinc-300 border-zinc-700',
};

export const PhotoInspectorModal: React.FC<PhotoInspectorModalProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onSelectPhoto,
  onRegenerate,
  isRegenerating,
  customCreditsRemaining,
}) => {
  const currentIndex = photos.findIndex((p) => p.id === photo?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onSelectPhoto(photos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      onSelectPhoto(photos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, photos, onSelectPhoto]);

  // Keyboard navigation (Arrow keys & Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !photo) return null;

  const role = photo.role || lineupRoleFor(photo);
  const roleLabel = LINEUP_LABELS[role] || 'Dating Photo';
  const roleHint = LINEUP_HINTS[role] || 'High-converting dating profile photo.';
  const colorClass = ROLE_COLORS[role] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  const isMock = photo.imageUrl.startsWith('data:image/svg+xml');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Lightbox Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left / Center: High-Resolution Photo Viewer */}
        <div className="relative flex-1 flex items-center justify-center bg-black/60 p-4 sm:p-8 min-h-[350px] lg:min-h-[580px]">
          {/* Navigation: Previous Button */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center transition-all active:scale-95 shadow-lg backdrop-blur-md"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image Container with 4:5 Aspect Ratio Constraint */}
          <div className="relative max-w-full max-h-[70vh] aspect-[4/5] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-zinc-800/80 bg-zinc-900">
            <img
              src={photo.imageUrl}
              alt={`${roleLabel} - Photo #${photo.slot}`}
              className="w-full h-full object-cover select-none"
            />

            {/* Position Indicator Badge */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Navigation: Next Button */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center transition-all active:scale-95 shadow-lg backdrop-blur-md"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Sidebar: Details & Actions */}
        <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col justify-between bg-zinc-950/80 backdrop-blur-md">
          {/* Header & Meta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${colorClass}`}
              >
                {roleLabel.toUpperCase()}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {roleLabel}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Photo #{photo.slot} in your photoshoot
              </p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {roleHint}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="space-y-3 pt-6 border-t border-zinc-800/80 mt-6 lg:mt-0">
            {/* Download Button */}
            <a
              href={photo.imageUrl}
              download={`dating-photo-${role}-${photo.slot}.${isMock ? 'svg' : 'png'}`}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button
                variant="default"
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-5 text-sm flex items-center justify-center gap-2 rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
                Download High-Res PNG
              </Button>
            </a>

            {/* Custom Regenerate Button */}
            <Button
              variant="outline"
              disabled={isRegenerating || customCreditsRemaining <= 0}
              onClick={() => onRegenerate(photo.id)}
              className="w-full border-zinc-800 hover:border-zinc-600 bg-zinc-900/80 text-zinc-200 hover:text-white py-5 text-xs font-medium flex items-center justify-center gap-2 rounded-xl"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Variation...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate This Look{' '}
                  <span className="text-zinc-500 font-normal">
                    (1 credit)
                  </span>
                </>
              )}
            </Button>

            {/* Credit Info */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
              <span>Remaining Custom Credits:</span>
              <span className="text-accent font-semibold">
                {customCreditsRemaining} left
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
