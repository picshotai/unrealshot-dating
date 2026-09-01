'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Download, Loader2, ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadPhoto } from '@/lib/dating/download';
import Link from 'next/link';

type Photo = {
  id: string;
  imageUrl: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  createdAt: string;
};

interface GalleryClientProps {
  photos: Photo[];
}

const INITIAL_BATCH = 24;
const BATCH_SIZE = 24;

export function GalleryClient({ photos }: GalleryClientProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipProgress, setZipProgress] = useState('');

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Slice photos to currently visible count for optimal DOM performance
  const visiblePhotos = useMemo(
    () => photos.slice(0, visibleCount),
    [photos, visibleCount]
  );

  const hasMore = visibleCount < photos.length;

  // Infinite scroll observer: load next batch as user scrolls down
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, photos.length));
        }
      },
      { rootMargin: '600px 0px' } // Pre-fetch before user reaches the absolute bottom
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, photos.length]);

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;
  const hasPrev = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < photos.length - 1;

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev && selectedIndex !== null) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [hasPrev, selectedIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && selectedIndex !== null) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      // If user navigates beyond currently rendered batch in lightbox, expand visible count
      if (nextIndex >= visibleCount) {
        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, photos.length));
      }
    }
  }, [hasNext, selectedIndex, visibleCount, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext, closeLightbox]);

  // Single Photo Download
  const handleDownloadSingle = async (photo: Photo, index: number) => {
    if (!photo.imageUrl || downloadingId) return;
    setDownloadingId(photo.id);
    try {
      const filename = `unrealshot-photo-${String(index + 1).padStart(3, '0')}.png`;
      await downloadPhoto(photo.id, photo.imageUrl, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  // Download All as ZIP (flat, no nested folders or metadata)
  const downloadAllZip = async () => {
    if (photos.length === 0 || zipLoading) return;
    setZipLoading(true);
    setZipProgress('Creating ZIP archive...');

    try {
      // @ts-ignore
      const JSZipModule = await import('jszip/dist/jszip.min.js');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      let count = 0;
      const totalToDownload = photos.filter((p) => p.imageUrl).length;

      for (const [index, photo] of photos.entries()) {
        const imageUrl = photo.imageUrl;
        if (!imageUrl) continue;

        count++;
        setZipProgress(`Adding ${count} of ${totalToDownload} photos...`);
        const filename = `photo-${String(index + 1).padStart(3, '0')}.png`;

        try {
          if (imageUrl.startsWith('data:')) {
            const isSvg = imageUrl.includes('svg');
            if (isSvg) {
              const svgText = decodeURIComponent(imageUrl.split(',')[1] || '');
              zip.file(`photo-${String(index + 1).padStart(3, '0')}.svg`, svgText);
            } else {
              const base64Data = imageUrl.split(',')[1];
              zip.file(filename, base64Data, { base64: true });
            }
          } else {
            const res = await fetch(`/api/download?photoId=${photo.id}&filename=${filename}`, { cache: 'no-store' });
            if (res.ok) {
              const blob = await res.blob();
              zip.file(filename, blob);
            }
          }
        } catch (err) {
          console.warn(`Failed to add photo ${photo.id} to zip`, err);
        }
      }

      setZipProgress('Compressing zip file...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'unrealshot-photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setZipLoading(false);
      setZipProgress('');
    }
  };

  // Empty state
  if (photos.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">No photos yet</h2>
          <p className="text-sm text-zinc-400">
            Your photos will appear here after your photoshoot is generated.
          </p>
          <Link href="/dating-shoot">
            <Button className="bg-white text-black hover:bg-zinc-200 mt-2">
              Start a Photoshoot
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My Gallery
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {photos.length} photos
            </p>
          </div>
          <Button
            onClick={downloadAllZip}
            disabled={zipLoading || photos.length === 0}
            className="bg-white text-black hover:bg-zinc-200 font-medium h-10 px-4 text-sm flex items-center gap-2 rounded-lg transition-colors"
          >
            {zipLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {zipProgress || 'Preparing...'}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Download All
              </>
            )}
          </Button>
        </div>

        {/* Complete Masonry Grid Gallery — Progressive scroll chunk loading, zero metadata */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 sm:gap-4 px-4 sm:px-0">
          {visiblePhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group relative break-inside-avoid mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-500 shadow-md transition-all duration-200 cursor-pointer select-none"
            >
              <img
                src={photo.imageUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading={index < 12 ? 'eager' : 'lazy'}
                decoding="async"
              />

              {/* Clean hover overlay with quick download */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-2.5 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSingle(photo, index);
                  }}
                  disabled={downloadingId === photo.id}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-md"
                  title="Download photo"
                >
                  {downloadingId === photo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Sentinel / Indicator */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              <span>Loading more photos ({visibleCount} of {photos.length})...</span>
            </div>
          </div>
        )}
      </div>

      {/* Pure Cinematic Lightbox Preview — No metadata sidebar, pure image viewer */}
      {isLightboxOpen && selectedIndex !== null && currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={closeLightbox} />

          {/* Top Controls: Download & Close */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={() => handleDownloadSingle(currentPhoto, selectedIndex)}
              disabled={downloadingId === currentPhoto.id}
              className="h-9 px-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/15 flex items-center gap-2 text-xs font-medium backdrop-blur-md transition-all shadow-lg active:scale-95"
            >
              {downloadingId === currentPhoto.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
              <span>Download</span>
            </button>
            <button
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/15 flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95"
              aria-label="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation: Previous Button */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 flex items-center justify-center transition-all active:scale-95 shadow-xl backdrop-blur-md"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* Centered Image — Clean, full scale, uncropped */}
          <div className="relative z-10 flex items-center justify-center w-full h-full max-w-6xl max-h-[88vh] p-4 select-none pointer-events-none">
            <img
              src={currentPhoto.imageUrl}
              alt={`Photo ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl pointer-events-auto border border-zinc-800/60"
            />
          </div>

          {/* Navigation: Next Button */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 flex items-center justify-center transition-all active:scale-95 shadow-xl backdrop-blur-md"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* Counter Badge: exact same UI/UX position as screenshot (e.g. 15 / 480) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-mono px-3.5 py-1.5 rounded-full z-20 shadow-lg pointer-events-none">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
