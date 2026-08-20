'use client';

import React from 'react';
import { Download, Loader2, Maximize2, RefreshCw } from 'lucide-react';
import {
  ImageGeneration,
} from '@/components/dating/ImageGeneration';
import { slugify, type PhotoItem } from '@/components/dating/PhotoInspectorModal';
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
  /** The filtered view mixes shoots, so a tile has to say which one it is from. */
  showShootTitle?: boolean;
}> = ({ photo, isRegenerating, onOpen, onRegenerate, showShootTitle }) => {
  const imageUrl = photo.imageUrl;
  const isMock = Boolean(imageUrl?.startsWith('data:image/svg+xml'));

  const badge = (
    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded">
        {photo.frameIndex}/{FRAMES_PER_SHOOT}
      </span>
      {photo.isAnchor && (
        // The frame the other three were generated against. Worth marking: it is
        // the most face-forward shot in the shoot, which makes it the opener.
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
  // Only the tile being reshot gets the dither field: it runs a
  // requestAnimationFrame canvas per instance, and during first delivery every
  // tile is pending at once.
  if (!imageUrl || photo.status !== 'complete') {
    return (
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80">
        {isRegenerating ? (
          <ImageGeneration
            status={photo.status ?? 'generating'}
            aspectRatio="4 / 5"
            size="fluid"
            resolution={undefined}
            showStatus={false}
            interactive={false}
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-zinc-800/60" />
        )}
        {badge}
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(photo)}
      className={`group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border shadow-md transition-all duration-200 cursor-pointer select-none ${
        photo.isAnchor
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between z-20">
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
            <a
              href={imageUrl}
              download={`${slugify(photo.shootTitle)}-${photo.frameIndex}.${isMock ? 'svg' : 'png'}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-white text-black hover:bg-zinc-200 rounded-lg py-1.5 transition-colors"
            >
              <Download className="w-3 h-3" strokeWidth={1.5} /> Save
            </a>
            <button
              onClick={() => onRegenerate(photo.id)}
              disabled={isRegenerating}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg py-1.5 border border-zinc-700 transition-colors"
            >
              {isRegenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
              )}
              Reshoot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
