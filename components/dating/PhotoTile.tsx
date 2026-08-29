'use client';

import React, { useState } from 'react';
import { Download, Loader2, Maximize2, RefreshCw } from 'lucide-react';
import { ImageGeneration } from '@/components/dating/ImageGeneration';
import { type PhotoItem } from '@/components/dating/PhotoInspectorModal';
import { ConfirmReshootDialog } from '@/components/dating/ConfirmReshootDialog';
import { downloadPhoto, photoFilename } from '@/lib/dating/download';
import { FRAMES_PER_SHOOT } from '@/lib/dating/types';

/**
 * One frame in the grid.
 *
 * The two gallery views — grouped by shoot, and filtered to a single role —
 * rendered this markup twice, ~70 lines each, and had already drifted apart in
 * their badges and alt text. One component, two call sites.
 */
export const PhotoTile: React.FC<{
  photo: PhotoItem;
  isRegenerating: boolean;
  onOpen: (photo: PhotoItem) => void;
  onRegenerate: (photoId: string) => void;
  reshootsRemaining: number;
  /** The filtered view mixes shoots, so a tile has to say which one it is from. */
  showShootTitle?: boolean;
}> = ({
  photo,
  isRegenerating,
  onOpen,
  onRegenerate,
  reshootsRemaining,
  showShootTitle,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const imageUrl = photo.imageUrl;
  const isMock = Boolean(imageUrl?.startsWith('data:image/svg+xml'));

  const handleSave = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!imageUrl || saving) return;
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
        error instanceof Error ? error.message : 'Download failed. Try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const badge = (
    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded">
        {photo.frameIndex}/{FRAMES_PER_SHOOT}
      </span>
      {photo.role === 'opener' && (
        <span className="bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded">
          Opener
        </span>
      )}
    </div>
  );

  // Nothing to show yet. The tile holds its place either way — a photo that
  // vanished mid-reshoot and came back was the most confusing thing in the old
  // grid.
  //
  // The dither field runs a requestAnimationFrame canvas per instance, so it is
  // given only to frames actually being generated. The child queue caps fal at
  // twelve at once, so at most twelve of these ever run together; the rest are
  // queued and get a cheap pulse. Previously it was shown only during a manual
  // reshoot, which meant the loader never appeared during the delivery it was
  // built for.
  if (!imageUrl || photo.status !== 'complete') {
    const isWorking =
      isRegenerating || photo.status === 'generating' || photo.status === 'refining';

    return (
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80">
        {isWorking ? (
          <ImageGeneration
            status={photo.status ?? 'generating'}
            aspectRatio="4 / 5"
            size="fluid"
            resolution={undefined}
            showStatus={false}
            interactive={false}
          />
        ) : photo.status === 'error' ? (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <span className="text-[10px] font-mono text-zinc-600">
              This frame failed
            </span>
          </div>
        ) : (
          <div className="w-full h-full animate-pulse bg-zinc-800/60" />
        )}
        {badge}
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => onOpen(photo)}
        className={`group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border shadow-md transition-all duration-200 cursor-pointer select-none ${
          photo.role === 'opener'
            ? 'border-amber-500/30 hover:border-amber-400/60'
            : 'border-zinc-800/80 hover:border-zinc-500'
        }`}
      >
        <img
          src={imageUrl}
          alt={`${photo.shootTitle} — frame ${photo.frameIndex}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {badge}

        {/*
          Always visible on touch, hover-revealed from `sm` up.
          A phone has no hover, so `opacity-0 group-hover:opacity-100` left these
          controls invisible AND still clickable — tapping a photo to enlarge it
          could land on Reshoot and spend one without the user ever seeing a
          button. Visible on small screens, and confirmed either way.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between z-20">
          <div className="flex justify-end">
            <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10">
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <div className="text-[11px] font-medium text-white truncate drop-shadow">
              {showShootTitle ? photo.shootTitle : photo.roleLabel}
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-white text-black hover:bg-zinc-200 rounded-lg py-1.5 transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" strokeWidth={1.5} />
                )}
                Save
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={isRegenerating}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg py-1.5 border border-zinc-700 transition-colors"
              >
                {isRegenerating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                )}
                Retake
              </button>
            </div>
            {saveError && (
              <p className="text-[10px] leading-tight text-red-300" role="alert">
                {saveError}
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmReshootDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isRegenerating={isRegenerating}
        reshootsRemaining={reshootsRemaining}
        shootTitle={photo.shootTitle}
        frameIndex={photo.frameIndex}
        onConfirm={() => {
          setConfirmOpen(false);
          onRegenerate(photo.id);
        }}
      />
    </>
  );
};
