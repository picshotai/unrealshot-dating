'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import {
  Loader2,
  Download,
  RefreshCw,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  DATING_BUCKETS,
  type DatingBucket,
  type ExcludableTag,
  type StylePref,
} from '@/lib/dating/types';
import { type InterestId } from '@/lib/dating/interests';
import {
  groupByLineup,
  lineupRoleFor,
  LINEUP_LABELS,
  LINEUP_HINTS,
  type LineupRole,
} from '@/lib/dating/lineup';
import { StudioHeader } from '@/components/dating/StudioHeader';
import { LineupPillNav, type LineupFilter } from '@/components/dating/LineupPillNav';
import {
  PhotoInspectorModal,
  type PhotoItem,
} from '@/components/dating/PhotoInspectorModal';
import { StudioIntakeView } from '@/components/dating/StudioIntakeView';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

type Order = {
  id: string;
  status: string;
  model_id: number;
  custom_credits_remaining: number;
  created_at: string;
  ready_at: string | null;
};

type StatusResponse = {
  order: Order & { photos_target: number };
  counts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    total: number;
  };
  byBucket: Record<
    DatingBucket,
    {
      completed: number;
      total: number;
      photos: {
        id: string;
        slot: number;
        imageUrl: string;
        imageWidth: number | null;
        imageHeight: number | null;
      }[];
    }
  >;
  progressPercent: number;
};

export function DatingShootClient({
  models,
  orders,
  initialModelId,
  initialOrderId,
}: {
  userId: string;
  models: Model[];
  orders: Order[];
  initialModelId: number | null;
  initialOrderId: string | null;
}) {
  const [modelId, setModelId] = useState<number | null>(
    initialModelId || models[0]?.id || null
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    initialOrderId || orders[0]?.id || null
  );
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [activeTab, setActiveTab] = useState<LineupFilter>('all');

  // If no orders exist, we force the intake view open.
  const hasOrders = orders.length > 0 || activeOrderId !== null;
  const [isIntakeOpen, setIsIntakeOpen] = useState(!hasOrders);
  
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Operation loaders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditError, setCreditError] = useState('');
  const [regenLoadingId, setRegenLoadingId] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipProgress, setZipProgress] = useState('');

  // Status Polling
  const fetchStatus = useCallback(async (orderId: string) => {
    try {
      const res = await fetch(`/api/dating-shoot/run-status?orderId=${orderId}`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.warn('Failed to poll status:', e);
    }
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;
    fetchStatus(activeOrderId);
    const interval = setInterval(() => {
      fetchStatus(activeOrderId);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeOrderId, fetchStatus]);

  // Launch New Shoot
  const handleLaunchShoot = async (params: {
    modelId: number;
    interests: InterestId[];
    dress: StylePref;
    excludeTags: ExcludableTag[];
    hobbyText: string;
  }) => {
    setLoading(true);
    setError('');
    setCreditError('');

    try {
      const res = await fetch('/api/dating-shoot/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: params.modelId,
          interests: params.interests,
          dress: params.dress,
          excludeTags: params.excludeTags,
          hobbyText: params.hobbyText.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'insufficient_credits') {
          setCreditError(data.error);
          return;
        }
        if (data.code === 'order_in_progress' && data.orderId) {
          setActiveOrderId(data.orderId);
          await fetchStatus(data.orderId);
          setIsIntakeOpen(false);
          return;
        }
        throw new Error(data.error || 'Failed to start photoshoot');
      }

      setActiveOrderId(data.orderId);
      await fetchStatus(data.orderId);
      setIsIntakeOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to launch shoot');
    } finally {
      setLoading(false);
    }
  };

  // Retry Failed
  const handleRetryFailed = async () => {
    if (!activeOrderId) return;
    setLoading(true);
    try {
      await fetch('/api/dating-shoot/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId }),
      });
      await fetchStatus(activeOrderId);
    } finally {
      setLoading(false);
    }
  };

  // Regenerate Single Photo
  const handleRegenerate = async (photoId: string) => {
    if (!activeOrderId) return;
    setRegenLoadingId(photoId);
    try {
      const res = await fetch('/api/dating-shoot/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId, photoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Regenerate failed');
      setTimeout(() => fetchStatus(activeOrderId), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regenerate failed');
    } finally {
      setRegenLoadingId(null);
    }
  };

  // Flat list of all photos mapped with Lineup Roles
  const allPhotos: PhotoItem[] = useMemo(() => {
    if (!status?.byBucket) return [];
    return DATING_BUCKETS.flatMap((bucket) =>
      (status.byBucket[bucket]?.photos || []).map((photo) => {
        const role = lineupRoleFor({
          bucket,
          slot: photo.slot,
          imageWidth: photo.imageWidth,
          imageHeight: photo.imageHeight,
        });
        return {
          ...photo,
          bucket,
          role,
          roleLabel: LINEUP_LABELS[role],
          roleHint: LINEUP_HINTS[role],
        };
      })
    );
  }, [status]);

  // Grouping by Lineup Sections
  const lineupSections = useMemo(() => {
    return groupByLineup(allPhotos);
  }, [allPhotos]);

  // Counts by role
  const roleCounts: Record<LineupRole, number> = useMemo(() => {
    const counts: Record<LineupRole, number> = {
      opener: 0,
      fullBody: 0,
      whatYouDo: 0,
      outThere: 0,
      more: 0,
    };
    for (const p of allPhotos) {
      if (p.role) {
        counts[p.role] = (counts[p.role] || 0) + 1;
      }
    }
    return counts;
  }, [allPhotos]);

  // Photos filtered by active tab
  const displayedPhotos = useMemo(() => {
    if (activeTab === 'all') return allPhotos;
    return allPhotos.filter((p) => p.role === activeTab);
  }, [allPhotos, activeTab]);

  // Open Lightbox Modal for a photo
  const openInspector = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setIsInspectorOpen(true);
  };

  // ZIP Download Generator organized by Lineup folders
  const downloadAllZip = async () => {
    if (!status || !activeOrderId) return;
    setZipLoading(true);
    setZipProgress('Creating ZIP archive...');

    try {
      const zip = new JSZip();
      let count = 0;
      const totalToDownload = status.counts.completed;

      for (const [index, section] of lineupSections.entries()) {
        const folderName = `${String(index + 1).padStart(2, '0')}-${section.label.replace(/\s+/g, '-')}`;
        const folder = zip.folder(folderName);

        for (const [position, photo] of section.photos.entries()) {
          count++;
          setZipProgress(`Adding ${count} of ${totalToDownload} photos...`);
          const base = `${String(position + 1).padStart(2, '0')}`;

          try {
            if (photo.imageUrl.startsWith('data:')) {
              const isSvg = photo.imageUrl.includes('svg');
              if (isSvg) {
                const svgText = decodeURIComponent(
                  photo.imageUrl.split(',')[1] || ''
                );
                folder?.file(`${base}.svg`, svgText);
              } else {
                const base64Data = photo.imageUrl.split(',')[1];
                folder?.file(`${base}.png`, base64Data, { base64: true });
              }
            } else {
              const res = await fetch(photo.imageUrl);
              if (res.ok) {
                const blob = await res.blob();
                folder?.file(`${base}.png`, blob);
              }
            }
          } catch (err) {
            console.warn(`Failed to add photo ${photo.id} to zip`, err);
          }
        }
      }

      setZipProgress('Compressing zip file...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `unrealshot-dating-photos-${activeOrderId.slice(0, 8)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      setError('Failed to create ZIP download');
    } finally {
      setZipLoading(false);
      setZipProgress('');
    }
  };

  const isDeveloping =
    status?.order.status === 'developing' || status?.order.status === 'queued';

  // If intake is open, show the full-page modern setup view instead of the dashboard.
  if (isIntakeOpen) {
    return (
      <StudioIntakeView
        models={models}
        selectedModelId={modelId}
        onSelectModel={setModelId}
        onSubmit={handleLaunchShoot}
        onCancel={() => setIsIntakeOpen(false)}
        isLoading={loading}
        creditError={creditError}
        generalError={error}
        showCancel={hasOrders}
      />
    );
  }

  // Otherwise, render the main Studio dashboard
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Studio Header & Controls */}
        <StudioHeader
          models={models}
          selectedModelId={modelId}
          onSelectModel={setModelId}
          status={
            status
              ? {
                  orderStatus: status.order.status,
                  completed: status.counts.completed,
                  total: status.counts.total,
                  progressPercent: status.progressPercent,
                  customCreditsRemaining: status.order.custom_credits_remaining,
                  failedCount: status.counts.failed,
                }
              : null
          }
          onOpenNewShoot={() => setIsIntakeOpen(true)}
          onDownloadZip={downloadAllZip}
          isZipLoading={zipLoading}
          zipProgress={zipProgress}
          onRetryFailed={handleRetryFailed}
          isRetryLoading={loading}
        />

        {/* 2. Lineup Role Filter Tabs */}
        {status && (
          <LineupPillNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            roleCounts={roleCounts}
            totalCompleted={status.counts.completed}
          />
        )}

        {/* 3. Photo Gallery Grid */}
        {displayedPhotos.length > 0 ? (
          activeTab === 'all' ? (
            /* Curated Lineup View (Grouped by Job) */
            <div className="space-y-12 pt-4">
              {lineupSections.map((section) => (
                <div key={section.role} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-semibold text-white tracking-tight">
                        {section.label}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {section.photos.length}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 font-sans hidden sm:inline">
                      {section.hint}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                    {section.photos.map((p) => {
                      const isMock = p.imageUrl.startsWith('data:image/svg+xml');
                      const isThisRegenerating = regenLoadingId === p.id;

                      return (
                        <div
                          key={p.id}
                          onClick={() => openInspector(p)}
                          className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-500 shadow-md transition-all duration-200 cursor-pointer select-none"
                        >
                          {/* Photo Display */}
                          <img
                            src={p.imageUrl}
                            alt={`${section.label} #${p.slot}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Top Slot Pill */}
                          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded z-10">
                            #{p.slot}
                          </div>

                          {/* Hover Overlay with Quick Actions */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between z-20">
                            {/* Top Right Zoom Icon */}
                            <div className="flex justify-end">
                              <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10">
                                <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </div>
                            </div>

                            {/* Bottom Action Buttons */}
                            <div
                              className="space-y-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-[11px] font-medium text-white truncate drop-shadow">
                                {section.label}
                              </div>

                              <div className="flex gap-1.5">
                                <a
                                  href={p.imageUrl}
                                  download={`dating-photo-${section.role}-${p.slot}.${isMock ? 'svg' : 'png'}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-white text-black hover:bg-zinc-200 rounded-lg py-1.5 transition-colors"
                                >
                                  <Download className="w-3 h-3" strokeWidth={1.5} /> Save
                                </a>
                                <button
                                  onClick={() => handleRegenerate(p.id)}
                                  disabled={isThisRegenerating}
                                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg py-1.5 border border-zinc-700 transition-colors"
                                >
                                  {isThisRegenerating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                                  )}
                                  Regen
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Role Filtered View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-4">
              {displayedPhotos.map((p) => {
                const isMock = p.imageUrl.startsWith('data:image/svg+xml');
                const isThisRegenerating = regenLoadingId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => openInspector(p)}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-500 shadow-md transition-all duration-200 cursor-pointer select-none"
                  >
                    {/* Photo Display */}
                    <img
                      src={p.imageUrl}
                      alt={`${p.roleLabel} #${p.slot}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top Slot Pill */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded z-10">
                      #{p.slot}
                    </div>

                    {/* Hover Overlay with Quick Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between z-20">
                      {/* Top Right Zoom Icon */}
                      <div className="flex justify-end">
                        <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10">
                          <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div
                        className="space-y-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[11px] font-medium text-white truncate drop-shadow">
                          {p.roleLabel}
                        </div>

                        <div className="flex gap-1.5">
                          <a
                            href={p.imageUrl}
                            download={`dating-photo-${p.role}-${p.slot}.${isMock ? 'svg' : 'png'}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-white text-black hover:bg-zinc-200 rounded-lg py-1.5 transition-colors"
                          >
                            <Download className="w-3 h-3" strokeWidth={1.5} /> Save
                          </a>
                          <button
                            onClick={() => handleRegenerate(p.id)}
                            disabled={isThisRegenerating}
                            className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg py-1.5 border border-zinc-700 transition-colors"
                          >
                            {isThisRegenerating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                            )}
                            Regen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : isDeveloping ? (
          /* Developing Empty Shimmer Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse flex flex-col items-center justify-center p-4 text-center"
              >
                <ImageIcon className="w-6 h-6 text-zinc-700 mb-2" strokeWidth={1.5} />
                <span className="text-xs text-zinc-600 font-mono">
                  Developing photo #{i + 1}...
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* 4. Past Shoots Drawer / History */}
        {orders.length > 1 && (
          <div className="pt-12 border-t border-zinc-900 mt-12">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
              Previous Photoshoots ({orders.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setActiveOrderId(o.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    activeOrderId === o.id
                      ? 'border-white bg-zinc-900 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm capitalize text-white mb-0.5">
                      {o.status.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {new Date(o.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                    {o.custom_credits_remaining} cr
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Full-Screen Photo Inspector Lightbox Modal */}
      <PhotoInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        photo={selectedPhoto}
        photos={displayedPhotos}
        onSelectPhoto={setSelectedPhoto}
        onRegenerate={handleRegenerate}
        isRegenerating={regenLoadingId === selectedPhoto?.id}
        customCreditsRemaining={status?.order.custom_credits_remaining || 0}
      />
    </div>
  );
}
