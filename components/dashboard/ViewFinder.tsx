'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Plus, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FadeInImage } from '@/components/ui/FadeInImage';

// Configuration for the 5 physics engines (Modes)
const MODES = [
    { id: 'FLASH', label: 'FLASH', desc: 'Hard shadows' },
    { id: 'LIFESTYLE', label: 'LIFESTYLE', desc: 'Warm sun, Bistro lights' },
    { id: 'GRITTY', label: 'GRITTY VINTAGE', desc: 'B&W Street' },
    { id: 'CINE', label: 'CINE SHOOT', desc: 'Cinematic' },
    { id: 'PROFESSIONAL', label: 'Professional', desc: 'confident' }
];

const RATIOS = [
    { label: '9:16', value: '9:16', class: 'aspect-[9/16]' },
    { label: '16:9', value: '16:9', class: 'aspect-[16/9]' },
    { label: '3:4', value: '3:4', class: 'aspect-[3/4]' },
    { label: '4:5', value: '4:5', class: 'aspect-[4/5]' },
    { label: '4:3', value: '4:3', class: 'aspect-[4/3]' },
    { label: '5:4', value: '5:4', class: 'aspect-[5/4]' },
];

const LIGHTING = [
    { id: 'DAYLIGHT', label: 'Daylight', desc: 'Natural sun' },
    { id: 'NIGHT', label: 'Night', desc: 'Night light' }
];

interface Model {
    id: number;
    name: string;
    type: string;
    mode?: 'single' | 'couple';
    samples: { id: number; uri: string }[];
}

interface GeneratedImage {
    id: number;
    uri: string;
    created_at: string;
}

interface PendingJob {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    prompt: string;
    created_at: string;
    result_url?: string;
}

export const Viewfinder: React.FC = () => {
    // Models state
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [viewMode, setViewMode] = useState<'single' | 'couple'>('single');

    // Filter models based on view mode
    const filteredModels = models.filter(m =>
        m.mode === viewMode || (!m.mode && viewMode === 'single')
    );

    // Viewfinder State
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState(MODES[0]);
    const [aspectRatio, setAspectRatio] = useState(RATIOS[0]);
    const [lightingTime, setLightingTime] = useState(LIGHTING[0]);
    const [isDeveloping, setIsDeveloping] = useState(false);
    const [creditBalance, setCreditBalance] = useState<number | null>(null);

    // Generated images from database
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [flashTrigger, setFlashTrigger] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [downloadingImageId, setDownloadingImageId] = useState<number | null>(null);
    const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);

    const gridEndRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const pendingJobsRef = useRef<PendingJob[]>([]);

    // Keep ref in sync with state (avoids stale closures in polling)
    useEffect(() => {
        pendingJobsRef.current = pendingJobs;
    }, [pendingJobs]);

    // Fetch models on mount
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('/api/models');
                if (res.ok) {
                    const data = await res.json();
                    setModels(data.models || []);
                    if (data.models?.length > 0) {
                        const firstModel = data.models[0];
                        setSelectedModel(firstModel);
                        // Sync viewMode with the first selected model's mode
                        setViewMode(firstModel.mode === 'couple' ? 'couple' : 'single');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch models:', error);
            } finally {
                setIsLoadingModels(false);
            }
        };
        fetchModels();
    }, []);

    // Fetch credit balance on mount
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const res = await fetch('/api/credits/check');
                if (res.ok) {
                    const data = await res.json();
                    setCreditBalance(data.currentBalance ?? 0);
                }
            } catch (error) {
                console.error('Failed to fetch credits:', error);
                setCreditBalance(0);
            }
        };
        fetchCredits();

        // Listen for credit updates from other parts of the app
        const handleCreditUpdate = (e: CustomEvent) => {
            if (e.detail?.newBalance !== undefined) {
                setCreditBalance(e.detail.newBalance);
            }
        };
        window.addEventListener('creditUpdate', handleCreditUpdate as EventListener);
        return () => window.removeEventListener('creditUpdate', handleCreditUpdate as EventListener);
    }, []);

    useEffect(() => {
        if (!selectedModel?.id) return;

        const fetchImages = async () => {
            try {
                const res = await fetch(`/api/models/${selectedModel.id}/images?limit=10`);
                if (res.ok) {
                    const data = await res.json();
                    setGeneratedImages((data.images || []).slice(0, 10));
                }
            } catch (error) {
                console.error('Failed to fetch images:', error);
            }
        };
        fetchImages();
    }, [selectedModel?.id]); // Use ID not object to prevent duplicate fetches

    // Fetch pending jobs from database on mount/model change (restores after refresh)
    useEffect(() => {
        if (!selectedModel?.id) return;

        const fetchPendingJobs = async () => {
            try {
                const res = await fetch(`/api/fal/jobs?modelId=${selectedModel.id}&status=pending`);
                if (res.ok) {
                    const { jobs } = await res.json();
                    const pending = (jobs || []).map((j: any) => ({
                        id: j.id,
                        status: j.status,
                        prompt: j.prompt || '',
                        created_at: j.created_at,
                        result_url: j.result_url,
                    }));
                    setPendingJobs(pending);
                }
            } catch (error) {
                console.error('Failed to fetch pending jobs:', error);
            }
        };
        fetchPendingJobs();
    }, [selectedModel?.id]); // Use ID not object to prevent duplicate fetches

    // Poll for pending job updates - runs every 5s when jobs are pending
    useEffect(() => {
        if (!selectedModel) return;

        const pollJobs = async () => {
            // Check ref (not state) to avoid infinite loop
            const currentPending = pendingJobsRef.current.filter(j => j.status === 'pending');
            if (currentPending.length === 0) return;

            try {
                const res = await fetch(`/api/fal/jobs?modelId=${selectedModel.id}&limit=10`);
                if (!res.ok) return;

                const { jobs } = await res.json();

                // Check for completed jobs
                const completedJobIds = jobs
                    ?.filter((j: any) => j.status === 'completed' || j.status === 'failed')
                    .map((j: any) => j.id) || [];

                if (completedJobIds.length > 0) {
                    // Refresh images to show new completions
                    const imagesRes = await fetch(`/api/models/${selectedModel.id}/images?limit=10`);
                    if (imagesRes.ok) {
                        const data = await imagesRes.json();
                        setGeneratedImages((data.images || []).slice(0, 10));
                    }

                    // Remove completed/failed jobs from pending state
                    setPendingJobs(prev => prev.filter(p => !completedJobIds.includes(p.id)));
                }
            } catch (error) {
                console.error('Failed to poll jobs:', error);
            }
        };

        // Poll every 5 seconds (don't call immediately - initial fetch handles it)
        const interval = setInterval(pollJobs, 5000);

        return () => clearInterval(interval);
    }, [selectedModel?.id]); // Use ID not object to prevent duplicate fetches

    // Main Logic: The Shutter - Now uses fal.ai queue for background processing
    const handleShutter = async () => {
        if (prompt.length === 0 || !selectedModel) return;

        setFlashTrigger(true);
        setTimeout(() => setFlashTrigger(false), 200);

        setIsDeveloping(true);
        setStatusMessage('Please wait...Submitting job...');

        try {
            const gender = selectedModel.type || 'Female';

            // Submit to fal.ai queue via our API
            const res = await fetch('/api/fal/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modelId: selectedModel.id,
                    prompt,
                    mode: mode.id,
                    gender: gender.toUpperCase(),
                    lighting: lightingTime.id,
                    aspectRatio: aspectRatio.value,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setStatusMessage('Processing in background...');

                // Add to pending jobs for tracking
                const newJob: PendingJob = {
                    id: result.jobId || result.requestId,
                    status: 'pending',
                    prompt: prompt,
                    created_at: new Date().toISOString(),
                };
                setPendingJobs(prev => [newJob, ...prev]);

                // Dispatch credit update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('creditUpdate', {
                        detail: {
                            change: -1,
                            operation: 'deduct',
                            timestamp: Date.now()
                        }
                    }));
                }

                setPrompt('');

                // Auto-scroll to gallery on mobile (ONE TIME ONLY)
                // Use a small timeout to let the UI update with the new pending card
                setTimeout(() => {
                    if (window.innerWidth < 768) { // Only force scroll on mobile
                        galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);

                // Quick feedback then clear
                setTimeout(() => setStatusMessage(''), 2000);
            } else {
                console.warn("Generation failed:", result.error);
                setStatusMessage('Failed');
                if (result.error === 'Insufficient credits') {
                    alert("You don't have enough credits. Please purchase more.");
                } else {
                    alert(result.error || "Generation failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Generation failed:", error);
            setStatusMessage('Error');
            alert("Generation failed. Please try again.");
        } finally {
            setIsDeveloping(false);
        }
    };

    if (isLoadingModels) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-zinc-400">Loading models...</div>
            </div>
        );
    }

    // SHOOTING SCREEN
    return (
        <div className="relative min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background md:overflow-hidden">
            {/* FLASH OVERLAY */}
            <div className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-150 ease-out ${flashTrigger ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* --- LEFT PANEL: CONTROLS --- */}
            <div className="order-1 w-full md:w-[30%] md:min-w-[340px] min-h-[calc(100vh-4rem)] md:min-h-0 md:h-full flex flex-col relative bg-zinc-900 rounded-lg border border-zinc-700 z-20">

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">

                    {/* Single/Couple Mode Tabs */}
                    <div className="flex p-1 bg-zinc-800 rounded-lg border border-zinc-700">
                        <button
                            onClick={() => {
                                setViewMode('single');
                                // Select first single model if available
                                const singleModels = models.filter(m => m.mode === 'single' || !m.mode);
                                if (singleModels.length > 0) setSelectedModel(singleModels[0]);
                            }}
                            className={`cursor-pointer flex-1 py-2 text-xs font-medium rounded-md transition-all ${viewMode === 'single'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            Single
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('couple');
                                // Select first couple model if available
                                const coupleModels = models.filter(m => m.mode === 'couple');
                                if (coupleModels.length > 0) setSelectedModel(coupleModels[0]);
                                else setSelectedModel(null);
                            }}
                            className={`cursor-pointer flex-1 py-2 text-xs font-medium rounded-md transition-all ${viewMode === 'couple'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            Duo
                        </button>
                    </div>

                    {/* 1. Model Selector */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-3 block uppercase tracking-wide">Your Model</label>
                        <p className="text-[10px] text-zinc-500 mb-2">Choose which trained model to use for image generation</p>
                        <div className="relative">
                            <button
                                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                className="cursor-pointer w-full flex items-center justify-between gap-2 px-4 py-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center overflow-hidden">
                                        {selectedModel?.samples?.[0]?.uri ? (
                                            <img
                                                src={selectedModel.samples[0].uri}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-zinc-500">{selectedModel?.name?.charAt(0) || '?'}</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-white">
                                        {selectedModel?.name || 'Select Model'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isModelDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                    {filteredModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                setSelectedModel(model);
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className={`cursor-pointer w-full px-4 py-3 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-3 ${selectedModel?.id === model.id ? 'bg-zinc-700 text-white' : 'text-zinc-300'
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center overflow-hidden shrink-0">
                                                {model.samples?.[0]?.uri ? (
                                                    <img
                                                        src={model.samples[0].uri}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-xs font-bold text-zinc-500">{model.name?.charAt(0) || '?'}</span>
                                                )}
                                            </div>
                                            {model.name}
                                        </button>
                                    ))}
                                    <Link
                                        href="/models/create"
                                        className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-emerald-400 hover:bg-zinc-700 border-t border-zinc-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Train New Model
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Aspect Ratio Selector */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-3 block uppercase tracking-wide">Aspect Ratio</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {RATIOS.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => setAspectRatio(r)}
                                    className={`cursor-pointer flex flex-col items-center gap-2 p-2 rounded-lg border transition-all min-w-[52px] ${aspectRatio.value === r.value
                                        ? 'bg-white text-black shadow-sm'
                                        : 'bg-transparent border-zinc-700 text-zinc-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className={`w-5 bg-current rounded-[1px] opacity-80 ${r.class}`}></div>
                                    <span className="text-[10px] font-medium">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Lighting Time */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-3 block uppercase tracking-wide">Lighting Time</label>
                        <div className="flex gap-2">
                            {LIGHTING.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setLightingTime(l)}
                                    className={`cursor-pointer flex-1 p-2.5 rounded-lg border transition-all ${lightingTime.id === l.id
                                        ? 'bg-white text-black shadow-sm'
                                        : 'bg-transparent border-zinc-700 hover:bg-white/5 hover:border-zinc-700'
                                        }`}
                                >
                                    <div className={`font-semibold text-xs mb-0.5 ${lightingTime.id === l.id ? 'text-black' : 'text-zinc-400'}`}>{l.label}</div>
                                    <div className={`text-[10px] font-medium ${lightingTime.id === l.id ? 'text-zinc-600' : 'text-zinc-500'}`}>{l.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Lighting Style */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-3 block uppercase tracking-wide">Photoshoot Style</label>
                        <div className="grid grid-cols-2 gap-2">
                            {MODES.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m)}
                                    className={`cursor-pointer p-2.5 rounded-lg border text-left transition-all ${mode.id === m.id
                                        ? 'bg-white text-black shadow-sm'
                                        : 'bg-transparent border-zinc-700 hover:bg-white/5 hover:border-zinc-700'
                                        }`}
                                >
                                    <div className={`font-semibold text-xs mb-0.5 ${mode.id === m.id ? 'text-black' : 'text-zinc-400'}`}>{m.label}</div>
                                    <div className={`text-[10px] font-medium ${mode.id === m.id ? 'text-zinc-600' : 'text-zinc-500'}`}>{m.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Scene Input */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-3 block uppercase tracking-wide">Scene Description</label>
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="describe how you want to look.....i.e. 'i am wearing a hoodie and walking on a urban street.'"
                                className="w-full h-28 bg-zinc-800/30 border border-zinc-700 text-white text-sm p-4 rounded-lg resize-none outline-none focus:border-zinc-500 focus:bg-zinc-800/50 transition-all placeholder:text-zinc-500"
                            />
                            <div className="absolute bottom-3 right-3 text-[10px] font-medium text-accent opacity-50 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                                AI Enhanced
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-5 border-t border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
                    {creditBalance === 0 ? (
                        <Link
                            href="/buy-credits"
                            className="w-full h-12 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
                        >
                            Buy Credits →
                        </Link>
                    ) : (
                        <button
                            onClick={handleShutter}
                            disabled={prompt.length === 0 || isDeveloping || !selectedModel}
                            className="cursor-pointer w-full h-12 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                        >
                            {isDeveloping ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Developing...
                                </>
                            ) : (
                                "Capture Frame"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* --- RIGHT PANEL: OUTPUT GALLERY --- */}
            <div ref={galleryRef} className="order-2 w-full md:w-[70%] min-h-[50vh] md:h-full bg-background relative flex flex-col">



                {/* Gallery Area */}
                <div className="flex-1 overflow-y-auto md:px-4 custom-scrollbar">
                    {generatedImages.length === 0 && !isDeveloping && pendingJobs.filter(j => j.status === 'pending').length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
                            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-zinc-600 mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            </div>
                            <h3 className="text-sm font-medium text-white">No exposures yet</h3>
                            <p className="text-xs text-zinc-400 mt-1">Compose your shot to begin</p>
                        </div>
                    ) : (
                        <div className="columns-2 md:columns-2 lg:columns-3 gap-2 md:gap-4 space-y-2 md:space-y-3 pb-12 pt-4 md:pt-0">
                            {/* Pending job loader cards - one for each pending job */}
                            {pendingJobs.filter(j => j.status === 'pending').map((job) => (
                                <div key={job.id} className="break-inside-avoid w-full bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg overflow-hidden aspect-[3/4] flex flex-col items-center justify-center relative">
                                    {/* Animated spinner */}
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 rounded-full border-2 border-zinc-600"></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium text-white/80 tracking-widest uppercase">
                                        Processing
                                    </div>
                                    <div className="text-[10px] text-zinc-500 mt-1 px-4 text-center truncate max-w-full">
                                        You can now leave this page if needed
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            ))}
                            {/* Custom Loading Animation for active submission */}
                            {isDeveloping && (
                                <div className="break-inside-avoid w-full bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg overflow-hidden aspect-[3/4] flex flex-col items-center justify-center relative">
                                    {/* Animated camera shutter */}
                                    <div className="relative w-16 h-16 mb-4">
                                        {/* Outer ring */}
                                        <div className="absolute inset-0 rounded-full border-2 border-zinc-600"></div>

                                        {/* Spinning segments */}
                                        <div className="absolute inset-1 rounded-full overflow-hidden">
                                            {[...Array(8)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-full h-full origin-center"
                                                    style={{
                                                        transform: `rotate(${i * 45}deg)`,
                                                    }}
                                                >
                                                    <div
                                                        className="absolute top-0 left-1/2 w-0.5 h-4 -translate-x-1/2 bg-white/30 rounded-full animate-pulse"
                                                        style={{
                                                            animationDelay: `${i * 100}ms`,
                                                        }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Center dot with glow */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                                            <div className="absolute w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Status text */}
                                    <div className="text-xs font-medium text-white/80 tracking-widest uppercase">
                                        {statusMessage || 'Creating'}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>

                                    {/* Subtle shimmer effect */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                                        <div
                                            className="absolute inset-x-0 h-20 bg-gradient-to-b from-white/10 via-white/5 to-transparent"
                                            style={{
                                                animation: 'shimmer 2s ease-in-out infinite',
                                            }}
                                        ></div>
                                    </div>
                                    <style jsx>{`
                                        @keyframes shimmer {
                                            0%, 100% { transform: translateY(-100%); }
                                            50% { transform: translateY(400%); }
                                        }
                                    `}</style>
                                </div>
                            )}

                            {/* Photos from database */}
                            {generatedImages.map((image) => (
                                <div key={image.id} className="break-inside-avoid group relative bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:border-zinc-600 hover:-translate-y-1">
                                    <FadeInImage
                                        src={image.uri}
                                        width={600}
                                        height={800}
                                        alt={`Generated ${image.id}`}
                                    />

                                    {/* Mobile: Always visible download button (bottom-right) */}
                                    <button
                                        disabled={downloadingImageId === image.id}
                                        onClick={async () => {
                                            if (downloadingImageId === image.id) return;
                                            setDownloadingImageId(image.id);
                                            try {
                                                const response = await fetch('/api/download', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ imageUrl: image.uri }),
                                                });
                                                if (!response.ok) throw new Error('Download failed');
                                                const blob = await response.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `unrealshot_${image.id}.png`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                window.URL.revokeObjectURL(url);
                                            } catch (error) {
                                                console.error('Download failed:', error);
                                            } finally {
                                                setDownloadingImageId(null);
                                            }
                                        }}
                                        className="md:hidden absolute bottom-2 right-2 p-2.5 bg-black/70 backdrop-blur-sm text-white rounded-full hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-wait z-10"
                                    >
                                        {downloadingImageId === image.id ? (
                                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                    </button>

                                    {/* Desktop: Hover overlay with download button */}
                                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <div className="flex gap-2">
                                            <button
                                                disabled={downloadingImageId === image.id}
                                                onClick={async () => {
                                                    if (downloadingImageId === image.id) return;
                                                    setDownloadingImageId(image.id);
                                                    try {
                                                        const response = await fetch('/api/download', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ imageUrl: image.uri }),
                                                        });
                                                        if (!response.ok) throw new Error('Download failed');
                                                        const blob = await response.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `unrealshot_${image.id}.png`;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        document.body.removeChild(a);
                                                        window.URL.revokeObjectURL(url);
                                                    } catch (error) {
                                                        console.error('Download failed:', error);
                                                    } finally {
                                                        setDownloadingImageId(null);
                                                    }
                                                }}
                                                className="cursor-pointer px-4 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-wait"
                                            >
                                                {downloadingImageId === image.id ? (
                                                    <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <Download className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={gridEndRef} />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>
        </div>
    );
};