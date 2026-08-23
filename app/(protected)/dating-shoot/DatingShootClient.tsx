'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Loader2,
  Download,
  RefreshCw,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  FRAMES_PER_SHOOT,
  type ExcludableTag,
  type StylePref,
} from '@/lib/dating/types';
import { type InterestId } from '@/lib/dating/interests';
import {
  LINEUP_LABELS,
  LINEUP_HINTS,
  type LineupRole,
} from '@/lib/dating/roles';
import { StudioHeader } from '@/components/dating/StudioHeader';
import { RoleFilterNav, type RoleFilter } from '@/components/dating/RoleFilterNav';
import {
  PhotoInspectorModal,
  slugify,
  type PhotoItem,
} from '@/components/dating/PhotoInspectorModal';
import { PhotoTile } from '@/components/dating/PhotoTile';
import { StudioIntakeView } from '@/components/dating/StudioIntakeView';
import {
  ImageGeneration,
  type ImageGenerationStatus,
} from '@/components/dating/ImageGeneration';

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
  order: Order & { photos_target: number; shoots_target?: number; pipeline_stage?: string };
  counts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    total: number;
  };
  promptCounts?: {
    reserved: number;
    generating: number;
    passed: number;
    replanning: number;
    total: number;
  };
  stage?: string;
  stageLabel?: string;
  /**
   * The delivery, grouped the way it was shot. The response used to be keyed by
   * bucket — internal architecture the client had to know about — and those
   * buckets no longer exist.
   */
  shoots: {
    shootId: string;
    title: string;
    kind: string | null;
    completed: number;
    total: number;
    photos: {
      id: string;
      frameIndex: number;
      isAnchor: boolean;
      /** Null until the photo finishes — in-flight rows still hold their place. */
      imageUrl: string | null;
      status: ImageGenerationStatus;
      imageWidth: number | null;
      imageHeight: number | null;
      role: LineupRole;
      roleLabel: string;
    }[];
  }[];
  progressPercent: number;
  pipelineMode?: 'authored' | 'dynamic';
};

export function DatingShootClient({
  models,
  orders,
  initialModelId,
  initialOrderId,
  deliveryConfig,
}: {
  userId: string;
  models: Model[];
  orders: Order[];
  initialModelId: number | null;
  initialOrderId: string | null;
  deliveryConfig: { shoots: number; photos: number };
}) {
  const launchRequestId = useRef<string | null>(null);
  const [modelId, setModelId] = useState<number | null>(
    initialModelId || models[0]?.id || null
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    initialOrderId || orders[0]?.id || null
  );
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [activeTab, setActiveTab] = useState<RoleFilter>('all');

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
      const data = (await res.json()) as StatusResponse;
      setStatus(data);

      // The reshoot is finished when the row says so, not when the POST
      // returned. Release the spinner here so the tile animates from the
      // dither field straight into the new photo.
      setRegenLoadingId((current) => {
        if (!current) return current;
        const photo = (data.shoots ?? [])
          .flatMap((shoot) => shoot.photos)
          .find((p) => p.id === current);
        if (!photo) return current;
        return photo.status === 'complete' || photo.status === 'error'
          ? null
          : current;
      });
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
  }) => {
    setLoading(true);
    setError('');
    setCreditError('');
    launchRequestId.current ??= crypto.randomUUID();

    try {
      const res = await fetch('/api/dating-shoot/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequestId: launchRequestId.current,
          modelId: params.modelId,
          interests: params.interests,
          dress: params.dress,
          excludeTags: params.excludeTags,
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
          launchRequestId.current = null;
          return;
        }
        throw new Error(data.error || 'Failed to start photoshoot');
      }

      setActiveOrderId(data.orderId);
      await fetchStatus(data.orderId);
      setIsIntakeOpen(false);
      launchRequestId.current = null;
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

  // Reshoot a single photo.
  //
  // The POST only *queues* the work — the GPU run takes ~30-60s after it
  // returns. This used to clear the spinner in a `finally`, so the UI declared
  // itself done the instant the request came back and the user watched nothing
  // happen. The loading state now ends when polling reports the row finished.
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
      setRegenLoadingId(null);
    }
  };

  // The delivery as shoots, which is how it is shown. Each shoot keeps its own
  // frames in order, so the anchor leads and its three siblings follow.
  const shootSections = useMemo(() => {
    if (!status?.shoots) return [];
    return status.shoots.map((shoot) => ({
      shootId: shoot.shootId,
      title: shoot.title,
      completed: shoot.completed,
      total: shoot.total,
      photos: shoot.photos.map(
        (photo): PhotoItem => ({
          ...photo,
          shootId: shoot.shootId,
          shootTitle: shoot.title,
          roleHint: LINEUP_HINTS[photo.role],
        })
      ),
    }));
  }, [status]);

  // Flat list, in shoot order — what the inspector walks and the filters narrow.
  const allPhotos: PhotoItem[] = useMemo(
    () => shootSections.flatMap((shoot) => shoot.photos),
    [shootSections]
  );

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
      // Use pre-bundled browser distribution of JSZip to avoid webpack node-polyfill resolution issues
      // @ts-ignore
      const JSZipModule = await import('jszip/dist/jszip.min.js');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      let count = 0;
      const totalToDownload = status.counts.completed;

      // One folder per shoot, frames numbered inside it. The folder *is* the
      // shoot: same place, same clothes, same light, four ways.
      for (const [index, shoot] of shootSections.entries()) {
        const folderName = `${String(index + 1).padStart(2, '0')}-${slugify(shoot.title)}`;
        const folder = zip.folder(folderName);

        for (const photo of shoot.photos) {
          // Photos still generating have no file yet. They stay in the grid so
          // the user can watch them land, but there is nothing to zip.
          const imageUrl = photo.imageUrl;
          if (!imageUrl) continue;

          count++;
          setZipProgress(`Adding ${count} of ${totalToDownload} photos...`);
          const base = `${String(photo.frameIndex).padStart(2, '0')}`;

          try {
            if (imageUrl.startsWith('data:')) {
              const isSvg = imageUrl.includes('svg');
              if (isSvg) {
                const svgText = decodeURIComponent(
                  imageUrl.split(',')[1] || ''
                );
                folder?.file(`${base}.svg`, svgText);
              } else {
                const base64Data = imageUrl.split(',')[1];
                folder?.file(`${base}.png`, base64Data, { base64: true });
              }
            } else {
              const res = await fetch(imageUrl);
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
        shootsPerDelivery={deliveryConfig.shoots}
        totalPhotos={deliveryConfig.photos}
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
                  stageLabel: status.stageLabel,
                  pipelineMode: status.pipelineMode,
                }
              : null
          }
          onOpenNewShoot={() => setIsIntakeOpen(true)}
          isShootRunning={isDeveloping}
          onDownloadZip={downloadAllZip}
          isZipLoading={zipLoading}
          zipProgress={zipProgress}
          onRetryFailed={handleRetryFailed}
          isRetryLoading={loading}
        />

        {/* 2. Lineup Role Filter Tabs */}
        {status && (
          <RoleFilterNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            roleCounts={roleCounts}
            totalCompleted={status.counts.completed}
            shootCount={shootSections.length}
            expectedShootCount={deliveryConfig.shoots}
            expectedTotalPhotos={deliveryConfig.photos}
          />
        )}

        {/* 3. Photo Gallery Grid */}
        {(activeTab === 'all' && shootSections.length > 0) || displayedPhotos.length > 0 ? (
          activeTab === 'all' ? (
            /* Grouped by shoot — this place, these clothes, this light, four ways */
            <div className="space-y-12 pt-4">
              {shootSections.map((shoot, index) => (
                <div key={shoot.shootId} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-zinc-600 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-xl font-semibold text-white tracking-tight">
                        {shoot.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {shoot.completed}/{shoot.total}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 font-sans hidden sm:inline">
                      One location, one outfit, {FRAMES_PER_SHOOT} frames
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                    {shoot.photos.map((photo) => (
                      <PhotoTile
                        key={photo.id}
                        photo={photo}
                        isRegenerating={regenLoadingId === photo.id}
                        onOpen={openInspector}
                        onRegenerate={handleRegenerate}
                        reshootsRemaining={status?.order.custom_credits_remaining ?? 0}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* One role, across every shoot */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-4">
              {displayedPhotos.map((photo) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  isRegenerating={regenLoadingId === photo.id}
                  onOpen={openInspector}
                  onRegenerate={handleRegenerate}
                  reshootsRemaining={status?.order.custom_credits_remaining ?? 0}
                  showShootTitle
                />
              ))}
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
