'use client';

import React from 'react';
import {
  Archive,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Zap,
  ChevronDown,
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
  } | null;
  onOpenNewShoot: () => void;
  onDownloadZip: () => void;
  isZipLoading: boolean;
  zipProgress: string;
  onRetryFailed: () => void;
  isRetryLoading: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  status,
  onOpenNewShoot,
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

  const avatarUrl = currentModel?.samples?.[0]?.uri || '/placeholder-user.jpg';

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Model Info & Status Pill */}
        <div className="flex items-center gap-3.5">
          {/* Model Avatar Thumbnail */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
            <img
              src={avatarUrl}
              alt={currentModel?.name || 'Your Model'}
              className="w-full h-full object-cover"
            />
            {isReady && (
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]">
                {currentModel?.name || 'My Dating Shoot'}
              </span>

              {/* Status Pill */}
              {status && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                    isReady
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isDeveloping
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {isReady ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isDeveloping ? (
                    <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-zinc-400" />
                  )}
                  <span>
                    {isReady
                      ? '100 Photos Ready'
                      : isDeveloping
                      ? `Developing ${status.progressPercent}%`
                      : status.orderStatus}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {status ? (
                <>
                  {status.completed} of {status.total} photos ·{' '}
                  <span className="text-accent font-medium">
                    {status.customCreditsRemaining} custom credits
                  </span>
                </>
              ) : (
                'Configure and launch your 100-photo shoot'
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Failed Retry (if any failed) */}
          {status && status.failedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryFailed}
              disabled={isRetryLoading}
              className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs h-9 rounded-xl"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${
                  isRetryLoading ? 'animate-spin' : ''
                }`}
              />
              Retry {status.failedCount} Failed
            </Button>
          )}

          {/* Download All (ZIP) Action */}
          {status && status.completed > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadZip}
              disabled={isZipLoading}
              className="bg-white text-black hover:bg-zinc-200 font-bold text-xs h-9 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              {isZipLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  {zipProgress || 'Zipping...'}
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5 mr-2" />
                  Download ZIP (5 Folders)
                </>
              )}
            </Button>
          )}

          {/* New Shoot Trigger Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenNewShoot}
            className="border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs h-9 px-3.5 rounded-xl font-medium"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-accent" />
            New Shoot
          </Button>
        </div>
      </div>

      {/* Real-Time Progress Bar when developing */}
      {status && isDeveloping && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
            <span>Developing 100 photo variations...</span>
            <span className="text-white font-semibold">
              {status.progressPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 rounded-full"
              style={{ width: `${status.progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
