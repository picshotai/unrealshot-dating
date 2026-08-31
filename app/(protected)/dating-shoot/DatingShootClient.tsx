'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Loader2,
  Download,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import {
  FRAMES_PER_SHOOT,
  type ExcludableTag,
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
import { PortfolioProgressPanel } from '@/components/dating/PortfolioProgressPanel';
import { StudioIntakeView } from '@/components/dating/StudioIntakeView';
import { fetchPhotoBlob } from '@/lib/dating/download';
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
  order: Order & {
    photos_target: number;
    shoots_target?: number;
    pipeline_stage?: string;
    provider_blocked?: boolean;
    credit_state?: 'legacy' | 'reserved' | 'captured' | 'released';
    failure_code?: string | null;
    failure_phase?: string | null;
    failure_message?: string | null;
    prompt_system_version?: string | null;
    test_mode_snapshot?: 'mock' | 'sample' | 'off';
    real_shoots_target?: number;
  };
  counts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    total: number;
  };
  promptCounts?: {
    planned?: number;
    reserved: number;
    generating: number;
    passed: number;
    replanning: number;
    total: number;
    realTarget?: number;
    mock?: number;
  };
  stage?: string;
  stageLabel?: string;
  creditState?: 'legacy' | 'reserved' | 'captured' | 'released';
  retryScheduled?: boolean;
  retryAvailable?: boolean;
  failure?: { code: string; phase: string; message: string } | null;
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
      roleHint: string;
    }[];
  }[];
  progressPercent: number;
};

export function DatingShootClient({
  userId,
  hasPack,
  models,
  orders,
  initialModelId,
  initialOrderId,
  deliveryConfig,
  ownerDiagnostics,
}: {
  userId: string;
  hasPack: boolean;
  models: Model[];
  orders: Order[];
  initialModelId: number | null;
  initialOrderId: string | null;
  deliveryConfig: { shoots: number; photos: number };
  ownerDiagnostics: {
    testMode: 'mock' | 'sample' | 'off';
    sampleShoots: number;
  } | null;
}) {
  const launchRequestId = useRef<string | null>(null);
  const autoLaunchTriggered = useRef(false);
  const regenerationAttempt = useRef<{
    photoId: string;
    previousImageUrl: string | null;
    accepted: boolean;
  } | null>(null);
  const [modelId, setModelId] = useState<number | null>(
    initialModelId || models[0]?.id || null
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    initialOrderId || orders[0]?.id || null
  );
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [activeTab, setActiveTab] = useState<RoleFilter>('all');

  // Pack status state synchronized with backend
  const [hasPackState, setHasPackState] = useState<boolean>(hasPack);

  const refreshPackStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/dating-shoot/pack-status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHasPackState(Boolean(data.hasPack));
      }
    } catch (e) {
      console.warn('Failed to refresh pack status:', e);
    }
  }, []);

  // If no orders exist, we force the intake view open.
  const hasOrders = orders.length > 0 || activeOrderId !== null;
  const [isIntakeOpen, setIsIntakeOpen] = useState(!hasOrders);

  useEffect(() => {
    if (isIntakeOpen) {
      refreshPackStatus();
    }
  }, [isIntakeOpen, refreshPackStatus]);
  
  // Pending intake state restored from session if resuming
  const [restoredIntake, setRestoredIntake] = useState<{
    interests?: InterestId[];
    excludeTags?: ExcludableTag[];
    includeSimpleCandids?: boolean;
    step?: 'configure' | 'confirm';
  } | null>(null);

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

      // The inspector stores the selected object, not just its id. Keep that
      // object synchronized so a completed reshoot appears without closing or
      // refreshing the modal.
      setSelectedPhoto((current) => {
        if (!current) return current;
        const shoot = (data.shoots ?? []).find((item) =>
          item.photos.some((photo) => photo.id === current.id)
        );
        const photo = shoot?.photos.find((item) => item.id === current.id);
        if (!shoot || !photo) return current;
        return {
          ...current,
          ...photo,
          shootId: shoot.shootId,
          shootTitle: shoot.title,
          roleHint: photo.roleHint || LINEUP_HINTS[photo.role],
        };
      });

      // The reshoot is finished when the row says so, not when the POST
      // returned. Release the spinner here so the tile animates from the
      // dither field straight into the new photo.
      setRegenLoadingId((current) => {
        if (!current) return current;
        const attempt = regenerationAttempt.current;
        // Polling starts immediately, while the POST may still be in flight.
        // An old completed row is not proof that the new reshoot completed.
        if (!attempt || attempt.photoId !== current || !attempt.accepted) {
          return current;
        }
        const photo = (data.shoots ?? [])
          .flatMap((shoot) => shoot.photos)
          .find((p) => p.id === current);
        if (!photo) return current;
        const finishedWithNewImage =
          photo.status === 'complete' &&
          Boolean(photo.imageUrl) &&
          photo.imageUrl !== attempt.previousImageUrl;
        if (finishedWithNewImage || photo.status === 'error') {
          regenerationAttempt.current = null;
          return null;
        }
        return current;
      });
    } catch (e) {
      console.warn('Failed to poll status:', e);
    }
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;
    fetchStatus(activeOrderId);
    const terminal = status?.order.status === 'ready' ||
      status?.order.status === 'failed' ||
      status?.order.status === 'partial_failed';
    if (terminal && !regenLoadingId) return;
    const interval = setInterval(() => {
      fetchStatus(activeOrderId);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeOrderId, fetchStatus, regenLoadingId, status?.order.status]);

  // Launch New Shoot
  const handleLaunchShoot = async (params: {
    modelId: number;
    interests: InterestId[];
    excludeTags: ExcludableTag[];
    includeSimpleCandids: boolean;
  }): Promise<boolean> => {
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
          excludeTags: params.excludeTags,
          includeSimpleCandids: params.includeSimpleCandids,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'insufficient_credits') {
          setCreditError(data.error);
          setHasPackState(false);
          return false;
        }
        if (data.code === 'order_in_progress' && data.orderId) {
          setActiveOrderId(data.orderId);
          await fetchStatus(data.orderId);
          setIsIntakeOpen(false);
          launchRequestId.current = null;
          return true;
        }
        throw new Error(data.error || 'Failed to start photoshoot');
      }

      setActiveOrderId(data.orderId);
      await fetchStatus(data.orderId);
      setIsIntakeOpen(false);
      launchRequestId.current = null;

      // Clean up saved draft & query parameters after ANY successful launch
      try {
        sessionStorage.removeItem('unrealshot_pending_shoot');
        if (typeof window !== 'undefined' && window.location.search.includes('resume=')) {
          window.history.replaceState({}, '', '/dating-shoot');
        }
      } catch (e) {
        console.warn('Failed to clean up pending shoot draft:', e);
      }

      refreshPackStatus();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to launch shoot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Checkout Continuation & Auto-Launch Handler
  useEffect(() => {
    if (typeof window === 'undefined' || autoLaunchTriggered.current) return;
    const searchParams = new URLSearchParams(window.location.search);
    const resumeMode = searchParams.get('resume');

    if (resumeMode === 'auto-start' || resumeMode === 'checkout') {
      try {
        const rawPending = sessionStorage.getItem('unrealshot_pending_shoot');
        if (rawPending) {
          const pending = JSON.parse(rawPending);
          // Only resume if valid and saved within last 2 hours
          if (
            pending &&
            pending.modelId &&
            Date.now() - (pending.timestamp || 0) < 1000 * 60 * 120
          ) {
            const targetModel = models.find((m) => m.id === pending.modelId);
            
            const draftData = {
              interests: pending.interests || [],
              excludeTags: pending.excludeTags || [],
              includeSimpleCandids:
                pending.includeSimpleCandids !== undefined
                  ? pending.includeSimpleCandids
                  : true,
            };

            if (!targetModel) {
              // Never silently switch model! Restore settings to configure step and ask user to choose
              setModelId(models[0]?.id || null);
              setRestoredIntake({
                ...draftData,
                step: 'configure',
              });
              setIsIntakeOpen(true);
              setError('Saved face model not found. Please select your active face model.');
              return;
            }

            setModelId(targetModel.id);

            if (resumeMode === 'auto-start') {
              autoLaunchTriggered.current = true;
              // Auto-launch photoshoot instantly
              handleLaunchShoot({
                modelId: targetModel.id,
                ...draftData,
              }).then((success) => {
                if (!success) {
                  // Fallback to confirm step with pre-filled selections
                  setRestoredIntake({
                    ...draftData,
                    step: 'confirm',
                  });
                  setIsIntakeOpen(true);
                }
              });
            } else {
              // Resume directly in intake confirmation screen
              setRestoredIntake({
                ...draftData,
                step: 'confirm',
              });
              setIsIntakeOpen(true);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse pending shoot config:', e);
      }
    }
  }, [models, refreshPackStatus]);

  // Retry Failed
  const handleRetryFailed = async () => {
    if (!activeOrderId) return;
    setLoading(true);
    setError('');
    setCreditError('');
    try {
      const response = await fetch('/api/dating-shoot/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 402 || result.code === 'insufficient_credits') {
          setCreditError(result.error || 'You need one pack to retry this shoot.');
          return;
        }
        throw new Error(result.error || 'Could not retry this shoot.');
      }
      await fetchStatus(activeOrderId);
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : 'Could not retry this shoot.');
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
  const handleRegenerate = async (photoId: string, feedback?: string) => {
    if (!activeOrderId) return;
    const previousImageUrl = status?.shoots
      .flatMap((shoot) => shoot.photos)
      .find((photo) => photo.id === photoId)?.imageUrl ?? null;
    regenerationAttempt.current = {
      photoId,
      previousImageUrl,
      accepted: false,
    };
    setRegenLoadingId(photoId);
    try {
      const res = await fetch('/api/dating-shoot/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrderId,
          photoId,
          feedback: feedback?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Regenerate failed');
      if (regenerationAttempt.current?.photoId === photoId) {
        regenerationAttempt.current.accepted = true;
      }
      await fetchStatus(activeOrderId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regenerate failed');
      regenerationAttempt.current = null;
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
          roleHint: photo.roleHint || LINEUP_HINTS[photo.role],
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
      const failedRealPhotos: string[] = [];

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
              // Use the authenticated same-origin download path. Direct R2
              // browser requests can fail CORS and were silently skipped,
              // leaving sample ZIPs containing only their local SVG previews.
              const blob = await fetchPhotoBlob(photo.id, `${base}.png`);
              folder?.file(`${base}.png`, blob);
            }
          } catch (err) {
            console.warn(`Failed to add photo ${photo.id} to zip`, err);
            if (!imageUrl.startsWith('data:')) failedRealPhotos.push(photo.id);
          }
        }
      }

      if (failedRealPhotos.length > 0) {
        throw new Error(
          `Could not securely download ${failedRealPhotos.length} generated photo${failedRealPhotos.length === 1 ? '' : 's'}. Please try again.`
        );
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
      setError(
        err instanceof Error ? err.message : 'Failed to create ZIP download'
      );
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
        userId={userId}
        hasPack={hasPackState}
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
        initialDraft={restoredIntake}
        initialStep={restoredIntake?.step}
        ownerDiagnostics={ownerDiagnostics}
      />
    );
  }

  // Otherwise, render the main Studio dashboard
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6 space-y-6">
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
                  providerBlocked: status.order.provider_blocked,
                  needsAttention:
                    status.order.pipeline_stage === 'attention_required' &&
                    !status.retryScheduled,
                  retryScheduled: status.retryScheduled,
                  failed: status.order.status === 'failed' || status.order.pipeline_stage === 'failed',
                  creditState: status.creditState || status.order.credit_state,
                  retryAvailable: status.retryAvailable,
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
        {status && status.order.status !== 'failed' && (
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
        {displayedPhotos.length > 0 ? (
          activeTab === 'all' ? (
            /* Grouped by shoot — this place, these clothes, this light, four ways */
            <div className="space-y-12 pt-4">
              {shootSections.map((shoot, index) => (
                <div key={shoot.shootId} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-zinc-200 tabular-nums p-1.5 bg-zinc-700 rounded-md">
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
        ) : isDeveloping || status?.order.status === 'failed' ? (
          <PortfolioProgressPanel
            stageLabel={status?.stageLabel}
            promptCounts={status?.promptCounts}
            shootTarget={status?.order.shoots_target ?? deliveryConfig.shoots}
            sample={(status?.promptCounts?.mock ?? 0) > 0
              ? { realShoots: status?.promptCounts?.realTarget ?? 0 }
              : null}
            blocked={Boolean(status?.order.provider_blocked)}
            paused={
              status?.order.pipeline_stage === 'attention_required' &&
              !status?.retryScheduled
            }
            retrying={status?.retryScheduled}
            failed={status?.order.status === 'failed'}
            creditReturned={(status?.creditState || status?.order.credit_state) === 'released'}
            failureMessage={status?.failure?.message}
          />
        ) : null}

        {creditError && !isIntakeOpen && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {creditError}
          </p>
        )}
        {error && !isIntakeOpen && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
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
