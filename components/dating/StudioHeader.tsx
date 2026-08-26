'use client';

import React from 'react';
import {
  Archive,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

interface StudioHeaderProps {
  models: Model[];
  selectedModelId: number | null;
  onSelectModel: (id: number) => void;
  status: {
    orderStatus: string;
    completed: number;
    total: number;
    progressPercent: number;
    customCreditsRemaining: number;
    failedCount: number;
    stageLabel?: string;
    providerBlocked?: boolean;
    needsAttention?: boolean;
    retryScheduled?: boolean;
    failed?: boolean;
    creditState?: 'legacy' | 'reserved' | 'captured' | 'released';
    retryAvailable?: boolean;
  } | null;
  onOpenNewShoot: () => void;
  /**
   * One shoot at a time. createDatingShootOrder refuses a second while one is
   * queued or developing — and refuses it *before* charging, so nothing is
   * double-spent — but the button was still live, so the only way to find out
   * was to fill in the whole form and be turned away at the end.
   */
  isShootRunning?: boolean;
  onDownloadZip: () => void;
  isZipLoading: boolean;
  zipProgress: string;
  onRetryFailed: () => void;
  isRetryLoading: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  models,
  selectedModelId,
  status,
  onOpenNewShoot,
  isShootRunning,
  onDownloadZip,
  isZipLoading,
  zipProgress,
  onRetryFailed,
  isRetryLoading,
}) => {
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];
  const isDeveloping =
    status?.orderStatus === 'developing' || status?.orderStatus === 'queued';
  const isReady =
    status?.orderStatus === 'ready' || status?.orderStatus === 'partial_failed';
  const isProviderBlocked = Boolean(status?.providerBlocked);
  const isPaused = Boolean(status?.needsAttention);
  const isRetrying = Boolean(status?.retryScheduled);
  const isFailed = Boolean(status?.failed);

  const avatarUrl = currentModel?.samples?.[0]?.uri || '/placeholder-user.jpg';

  return (
    <div className="w-full pb-4 sm:pb-6 border-b border-zinc-800/60 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Model Info & Status */}
        <div className="flex items-center gap-3">
          {/* Minimal Avatar Thumbnail */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
            <img
              src={avatarUrl}
              alt={currentModel?.name || 'Your Model'}
              className="w-full h-full object-cover"
            />
            {isReady && (
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white tracking-tight">
                {currentModel?.name || 'My Dating Shoot'}
              </h1>
              {/* Sleek Status Indicator */}
              {status && (
                <div className="flex items-center gap-1.5">
                  {isReady ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                  ) : isFailed || isProviderBlocked || isPaused ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  ) : isDeveloping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                  <span className="text-xs font-medium text-zinc-400">
                    {isReady
                      ? 'Ready'
                      : isFailed
                      ? status.stageLabel || 'Shoot stopped'
                      : isDeveloping
                      ? status.stageLabel || `${status.progressPercent}%`
                      : status.orderStatus}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              {status ? (
                <>
                  {status.completed} / {status.total} photos ·{' '}
                  <span className="text-white/60">
                    {status.creditState === 'reserved'
                      ? '1 pack reserved for this shoot'
                      : status.creditState === 'released'
                        ? 'pack returned'
                        : `${status.customCreditsRemaining} reshoots left`}
                  </span>
                </>
              ) : (
                'Configure and launch your shoot'
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Action Controls (Aligned with rounded-lg) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Failed Retry (if any failed) */}
          {status && !isRetrying && (status.retryAvailable || status.failedCount > 0 || status.needsAttention) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryFailed}
              disabled={isRetryLoading}
              className="flex-1 sm:flex-none border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs h-9 rounded-lg"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${
                  isRetryLoading ? 'animate-spin' : ''
                }`}
              />
              {status.failed ? 'Retry shoot' : status.failedCount > 0 ? `Retry ${status.failedCount} Failed` : 'Retry setup'}
            </Button>
          )}

          {/* Download All (ZIP) Action */}
          {status && status.completed > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadZip}
              disabled={isZipLoading}
              className="flex-1 sm:flex-none bg-white text-black hover:bg-zinc-200 font-semibold text-xs h-9 px-4 rounded-lg shadow-sm transition-all active:scale-95"
            >
              {isZipLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  {zipProgress || 'Zipping...'}
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5 mr-2" strokeWidth={2} />
                  Download ZIP
                </>
              )}
            </Button>
          )}

          {/* New Shoot Trigger Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenNewShoot}
            disabled={isShootRunning}
            title={
              isShootRunning
                ? isPaused
                  ? 'This shoot is paused after a failed attempt. Retry it before starting another.'
                  : 'Your shoot is still developing. You can start another when it finishes.'
                : undefined
            }
            className="flex-1 sm:flex-none border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs h-9 px-3 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5 sm:mr-1.5 text-zinc-400" />
            <span className="hidden sm:inline">
              {isShootRunning ? isPaused ? 'Shoot paused' : 'Shoot running' : 'New Shoot'}
            </span>
          </Button>
        </div>
      </div>

      {/* Real-Time Progress Bar when developing */}
      {status && isDeveloping && (
        <div className="mt-4 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 rounded-full"
            style={{ width: `${status.progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
