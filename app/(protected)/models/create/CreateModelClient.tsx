'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_PHOTOS = 4;
const MAX_PHOTOS = 6;

const isFileTooLarge = (file: File): boolean => file.size > MAX_FILE_SIZE;
const formatFileSize = (bytes: number): string =>
  `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed';
interface UploadProgress {
  statuses: UploadStatus[];
  percentages: number[];
  errors: (string | null)[];
}

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true });
      } else {
        try {
          const resp = JSON.parse(xhr.responseText);
          resolve({ ok: false, error: resp.error || 'Upload failed' });
        } catch {
          resolve({ ok: false, error: 'Upload failed' });
        }
      }
    });
    xhr.addEventListener('error', () => resolve({ ok: false, error: 'Network error' }));
    xhr.open('POST', url);
    xhr.send(formData);
  });
}

const GUIDE_RULES = [
  'Face clearly visible — no sunglasses, no hats covering forehead',
  'Taken within the last 2 years',
  'Daylight or well-lit room, no harsh face shadows',
  'Include front-facing + at least one slight side angle',
  'At least one close-up (head + shoulders) and one half-body',
  'No other people in frame',
];

export function CreateModelClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [guideAccepted, setGuideAccepted] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const newFiles = Array.from(e.target.files);
      const remaining = MAX_PHOTOS - images.length;
      const filesToAdd = newFiles.slice(0, remaining);
      setImages((prev) => [...prev, ...filesToAdd]);
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImagePreviews((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images.length]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length < MIN_PHOTOS) {
      setError(`Upload at least ${MIN_PHOTOS} reference photos`);
      return;
    }
    if (images.some(isFileTooLarge)) {
      setError('Remove images over 8MB before continuing');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress({
      statuses: images.map(() => 'pending'),
      percentages: images.map(() => 0),
      errors: images.map(() => null),
    });

    let modelId: number | null = null;

    try {
      const modelRes = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type: 'Male',
          mode: 'single',
        }),
      });

      if (!modelRes.ok) {
        const errorData = await modelRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create model');
      }

      const { model } = await modelRes.json();
      modelId = model.id;

      let hasFailure = false;
      let firstError: string | null = null;

      for (let i = 0; i < images.length; i++) {
        setUploadProgress((prev) => {
          if (!prev) return prev;
          const statuses = [...prev.statuses];
          statuses[i] = 'uploading';
          return { ...prev, statuses };
        });

        const formData = new FormData();
        formData.append('file', images[i]);
        formData.append('filename', images[i].name);

        const result = await uploadWithProgress(
          `/api/models/${model.id}/samples`,
          formData,
          (percent) => {
            setUploadProgress((prev) => {
              if (!prev) return prev;
              const percentages = [...prev.percentages];
              percentages[i] = percent;
              return { ...prev, percentages };
            });
          }
        );

        if (result.ok) {
          setUploadProgress((prev) => {
            if (!prev) return prev;
            const statuses = [...prev.statuses];
            const percentages = [...prev.percentages];
            statuses[i] = 'success';
            percentages[i] = 100;
            return { ...prev, statuses, percentages };
          });
        } else {
          hasFailure = true;
          firstError = result.error || 'Upload failed';
          setUploadProgress((prev) => {
            if (!prev) return prev;
            const statuses = [...prev.statuses];
            const errors = [...prev.errors];
            statuses[i] = 'failed';
            errors[i] = firstError;
            return { ...prev, statuses, errors };
          });
          break;
        }
      }

      if (hasFailure) {
        try {
          await fetch(`/api/models/${modelId}`, { method: 'DELETE' });
        } catch {
          /* ignore */
        }
        throw new Error(firstError || 'Some images failed to upload');
      }

      // Mark model ready (no identity verification)
      await fetch(`/api/models/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      }).catch(() => null);

      router.push(`/dating-shoot?modelId=${modelId}`);
    } catch (err) {
      console.error('Error creating model:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Dating Photoshoot</h1>
          <p className="text-zinc-400 text-sm">
            Upload 4–6 photos of you. We&apos;ll build your 100-photo dating pack.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'w-12 bg-white' : 'w-6 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <label className="text-sm font-medium text-zinc-400 mb-2 block">
              Shoot name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Dating Pack"
              className="bg-zinc-800 border-zinc-700 text-white mb-6"
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Photo upload guide</h2>
            <p className="text-zinc-500 text-sm mb-4">
              Follow these strictly. Bad inputs = bad results.
            </p>
            <ul className="space-y-3 mb-6">
              {GUIDE_RULES.map((rule) => (
                <li key={rule} className="flex gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={guideAccepted}
                onChange={(e) => setGuideAccepted(e.target.checked)}
                className="mt-1 rounded border-zinc-600"
              />
              <span className="text-sm text-zinc-300">
                I&apos;ve read the guide and my photos follow these rules
              </span>
            </label>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-zinc-700 text-zinc-400"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!guideAccepted}
                className="flex-1 bg-white text-black hover:bg-zinc-200"
              >
                Continue
              </Button>
            </div>
            <p className="text-xs text-zinc-600 mt-4 text-center">
              Full guide:{' '}
              <Link href="/photo-upload-guide" className="text-zinc-400 underline">
                photo tips
              </Link>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-zinc-400">
                Reference photos
              </label>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                  images.length >= MIN_PHOTOS
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {images.length}/{MAX_PHOTOS}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {imagePreviews.map((preview, i) => {
                const status = uploadProgress?.statuses[i];
                const percent = uploadProgress?.percentages[i] ?? 0;
                const errorMsg = uploadProgress?.errors[i];
                const file = images[i];
                const tooLarge = file && isFileTooLarge(file);

                return (
                  <div
                    key={i}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden group ${
                      tooLarge ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <img src={preview} className="w-full h-full object-cover" alt="" />
                    {tooLarge && !isLoading && (
                      <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2">
                        <AlertCircle className="w-5 h-5 text-red-300 mb-1" />
                        <span className="text-[10px] text-red-200 text-center">
                          {formatFileSize(file.size)} / 8MB
                        </span>
                        <button
                          onClick={() => removeImage(i)}
                          className="mt-2 p-1.5 bg-red-600 rounded-full"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                    {isLoading && status && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        {status === 'pending' && (
                          <span className="text-xs text-zinc-400">Waiting...</span>
                        )}
                        {status === 'uploading' && (
                          <>
                            <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                            <span className="text-xs text-zinc-300">{percent}%</span>
                          </>
                        )}
                        {status === 'success' && (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        )}
                        {status === 'failed' && (
                          <span className="text-[10px] text-red-400 px-1 text-center">
                            {errorMsg}
                          </span>
                        )}
                      </div>
                    )}
                    {!isLoading && !tooLarge && (
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>
                );
              })}
              {images.length < MAX_PHOTOS && !isLoading && (
                <label className="aspect-[3/4] border border-zinc-700 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/30 bg-zinc-800/50">
                  <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                  <span className="text-[10px] text-zinc-500">Add</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              Min {MIN_PHOTOS}, max {MAX_PHOTOS}. Clear face photos only.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="flex-1 border-zinc-700 text-zinc-400"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || images.length < MIN_PHOTOS}
                className="flex-1 bg-white text-black hover:bg-zinc-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Create model'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
