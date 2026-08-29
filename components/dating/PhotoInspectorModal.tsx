'use client';

import React, { useEffect, useCallback, useState } from 'react';
import {
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LINEUP_LABELS,
  LINEUP_HINTS,
  lineupRoleFor,
  type LineupRole,
} from '@/lib/dating/roles';
import { FRAMES_PER_SHOOT } from '@/lib/dating/types';
import {
  ImageGeneration,
  type ImageGenerationStatus,
} from '@/components/dating/ImageGeneration';
import { ConfirmReshootDialog } from '@/components/dating/ConfirmReshootDialog';
import { downloadPhoto, photoFilename } from '@/lib/dating/download';

export interface PhotoItem {
  id: string;
  /** Which authored shoot this frame belongs to. */
  shootId: string;
  /** The shoot's user-facing name, e.g. "Kitchen, morning". */
  shootTitle: string;
  /** 1-based position within the shoot. */
  frameIndex: number;
  /** The frame the other three were generated against. */
  isAnchor?: boolean;
  /** Null while the photo is queued, generating or being reshot. */
  imageUrl: string | null;
  status?: ImageGenerationStatus;
  imageWidth?: number | null;
  imageHeight?: number | null;
  role?: LineupRole;
  roleLabel?: string;
  roleHint?: string;
}

/** Shoot titles are prose ("Kitchen, morning"); filenames are not. */
export function slugify(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'shoot'
  );
}

interface PhotoInspectorModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
  onRegenerate: (photoId: string, feedback?: string) => Promise<void>;
  isRegenerating: boolean;
  customCreditsRemaining: number;
}

const ROLE_COLORS: Record<LineupRole, string> = {
  opener: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  fullBody: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  whatYouDo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  outThere: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  more: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
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

  const role =
    photo.role ||
    lineupRoleFor({ shootId: photo.shootId, frameIndex: photo.frameIndex });
  const roleLabel = photo.roleLabel || LINEUP_LABELS[role] || 'Dating Photo';
  const roleHint = photo.roleHint || LINEUP_HINTS[role] || 'A context-led dating profile photo.';
  const colorClass = ROLE_COLORS[role] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  const imageUrl = photo.imageUrl;
  const isMock = Boolean(imageUrl?.startsWith('data:image/svg+xml'));
  const generationStatus = photo.status ?? (imageUrl ? 'complete' : 'generating');
  const isReady = generationStatus === 'complete' && Boolean(imageUrl);
  const aspectRatio =
    photo.imageWidth && photo.imageHeight
      ? `${photo.imageWidth} / ${photo.imageHeight}`
      : '3 / 4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Lightbox Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full sm:h-auto sm:max-h-[90vh] max-w-6xl bg-zinc-950 sm:border border-zinc-800 sm:rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Mobile Top Bar (Close button on small screens only) */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:hidden flex justify-end z-30">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Left / Center: Image Viewer (Responsive, non-cropping) */}
        <div className="relative flex-1 flex items-center justify-center bg-black p-0 sm:p-6 lg:p-8 min-h-[50vh]">
          {/* Navigation: Previous Button */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 flex items-center justify-center transition-all active:scale-95 shadow-lg backdrop-blur-md"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}

          {/* Image Container - Using flex instead of hardcoded aspect ratio for max responsiveness */}
          <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
            {isReady ? (
              <img
                src={imageUrl ?? undefined}
                alt={`${photo.shootTitle} — frame ${photo.frameIndex}`}
                className="w-full h-full object-contain select-none max-w-full max-h-full"
              />
            ) : (
              <div className="w-full max-w-md">
                <ImageGeneration
                  status={generationStatus}
                  aspectRatio={aspectRatio}
                  size="fluid"
                  resolution={
                    photo.imageWidth && photo.imageHeight
                      ? `${photo.imageWidth} × ${photo.imageHeight}`
                      : undefined
                  }
                  statusText={
                    generationStatus === 'error'
                      ? 'Photo Retake failed'
                      : 'Retaking photo'
                  }
                  onRetry={() => void onRegenerate(photo.id)}
                />
              </div>
            )}
          </div>

          {/* Navigation: Next Button */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 flex items-center justify-center transition-all active:scale-95 shadow-lg backdrop-blur-md"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}

          {/* Position Indicator Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2.5 py-1 rounded-full z-20">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Right / Bottom Sidebar: Details & Actions */}
        <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800 p-5 sm:p-6 flex flex-col justify-between bg-zinc-950 overflow-y-auto">
          {/* Header & Meta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${colorClass}`}
              >
                {roleLabel}
              </span>
              <button
                onClick={onClose}
                className="hidden sm:flex w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white items-center justify-center transition-colors border border-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-medium text-white tracking-tight">
                {photo.shootTitle}
              </h3>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">
                Frame {photo.frameIndex} of {FRAMES_PER_SHOOT}
              </p>
              <p className="text-xs text-zinc-500 font-sans mt-2 leading-relaxed">
                {roleHint}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="space-y-2.5 pt-6 mt-auto">
            {/* Download Button — nothing to download until the frame lands */}
            <Button
              variant="default"
              disabled={!isReady || saving}
              onClick={async () => {
                if (!imageUrl) return;
                setSaving(true);
                setSaveError('');
                try {
                  await downloadPhoto(
                    photo.id,
                    imageUrl,
                    photoFilename(photo.shootTitle, photo.frameIndex, isMock)
                  );
                } catch (error) {
                  setSaveError(
                    error instanceof Error
                      ? error.message
                      : 'Download failed. Try again.'
                  );
                } finally {
                  setSaving(false);
                }
              }}
              className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-12 text-sm flex items-center justify-center gap-2 rounded-lg transition-all"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" strokeWidth={1.5} />
              )}
              {saving ? 'Saving…' : 'Download full size'}
            </Button>
            {/* Custom Regenerate Button */}
            <Button
              variant="outline"
              disabled={isRegenerating}
              onClick={() => setConfirmOpen(true)}
              className="w-full border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-300 hover:text-white h-12 text-xs font-medium flex items-center justify-center gap-2 rounded-lg transition-colors"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Retaking photo...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                  Retake This Photo
                  <span className="text-zinc-600 font-normal ml-1">
                    (1 retake)
                  </span>
                </>
              )}
            </Button>

            {/* Photo Retakes remaining on this order */}
            <div className="text-center mt-2">
              <span className="text-[10px] font-mono text-zinc-600">
                {customCreditsRemaining} Photo Retakes left
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmReshootDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isRegenerating={isRegenerating}
        reshootsRemaining={customCreditsRemaining}
        shootTitle={photo.shootTitle}
        frameIndex={photo.frameIndex}
        onConfirm={(feedback) => {
          setConfirmOpen(false);
          void onRegenerate(photo.id, feedback);
        }}
      />
    </div>
  );
};
