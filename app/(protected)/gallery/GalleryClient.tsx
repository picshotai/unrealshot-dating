'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Download, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PhotoInspectorModal,
  slugify,
  type PhotoItem,
} from '@/components/dating/PhotoInspectorModal';
import { fetchPhotoBlob } from '@/lib/dating/download';
import Link from 'next/link';
import type { LineupRole } from '@/lib/dating/roles';

type GalleryPhoto = {
  id: string;
  shootId: string;
  shootTitle: string;
  frameIndex: number;
  isAnchor: boolean;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  role: string;
  roleLabel: string;
  roleHint: string;
};

type GalleryOrder = {
  orderId: string;
  createdAt: string;
  readyAt: string | null;
  customCreditsRemaining: number;
  photos: GalleryPhoto[];
};

interface GalleryClientProps {
  orders: GalleryOrder[];
}

export function GalleryClient({ orders }: GalleryClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipProgress, setZipProgress] = useState('');

  // Flatten all photos across all orders into PhotoItem[]
  const allPhotos: PhotoItem[] = useMemo(
    () =>
      orders.flatMap((order) =>
        order.photos.map(
          (p): PhotoItem => ({
            id: p.id,
            shootId: p.shootId,
            shootTitle: p.shootTitle,
            frameIndex: p.frameIndex,
            isAnchor: p.isAnchor,
            imageUrl: p.imageUrl,
            status: 'complete',
            imageWidth: p.imageWidth,
            imageHeight: p.imageHeight,
            role: p.role as LineupRole,
            roleLabel: p.roleLabel,
            roleHint: p.roleHint,
          })
        )
      ),
    [orders]
  );

  // Group photos by shoot for the grouped view
  const shootSections = useMemo(() => {
    const map = new Map<
      string,
      { shootId: string; title: string; photos: PhotoItem[] }
    >();
    for (const photo of allPhotos) {
      let section = map.get(photo.shootId);
      if (!section) {
        section = {
          shootId: photo.shootId,
          title: photo.shootTitle,
          photos: [],
        };
        map.set(photo.shootId, section);
      }
      section.photos.push(photo);
    }
    return Array.from(map.values());
  }, [allPhotos]);

  const openInspector = useCallback((photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setIsInspectorOpen(true);
  }, []);

  // No-op regenerate for gallery (read-only view)
  const handleRegenerate = useCallback(async () => {}, []);

  // Download All as ZIP
  const downloadAllZip = async () => {
    if (allPhotos.length === 0) return;
    setZipLoading(true);
    setZipProgress('Creating ZIP archive...');

    try {
      // @ts-ignore
      const JSZipModule = await import('jszip/dist/jszip.min.js');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      let count = 0;
      const totalToDownload = allPhotos.filter((p) => p.imageUrl).length;
      const failedPhotos: string[] = [];

      for (const [index, section] of shootSections.entries()) {
        const folderName = `${String(index + 1).padStart(2, '0')}-${slugify(section.title)}`;
        const folder = zip.folder(folderName);

        for (const photo of section.photos) {
          const imageUrl = photo.imageUrl;
          if (!imageUrl) continue;

          count++;
          setZipProgress(`Adding ${count} of ${totalToDownload} photos...`);
          const base = `${String(photo.frameIndex).padStart(2, '0')}`;

          try {
            if (imageUrl.startsWith('data:')) {
              const isSvg = imageUrl.includes('svg');
              if (isSvg) {
                const svgText = decodeURIComponent(imageUrl.split(',')[1] || '');
                folder?.file(`${base}.svg`, svgText);
              } else {
                const base64Data = imageUrl.split(',')[1];
                folder?.file(`${base}.png`, base64Data, { base64: true });
              }
            } else {
              const blob = await fetchPhotoBlob(photo.id, `${base}.png`);
              folder?.file(`${base}.png`, blob);
            }
          } catch (err) {
            console.warn(`Failed to add photo ${photo.id} to zip`, err);
            if (!imageUrl.startsWith('data:')) failedPhotos.push(photo.id);
          }
        }
      }

      if (failedPhotos.length > 0) {
        throw new Error(
          `Could not securely download ${failedPhotos.length} photo${failedPhotos.length === 1 ? '' : 's'}. Please try again.`
        );
      }

      setZipProgress('Compressing zip file...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'unrealshot-gallery.zip';
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  // Empty state
  if (orders.length === 0 || allPhotos.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">No photos yet</h2>
          <p className="text-sm text-zinc-400">
            Your AI-generated photos will appear here after your first photoshoot is complete.
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
              {allPhotos.length} photo{allPhotos.length !== 1 ? 's' : ''} across{' '}
              {shootSections.length} shoot{shootSections.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={downloadAllZip}
            disabled={zipLoading || allPhotos.length === 0}
            className="bg-white text-black hover:bg-zinc-200 font-medium h-10 px-4 text-sm flex items-center gap-2 rounded-lg"
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

        {/* Photo Grid — Grouped by Shoot */}
        <div className="space-y-12 pt-4">
          {shootSections.map((shoot, index) => (
            <div key={shoot.shootId} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-zinc-800/80 pb-3 px-4 sm:px-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-zinc-200 tabular-nums p-1.5 bg-zinc-700 rounded-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {shoot.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {shoot.photos.length} photos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 px-4 sm:px-0">
                {shoot.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => openInspector(photo)}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-500 shadow-md transition-all duration-200 cursor-pointer select-none"
                  >
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={`${photo.shootTitle} — frame ${photo.frameIndex}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-zinc-800/60" />
                    )}

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {photo.frameIndex}/4
                      </span>
                      {photo.role === 'opener' && (
                        <span className="bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded">
                          Opener
                        </span>
                      )}
                    </div>

                    {/* Hover overlay with expand icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 z-20">
                      <span className="text-[11px] font-medium text-white truncate drop-shadow">
                        {photo.roleLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Photo Inspector Lightbox Modal */}
      <PhotoInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        photo={selectedPhoto}
        photos={allPhotos}
        onSelectPhoto={setSelectedPhoto}
        onRegenerate={handleRegenerate}
        isRegenerating={false}
        customCreditsRemaining={0}
      />
    </div>
  );
}
