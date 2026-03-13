'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, Camera, Sparkles, Users, User, CheckCircle2, AlertCircle } from 'lucide-react';

const GENDERS = ['Female', 'Male'] as const;
type Gender = typeof GENDERS[number];
type ModelMode = 'single' | 'couple';

// Max file size: 8MB (in bytes)
const MAX_FILE_SIZE = 8 * 1024 * 1024;

// Helper to check if file is too large
const isFileTooLarge = (file: File): boolean => file.size > MAX_FILE_SIZE;

// Format file size for display
const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
};

// Upload progress tracking
type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed';
interface UploadProgress {
    statuses: UploadStatus[];
    percentages: number[];
    errors: (string | null)[];
}

// Helper to upload with progress tracking using XHR
function uploadWithProgress(
    url: string,
    formData: FormData,
    onProgress: (percent: number) => void
): Promise<{ ok: boolean; error?: string }> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
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

        xhr.addEventListener('error', () => {
            resolve({ ok: false, error: 'Network error' });
        });

        xhr.addEventListener('abort', () => {
            resolve({ ok: false, error: 'Upload cancelled' });
        });

        xhr.open('POST', url);
        xhr.send(formData);
    });
}

export function CreateModelClient() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [modelMode, setModelMode] = useState<ModelMode>('single');
    const [name, setName] = useState('');
    const [gender, setGender] = useState<Gender>('Female');

    // For singles: 3-4 images
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // For couples: 3 woman + 3 man images
    const [womanImages, setWomanImages] = useState<File[]>([]);
    const [womanPreviews, setWomanPreviews] = useState<string[]>([]);
    const [manImages, setManImages] = useState<File[]>([]);
    const [manPreviews, setManPreviews] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Upload progress tracking
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

    // Single mode image upload
    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const remainingSlots = 4 - images.length;
        const filesToAdd = newFiles.slice(0, remainingSlots);

        setImages(prev => [...prev, ...filesToAdd]);

        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImagePreviews(prev => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [images.length]);

    // Couple mode image upload
    const handleCoupleImageUpload = useCallback((
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'woman' | 'man'
    ) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const currentImages = type === 'woman' ? womanImages : manImages;
        const remainingSlots = 3 - currentImages.length;
        const filesToAdd = newFiles.slice(0, remainingSlots);

        const setImagesFunc = type === 'woman' ? setWomanImages : setManImages;
        const setPreviewsFunc = type === 'woman' ? setWomanPreviews : setManPreviews;

        setImagesFunc(prev => [...prev, ...filesToAdd]);

        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setPreviewsFunc(prev => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [womanImages.length, manImages.length]);

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeCoupleImage = (index: number, type: 'woman' | 'man') => {
        if (type === 'woman') {
            setWomanImages(prev => prev.filter((_, i) => i !== index));
            setWomanPreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            setManImages(prev => prev.filter((_, i) => i !== index));
            setManPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async () => {
        // Validate based on mode
        if (modelMode === 'single' && images.length < 3) {
            setError('Please upload at least 3 reference photos');
            return;
        }
        if (modelMode === 'couple' && (womanImages.length < 3 || manImages.length < 3)) {
            setError('Please upload 3 photos for each person');
            return;
        }

        // Check for oversized images
        const allImagesToCheck = modelMode === 'couple'
            ? [...womanImages, ...manImages]
            : images;

        const hasOversizedImages = allImagesToCheck.some(isFileTooLarge);
        if (hasOversizedImages) {
            setError('Please remove images that exceed 8MB before continuing');
            return;
        }

        setIsLoading(true);
        setError('');

        // Get all images to upload
        const allImages = modelMode === 'couple'
            ? [...womanImages, ...manImages]
            : images;

        // Initialize upload progress tracking
        const initialProgress: UploadProgress = {
            statuses: allImages.map(() => 'pending'),
            percentages: allImages.map(() => 0),
            errors: allImages.map(() => null),
        };
        setUploadProgress(initialProgress);

        let modelId: number | null = null;

        try {
            // Create the model first
            const modelRes = await fetch('/api/models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    type: modelMode === 'couple' ? 'couple' : gender,
                    mode: modelMode,
                }),
            });

            if (!modelRes.ok) {
                const errorData = await modelRes.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create model');
            }

            const { model } = await modelRes.json();
            modelId = model.id;

            // Upload images one by one with progress tracking
            let hasFailure = false;
            let firstError: string | null = null;

            for (let i = 0; i < allImages.length; i++) {
                const img = allImages[i];

                // Update status to uploading
                setUploadProgress(prev => {
                    if (!prev) return prev;
                    const newStatuses = [...prev.statuses];
                    newStatuses[i] = 'uploading';
                    return { ...prev, statuses: newStatuses };
                });

                const formData = new FormData();
                formData.append('file', img);
                formData.append('filename', img.name);

                const result = await uploadWithProgress(
                    `/api/models/${model.id}/samples`,
                    formData,
                    (percent) => {
                        setUploadProgress(prev => {
                            if (!prev) return prev;
                            const newPercentages = [...prev.percentages];
                            newPercentages[i] = percent;
                            return { ...prev, percentages: newPercentages };
                        });
                    }
                );

                if (result.ok) {
                    // Update status to success
                    setUploadProgress(prev => {
                        if (!prev) return prev;
                        const newStatuses = [...prev.statuses];
                        const newPercentages = [...prev.percentages];
                        newStatuses[i] = 'success';
                        newPercentages[i] = 100;
                        return { ...prev, statuses: newStatuses, percentages: newPercentages };
                    });
                } else {
                    // Update status to failed
                    hasFailure = true;
                    if (!firstError) firstError = result.error || 'Upload failed';

                    setUploadProgress(prev => {
                        if (!prev) return prev;
                        const newStatuses = [...prev.statuses];
                        const newErrors = [...prev.errors];
                        newStatuses[i] = 'failed';
                        newErrors[i] = result.error || 'Upload failed';
                        return { ...prev, statuses: newStatuses, errors: newErrors };
                    });

                    // Stop uploading further if one fails
                    break;
                }
            }

            // If any upload failed, rollback by deleting the model
            if (hasFailure) {
                // Attempt to delete the orphan model
                try {
                    await fetch(`/api/models/${modelId}`, { method: 'DELETE' });
                } catch (deleteErr) {
                    console.error('Failed to cleanup orphan model:', deleteErr);
                }

                throw new Error(firstError || 'Some images failed to upload. Please try again.');
            }

            // All uploads succeeded - trigger preview generation and redirect to preview page
            try {
                const previewResp = await fetch('/api/preview/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ modelId }),
                });
                const previewData = await previewResp.json();

                if (!previewResp.ok) {
                    console.error('Preview generation failed:', previewResp.status, previewData);
                    // Log but don't block - user can still see preview page
                }
            } catch (previewErr) {
                console.error('Failed to trigger preview generation:', previewErr);
                // Don't block the redirect if preview fails - it can be retried
            }

            router.push(`/preview/${modelId}`);
        } catch (err) {
            console.error('Error creating model:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total steps based on mode
    const totalSteps = modelMode === 'couple' ? 2 : 3; // Couples skip gender step
    const currentStep = modelMode === 'couple' && step > 1 ? step - 1 : step;

    // For couples, step 2 is upload (skip gender)
    const uploadStep = modelMode === 'couple' ? 2 : 3;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Train Your Model</h1>
                    <p className="text-zinc-400 text-sm">
                        {modelMode === 'couple' ? 'Create photos of you and a friend or partner' : 'Upload reference photos to create your AI model'}
                    </p>
                </div>

                {/* Mode Toggle - Always visible */}
                <div className="flex p-1 bg-zinc-800 rounded-lg border border-zinc-700 mb-6">
                    <button
                        onClick={() => { setModelMode('single'); setStep(1); }}
                        className={`cursor-pointer flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${modelMode === 'single'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Single
                    </button>
                    <button
                        onClick={() => { setModelMode('couple'); setStep(1); }}
                        className={`cursor-pointer flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${modelMode === 'couple'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Duo
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i + 1 <= currentStep ? 'w-12 bg-white' : 'w-6 bg-zinc-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 animate-in fade-in">
                        <label className="text-sm font-medium text-zinc-400 mb-2 block">
                            Model Name
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={modelMode === 'couple' ? "e.g., Our Memories" : "e.g., Summer Vibes"}
                            className="bg-zinc-800 border-zinc-700 text-white mb-6"
                        />
                        <Button
                            onClick={() => setStep(modelMode === 'couple' ? uploadStep : 2)}
                            disabled={!name.trim()}
                            className="w-full bg-white text-black hover:bg-zinc-200"
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {/* Step 2: Gender (Single mode only) */}
                {step === 2 && modelMode === 'single' && (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 animate-in fade-in">
                        <label className="text-sm font-medium text-zinc-400 mb-3 block">
                            Subject Identity
                        </label>
                        <div className="flex p-1 bg-zinc-800 rounded-lg border border-zinc-700 mb-6">
                            {GENDERS.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${gender === g
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="flex-1 border-zinc-700 text-zinc-400 hover:text-white"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                className="flex-1 bg-white text-black hover:bg-zinc-200"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3 (Single) / Step 2 (Couple): Upload Images */}
                {((step === 3 && modelMode === 'single') || (step === 2 && modelMode === 'couple')) && (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 animate-in fade-in">

                        {/* Single Mode Upload */}
                        {modelMode === 'single' && (
                            <>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-medium text-zinc-400">
                                        Reference Photos
                                    </label>
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${images.length >= 3 ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {images.length}/4
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {imagePreviews.map((preview, i) => {
                                        const status = uploadProgress?.statuses[i];
                                        const percent = uploadProgress?.percentages[i] ?? 0;
                                        const errorMsg = uploadProgress?.errors[i];
                                        const file = images[i];
                                        const isTooLarge = file && isFileTooLarge(file);

                                        return (
                                            <div key={i} className={`relative aspect-[3/4] rounded-lg overflow-hidden group ${isTooLarge ? 'ring-2 ring-red-500' : ''}`}>
                                                <img src={preview} className="w-full h-full object-cover" alt="" />

                                                {/* File too large error overlay - always visible */}
                                                {isTooLarge && !isLoading && (
                                                    <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2">
                                                        <AlertCircle className="w-6 h-6 text-red-300 mb-1" />
                                                        <span className="text-[10px] text-red-200 text-center font-medium">Image too large</span>
                                                        <span className="text-[9px] text-red-300 text-center">{formatFileSize(file.size)} / 8MB</span>
                                                        <button
                                                            onClick={() => removeImage(i)}
                                                            className="mt-2 p-1.5 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
                                                        >
                                                            <X className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Upload progress overlay */}
                                                {isLoading && status && (
                                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                                        {status === 'pending' && (
                                                            <span className="text-xs text-zinc-400">Waiting...</span>
                                                        )}
                                                        {status === 'uploading' && (
                                                            <>
                                                                <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                                                                <div className="w-3/4 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-green-500 transition-all duration-150"
                                                                        style={{ width: `${percent}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs text-zinc-300 mt-1">{percent}%</span>
                                                            </>
                                                        )}
                                                        {status === 'success' && (
                                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                        )}
                                                        {status === 'failed' && (
                                                            <div className="flex flex-col items-center">
                                                                <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                                                <span className="text-[10px] text-red-400 text-center px-1">{errorMsg}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Remove button - only show when not loading and not too large (too large has its own button) */}
                                                {!isLoading && !isTooLarge && (
                                                    <button
                                                        onClick={() => removeImage(i)}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                    >
                                                        <X className="w-5 h-5 text-white" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {images.length < 4 && (
                                        <label className="aspect-[3/4] border border-zinc-700 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors bg-zinc-800/50">
                                            <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                                            <span className="text-[10px] text-zinc-500">Add Photo</span>
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

                                <p className="text-xs text-zinc-500 mb-6">
                                    Upload 3-4 clear photos of your subject. More variety = better results.
                                </p>
                            </>
                        )}

                        {/* Couple Mode Upload */}
                        {modelMode === 'couple' && (
                            <>
                                {/* Woman Photos */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-pink-400">
                                            Person-1 Photos
                                        </label>
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${womanPreviews.length >= 3 ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {womanPreviews.length}/3
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {womanPreviews.map((preview, i) => {
                                            // Woman images are at index 0-2 in uploadProgress
                                            const status = uploadProgress?.statuses[i];
                                            const percent = uploadProgress?.percentages[i] ?? 0;
                                            const errorMsg = uploadProgress?.errors[i];
                                            const file = womanImages[i];
                                            const isTooLarge = file && isFileTooLarge(file);

                                            return (
                                                <div key={i} className={`relative aspect-[3/4] rounded-lg overflow-hidden group ${isTooLarge ? 'ring-2 ring-red-500' : ''}`}>
                                                    <img src={preview} className="w-full h-full object-cover" alt="" />

                                                    {/* File too large error overlay */}
                                                    {isTooLarge && !isLoading && (
                                                        <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2">
                                                            <AlertCircle className="w-6 h-6 text-red-300 mb-1" />
                                                            <span className="text-[10px] text-red-200 text-center font-medium">Image too large</span>
                                                            <span className="text-[9px] text-red-300 text-center">{formatFileSize(file.size)} / 8MB</span>
                                                            <button
                                                                onClick={() => removeCoupleImage(i, 'woman')}
                                                                className="mt-2 p-1.5 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Upload progress overlay */}
                                                    {isLoading && status && (
                                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                                            {status === 'pending' && (
                                                                <span className="text-xs text-zinc-400">Waiting...</span>
                                                            )}
                                                            {status === 'uploading' && (
                                                                <>
                                                                    <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                                                                    <div className="w-3/4 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-pink-500 transition-all duration-150"
                                                                            style={{ width: `${percent}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-zinc-300 mt-1">{percent}%</span>
                                                                </>
                                                            )}
                                                            {status === 'success' && (
                                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                            )}
                                                            {status === 'failed' && (
                                                                <div className="flex flex-col items-center">
                                                                    <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                                                    <span className="text-[10px] text-red-400 text-center px-1">{errorMsg}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Remove button - only show when not loading and not too large */}
                                                    {!isLoading && !isTooLarge && (
                                                        <button
                                                            onClick={() => removeCoupleImage(i, 'woman')}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <X className="w-5 h-5 text-white" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {womanImages.length < 3 && (
                                            <label className="aspect-[3/4] border border-pink-500/30 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-colors bg-zinc-800/50">
                                                <Upload className="w-5 h-5 text-pink-400 mb-1" />
                                                <span className="text-[10px] text-pink-400/70">Add Photo</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleCoupleImageUpload(e, 'woman')}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Man Photos */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-blue-400">
                                            Person-2 Photos
                                        </label>
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${manPreviews.length >= 3 ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {manPreviews.length}/3
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {manPreviews.map((preview, i) => {
                                            // Man images are at index 3-5 in uploadProgress (after woman images)
                                            const progressIndex = womanImages.length + i;
                                            const status = uploadProgress?.statuses[progressIndex];
                                            const percent = uploadProgress?.percentages[progressIndex] ?? 0;
                                            const errorMsg = uploadProgress?.errors[progressIndex];
                                            const file = manImages[i];
                                            const isTooLarge = file && isFileTooLarge(file);

                                            return (
                                                <div key={i} className={`relative aspect-[3/4] rounded-lg overflow-hidden group ${isTooLarge ? 'ring-2 ring-red-500' : ''}`}>
                                                    <img src={preview} className="w-full h-full object-cover" alt="" />

                                                    {/* File too large error overlay */}
                                                    {isTooLarge && !isLoading && (
                                                        <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2">
                                                            <AlertCircle className="w-6 h-6 text-red-300 mb-1" />
                                                            <span className="text-[10px] text-red-200 text-center font-medium">Image too large</span>
                                                            <span className="text-[9px] text-red-300 text-center">{formatFileSize(file.size)} / 8MB</span>
                                                            <button
                                                                onClick={() => removeCoupleImage(i, 'man')}
                                                                className="mt-2 p-1.5 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Upload progress overlay */}
                                                    {isLoading && status && (
                                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                                            {status === 'pending' && (
                                                                <span className="text-xs text-zinc-400">Waiting...</span>
                                                            )}
                                                            {status === 'uploading' && (
                                                                <>
                                                                    <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                                                                    <div className="w-3/4 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-blue-500 transition-all duration-150"
                                                                            style={{ width: `${percent}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-zinc-300 mt-1">{percent}%</span>
                                                                </>
                                                            )}
                                                            {status === 'success' && (
                                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                            )}
                                                            {status === 'failed' && (
                                                                <div className="flex flex-col items-center">
                                                                    <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                                                    <span className="text-[10px] text-red-400 text-center px-1">{errorMsg}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Remove button - only show when not loading and not too large */}
                                                    {!isLoading && !isTooLarge && (
                                                        <button
                                                            onClick={() => removeCoupleImage(i, 'man')}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <X className="w-5 h-5 text-white" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {manImages.length < 3 && (
                                            <label className="aspect-[3/4] border border-blue-500/30 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors bg-zinc-800/50">
                                                <Upload className="w-5 h-5 text-blue-400 mb-1" />
                                                <span className="text-[10px] text-blue-400/70">Add Photo</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleCoupleImageUpload(e, 'man')}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-zinc-500 mb-6">
                                    Upload 3 clear photos of each person. Include similar angles and lighting for best results.
                                </p>
                            </>
                        )}

                        {error && (
                            <p className="text-sm text-red-400 mb-4">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStep(modelMode === 'couple' ? 1 : 2)}
                                className="flex-1 border-zinc-700 text-zinc-400 hover:text-white"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    (modelMode === 'single' && images.length < 3) ||
                                    (modelMode === 'couple' && (womanImages.length < 3 || manImages.length < 3)) ||
                                    isLoading
                                }
                                className="flex-1 bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4 mr-2" />
                                        Create Model
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
