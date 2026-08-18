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
  CheckCircle2,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
} from 'lucide-react';
import { POSE_GUIDES } from '@/components/dating/PoseGuides';

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
    xhr.addEventListener('error', () =>
      resolve({ ok: false, error: 'Network error' })
    );
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
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

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

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    if (images.length < MIN_PHOTOS) {
      setError(`Please upload at least ${MIN_PHOTOS} photos`);
      return;
    }

    const largeFiles = images.filter(isFileTooLarge);
    if (largeFiles.length > 0) {
      setError(
        `${largeFiles.length} photo(s) exceed the 8MB limit. Please remove or replace them.`
      );
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress({
      statuses: images.map(() => 'pending'),
      percentages: images.map(() => 0),
      errors: images.map(() => null),
    });

    try {
      // 1. Create model in Supabase
      const createRes = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: 'Male' }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || 'Failed to create model');
      }

      const modelId = createData.model.id;

      // 2. Upload images in parallel
      const uploadPromises = images.map(async (file, i) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('modelId', String(modelId));
        formData.append('index', String(i));

        setUploadProgress((prev) => {
          if (!prev) return null;
          const statuses = [...prev.statuses];
          statuses[i] = 'uploading';
          return { ...prev, statuses };
        });

        try {
          const result = await uploadWithProgress(
            '/api/models/upload',
            formData,
            (percent) => {
              setUploadProgress((prev) => {
                if (!prev) return null;
                const percentages = [...prev.percentages];
                percentages[i] = percent;
                return { ...prev, percentages };
              });
            }
          );

          if (!result.ok) {
            throw new Error(result.error || 'Upload failed');
          }

          setUploadProgress((prev) => {
            if (!prev) return null;
            const statuses = [...prev.statuses];
            const percentages = [...prev.percentages];
            statuses[i] = 'success';
            percentages[i] = 100;
            return { ...prev, statuses, percentages };
          });
        } catch (uploadErr) {
          const msg =
            uploadErr instanceof Error ? uploadErr.message : 'Upload failed';
          setUploadProgress((prev) => {
            if (!prev) return null;
            const statuses = [...prev.statuses];
            const errors = [...prev.errors];
            statuses[i] = 'failed';
            errors[i] = msg;
            return { ...prev, statuses, errors };
          });
          throw uploadErr;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const hasFailure = results.some((r) => r.status === 'rejected');
      const firstError = results.find(
        (r): r is PromiseRejectedResult => r.status === 'rejected'
      )?.reason?.message;

      if (hasFailure) {
        try {
          await fetch(`/api/models/${modelId}`, { method: 'DELETE' });
        } catch {
          /* ignore */
        }
        throw new Error(firstError || 'Some images failed to upload');
      }

      // Mark model ready
      await fetch(`/api/models/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      }).catch(() => null);

      // Route directly to the Dating Studio
      router.push(`/dating-shoot?modelId=${modelId}`);
    } catch (err) {
      console.error('Error creating model:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 select-none">
      <div className="w-full max-w-lg space-y-6">
        {/* Clean Studio Header (No Tacky Giant Glowing Icon Box) */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-2">
            <Camera className="w-3.5 h-3.5 text-accent" />
            AI Face Model Training
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-oxanium">
            Dating Photoshoot Setup
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
            Upload 4–6 clear photos of you. We&apos;ll train your likeness to generate your 100-photo dating suite.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center gap-2">
          {[
            { num: 1, label: 'Name' },
            { num: 2, label: 'Guide' },
            { num: 3, label: 'Photos' },
          ].map(({ num, label }) => (
            <div
              key={num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-oxanium transition-all border ${
                step === num
                  ? 'bg-white text-black border-white font-bold shadow-sm'
                  : step > num
                  ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                  : 'bg-zinc-950/60 text-zinc-600 border-zinc-800'
              }`}
            >
              <span>{num}.</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: SHOOT NAME */}
        {step === 1 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-200 font-oxanium">
                Photoshoot Model Name
              </label>
              <p className="text-[11px] text-zinc-500">
                Give your face model a memorable name (e.g. My Dating Pack, Alex 2026).
              </p>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Dating Photoshoot"
              className="bg-zinc-900/80 border-zinc-800 rounded-lg text-white text-sm focus:border-zinc-500 h-11"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  setStep(2);
                }
              }}
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs sm:text-sm h-11 rounded-lg shadow-sm font-oxanium flex items-center justify-center gap-2"
            >
              Continue to Photo Guide
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Button>
          </div>
        )}

        {/* STEP 2: UPLOAD RULES */}
        {step === 2 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-white font-oxanium">
                Photo Upload Guide
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Follow these strictly for maximum facial accuracy.
              </p>
            </div>

            <ul className="space-y-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-3.5">
              {GUIDE_RULES.map((rule) => (
                <li key={rule} className="flex gap-2.5 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="leading-snug">{rule}</span>
                </li>
              ))}
            </ul>

            <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
              <input
                type="checkbox"
                checked={guideAccepted}
                onChange={(e) => setGuideAccepted(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 accent-white w-4 h-4"
              />
              <span className="text-xs text-zinc-300 select-none">
                I&apos;ve read the guide and my photos follow these rules
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs h-11 rounded-lg font-oxanium flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!guideAccepted}
                className="flex-1 bg-white text-black hover:bg-zinc-200 font-semibold text-xs h-11 rounded-lg shadow-sm font-oxanium flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                Continue to Upload
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <p className="text-[11px] text-zinc-600 text-center">
              Need examples? View our{' '}
              <Link href="/photo-upload-guide" className="text-zinc-400 hover:text-white underline">
                photo tips guide
              </Link>
            </p>
          </div>
        )}

        {/* STEP 3: REFERENCE PHOTOS */}
        {step === 3 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-white font-oxanium">
                  Upload Reference Photos
                </label>
                <p className="text-[11px] text-zinc-500">
                  {MIN_PHOTOS} to {MAX_PHOTOS} photos required
                </p>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-oxanium ${
                  images.length >= MIN_PHOTOS
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}
              >
                {images.length}/{MAX_PHOTOS}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
                const preview = imagePreviews[i];
                const guide = POSE_GUIDES[i];

                if (!preview) {
                  if (isLoading) return null;
                  return (
                    <label
                      key={guide?.key ?? `extra-${i}`}
                      className="aspect-[3/4] border border-zinc-800 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/50 bg-zinc-900/30 p-2 text-center transition-all group"
                    >
                      {guide ? (
                        <>
                          <guide.Icon className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                          <span className="text-[10px] text-zinc-300 mt-1 font-medium font-oxanium">
                            {guide.label}
                          </span>
                          <span className="text-[9px] text-zinc-500 leading-tight truncate w-full">
                            {guide.hint}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 mb-1 transition-colors" />
                          <span className="text-[10px] text-zinc-500">Add photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  );
                }

                const status = uploadProgress?.statuses[i];
                const percent = uploadProgress?.percentages[i] ?? 0;
                const errorMsg = uploadProgress?.errors[i];
                const file = images[i];
                const tooLarge = file && isFileTooLarge(file);

                return (
                  <div
                    key={guide?.key ?? `photo-${i}`}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden group border border-zinc-800 ${
                      tooLarge ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    {guide && !isLoading && !tooLarge && (
                      <span className="absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-zinc-200 font-mono">
                        {guide.label}
                      </span>
                    )}
                    {tooLarge && !isLoading && (
                      <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center p-2">
                        <AlertCircle className="w-5 h-5 text-red-400 mb-1" />
                        <span className="text-[10px] text-red-200 text-center font-mono">
                          {formatFileSize(file.size)} / 8MB
                        </span>
                        <button
                          onClick={() => removeImage(i)}
                          className="mt-2 p-1 bg-red-600 rounded-full"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    )}
                    {isLoading && status && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2">
                        {status === 'pending' && (
                          <span className="text-[11px] text-zinc-400 font-mono">
                            Waiting...
                          </span>
                        )}
                        {status === 'uploading' && (
                          <>
                            <Loader2 className="w-5 h-5 text-white animate-spin mb-1.5" />
                            <span className="text-[11px] text-zinc-300 font-mono">
                              {percent}%
                            </span>
                          </>
                        )}
                        {status === 'success' && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        )}
                        {status === 'failed' && (
                          <span className="text-[10px] text-red-400 px-1 text-center font-mono">
                            {errorMsg}
                          </span>
                        )}
                      </div>
                    )}
                    {!isLoading && !tooLarge && (
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center border border-zinc-700">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-500">
              Min {MIN_PHOTOS}, max {MAX_PHOTOS}. Photos fill in order — different angles yield better likeness in all 100 photos.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="flex-1 border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs h-11 rounded-lg font-oxanium flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || images.length < MIN_PHOTOS}
                className="flex-1 bg-white text-black hover:bg-zinc-200 font-semibold text-xs h-11 rounded-lg shadow-sm font-oxanium flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Create Model & Continue
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
