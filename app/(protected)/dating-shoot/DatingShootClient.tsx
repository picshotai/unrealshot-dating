'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import {
  BUCKET_LABELS,
  DATING_BUCKETS,
  type DatingBucket,
  type StylePref,
} from '@/lib/dating/types';
import {
  DRESS_OPTIONS,
  INTEREST_CHIPS,
  type InterestId,
} from '@/lib/dating/interests';
import { groupByLineup } from '@/lib/dating/lineup';
import {
  Loader2,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Archive,
  FlaskConical,
} from 'lucide-react';

/**
 * Placeholder until three real frames from a delivery replace them. Even as
 * swatches this reads as choosing between looks rather than between the words
 * casual / sharp / street.
 */
const DRESS_SWATCHES: Record<string, string> = {
  casual: 'linear-gradient(160deg, #b8a88f 0%, #6f6552 60%, #2f2c26 100%)',
  sharp: 'linear-gradient(160deg, #6b7079 0%, #3a3f47 60%, #17191d 100%)',
  street: 'linear-gradient(160deg, #8a5a44 0%, #46362f 60%, #1c1917 100%)',
};

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
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [dress, setDress] = useState<StylePref>('casual');
  const [hobbyText, setHobbyText] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    initialOrderId || orders[0]?.id || null
  );
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regenLoading, setRegenLoading] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipProgress, setZipProgress] = useState<string>('');

  const fetchStatus = useCallback(async (orderId: string) => {
    const res = await fetch(`/api/dating-shoot/run-status?orderId=${orderId}`);
    if (!res.ok) return;
    const data = await res.json();
    setStatus(data);
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;
    fetchStatus(activeOrderId);
    const interval = setInterval(() => {
      fetchStatus(activeOrderId);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeOrderId, fetchStatus]);

  const startShoot = async () => {
    if (!modelId) {
      setError('Select or create a model first');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dating-shoot/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId,
          interests,
          dress,
          hobbyText: hobbyText.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start shoot');
      setActiveOrderId(data.orderId);
      await fetchStatus(data.orderId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const retryFailed = async () => {
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

  const regenerate = async (photoId: string) => {
    if (!activeOrderId) return;
    setRegenLoading(photoId);
    try {
      const res = await fetch('/api/dating-shoot/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId, photoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Regenerate failed');
      setTimeout(() => fetchStatus(activeOrderId), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regenerate failed');
    } finally {
      setRegenLoading(null);
    }
  };

  const downloadAllZip = async () => {
    if (!status || !activeOrderId) return;
    setZipLoading(true);
    setZipProgress('Creating ZIP archive...');

    try {
      const zip = new JSZip();
      let count = 0;
      const totalToDownload = status.counts.completed;

      for (const bucket of DATING_BUCKETS) {
        const bucketData = status.byBucket[bucket];
        if (!bucketData || !bucketData.photos.length) continue;

        const folderName = `${BUCKET_LABELS[bucket].replace(/\s+/g, '-')}`;
        const folder = zip.folder(folderName);

        for (const photo of bucketData.photos) {
          count++;
          setZipProgress(`Adding ${count} of ${totalToDownload} photos...`);

          try {
            if (photo.imageUrl.startsWith('data:')) {
              // Mock SVG / Data URI
              const isSvg = photo.imageUrl.includes('svg');
              if (isSvg) {
                const svgText = decodeURIComponent(
                  photo.imageUrl.split(',')[1] || ''
                );
                folder?.file(`${bucket}_photo_${photo.slot}.svg`, svgText);
              } else {
                const base64Data = photo.imageUrl.split(',')[1];
                folder?.file(`${bucket}_photo_${photo.slot}.png`, base64Data, {
                  base64: true,
                });
              }
            } else {
              const res = await fetch(photo.imageUrl);
              if (res.ok) {
                const blob = await res.blob();
                folder?.file(`${bucket}_photo_${photo.slot}.png`, blob);
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
  const isReady =
    status?.order.status === 'ready' || status?.order.status === 'partial_failed';
  const allPhotos = DATING_BUCKETS.flatMap((bucket) =>
    (status?.byBucket?.[bucket]?.photos || []).map((photo) => ({
      ...photo,
      bucket,
    }))
  );
  const lineup = groupByLineup(allPhotos);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dating Photoshoot</h1>
        <p className="text-zinc-400 text-sm">
          100 photos. No two share an outfit or a light. One person in every
          frame — you.
        </p>
      </div>

      {/* New order form */}
      {!isDeveloping && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Start a new shoot
          </h2>

          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Model</label>
            {models.length === 0 ? (
              <Link
                href="/models/create"
                className="text-sm text-white underline"
              >
                Create your model first →
              </Link>
            ) : (
              <select
                value={modelId ?? ''}
                onChange={(e) => setModelId(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || `Model ${m.id}`} ({m.samples?.length || 0} photos)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-white font-medium block">
                What do you actually do?
              </label>
              <p className="text-xs text-zinc-500 mt-0.5 mb-3">
                Tap anything that fits. This decides what you are doing in the
                photos, not how many you get.
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CHIPS.map((chip) => {
                  const on = interests.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setInterests((prev) =>
                          prev.includes(chip.id)
                            ? prev.filter((id) => id !== chip.id)
                            : [...prev, chip.id]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        on
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      <span aria-hidden="true">{chip.emoji}</span> {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-white font-medium block">
                How do you dress?
              </label>
              <p className="text-xs text-zinc-500 mt-0.5 mb-3">
                Pick the one closest to your actual wardrobe.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {DRESS_OPTIONS.map((option) => {
                  const on = dress === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setDress(option.id)}
                      className={`text-left rounded-xl overflow-hidden border transition-colors ${
                        on
                          ? 'border-white ring-1 ring-white'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {option.previewImage ? (
                        <img
                          src={option.previewImage}
                          alt={option.label}
                          className="aspect-[3/4] w-full object-cover"
                        />
                      ) : (
                        <div
                          className="aspect-[3/4] w-full"
                          style={{ background: DRESS_SWATCHES[option.id] }}
                        />
                      )}
                      <div className="p-2">
                        <div className="text-sm text-white">{option.label}</div>
                        <div className="text-[11px] text-zinc-500 leading-tight">
                          {option.hint}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-white font-medium block">
                Anything else you are into?{' '}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                value={hobbyText}
                onChange={(e) => setHobbyText(e.target.value)}
                placeholder="e.g. bouldering, film photography, playing bass"
                className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={startShoot}
            disabled={loading || !modelId}
            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Starting...
              </>
            ) : (
              'Generate 100 dating photos — $59'
            )}
          </Button>
          <p className="text-xs text-zinc-600">
            Payment wiring can attach to Dodo later. For now this starts the
            pipeline directly (dev mode).
          </p>
        </div>
      )}

      {/* Active order status */}
      {status && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  {isReady ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isDeveloping ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <h2 className="text-white font-semibold capitalize">
                    {status.order.status.replace('_', ' ')}
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm mt-1">
                  {status.counts.completed} of {status.counts.total} photos ·{' '}
                  {status.order.custom_credits_remaining} custom credits left
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {status.counts.completed > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={downloadAllZip}
                    disabled={zipLoading}
                    className="bg-white text-black hover:bg-zinc-200 font-medium"
                  >
                    {zipLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {zipProgress || 'Creating ZIP...'}
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" />
                        Download All (ZIP)
                      </>
                    )}
                  </Button>
                )}
                {status.counts.failed > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryFailed}
                    disabled={loading}
                    className="border-zinc-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry {status.counts.failed} failed
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${status.progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {status.progressPercent}% developed ({status.counts.completed} photos ready)
              {isDeveloping && ' · refreshing every 5s'}
            </p>
          </div>

          {/* Delivery, grouped by the job each photo does */}
          <div className="space-y-8">
            {lineup.length === 0 ? (
              <div className="text-zinc-600 text-sm py-12 text-center border border-dashed border-zinc-800 rounded-xl">
                {isDeveloping
                  ? 'Photos will appear here as they develop...'
                  : 'No photos yet'}
              </div>
            ) : (
              lineup.map((section) => (
                <div key={section.role}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="text-white font-semibold">{section.label}</h3>
                    <span className="text-xs text-zinc-600">
                      {section.photos.length}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">{section.hint}</p>

                  <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
                    {section.photos.map((p) => (
                      <div
                        key={p.id}
                        className="relative mb-3 break-inside-avoid overflow-hidden rounded-lg bg-zinc-900 group"
                      >
                        <img
                          src={p.imageUrl}
                          alt={section.label}
                          className="block h-auto w-full"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <a
                            href={p.imageUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded py-1.5"
                          >
                            <Download className="w-3 h-3" /> Save
                          </a>
                          <button
                            onClick={() => regenerate(p.id)}
                            disabled={regenLoading === p.id}
                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded py-1.5"
                          >
                            {regenLoading === p.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Regen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Past orders */}
      {orders.length > 0 && (
        <div>
          <h3 className="text-sm text-zinc-500 mb-3">Your orders</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrderId(o.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm ${
                  activeOrderId === o.id
                    ? 'border-white/30 bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="capitalize">{o.status.replace('_', ' ')}</span>
                <span className="mx-2 text-zinc-600">·</span>
                <span className="text-zinc-500">
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
