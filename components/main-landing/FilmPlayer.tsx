"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { useTranslations } from "next-intl"
import { Maximize2, Minimize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCENT = "#ff6f00"
const HIDE_CONTROLS_AFTER_MS = 2600

type Mode = "preview" | "active"
type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function chapterIndexAt(starts: number[], time: number) {
  let index = 0
  starts.forEach((start, i) => {
    if (time >= start) index = i
  })
  return index
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 [&_svg]:size-[18px]"
    >
      {children}
    </button>
  )
}

function PlayDisc({ large = false }: { large?: boolean }) {
  return (
    <span className={cn("relative grid place-items-center", large ? "size-[76px] sm:size-[92px]" : "size-16 sm:size-[72px]")}>
      <span className="absolute inset-0 rounded-full bg-[#ff6f00]/25 motion-safe:animate-ping [animation-duration:2.6s]" />
      <span className="absolute inset-0 rounded-full border border-white/35 bg-white/10 backdrop-blur-md" />
      <span
        className={cn(
          "relative grid place-items-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out group-hover/cta:scale-[1.06]",
          large ? "size-[58px] sm:size-[70px]" : "size-12 sm:size-14",
        )}
      >
        <Play className={cn("ml-0.5 fill-current", large ? "size-6 sm:size-7" : "size-5")} strokeWidth={0} />
      </span>
    </span>
  )
}

export type FilmCopy = {
  label: string
  watch: string
  meta: string
  play: string
  chapters: string[]
}

type FilmPlayerProps = {
  copy: FilmCopy
  sources: { desktop: string; mobile: string }
  poster: string
  /** Scene start times in seconds, one per entry in copy.chapters */
  chapterStarts: number[]
  fallbackDuration: number
  ctaLabel: string
  ctaHref?: string
  className?: string
}

export function FilmPlayer({
  copy,
  sources,
  poster,
  chapterStarts,
  fallbackDuration,
  ctaLabel,
  ctaHref = "/login",
  className,
}: FilmPlayerProps) {
  const t = useTranslations("Home.filmPlayer")
  const chapters = copy.chapters

  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<FullscreenVideo>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | undefined>(undefined)

  const [mode, setMode] = useState<Mode>("preview")
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(fallbackDuration)
  const [bufferedEnd, setBufferedEnd] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const [hover, setHover] = useState<{ x: number; time: number; width: number } | null>(null)

  // Silent looping preview while the player is on screen. Skipped for reduced motion and data saver.
  useEffect(() => {
    const video = videoRef.current
    const frame = frameRef.current
    if (!video || !frame || mode !== "preview") return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return

    let observer: IntersectionObserver | undefined
    const startObserving = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.muted = true
            video.play().catch(() => { })
          } else {
            video.pause()
          }
        },
        { threshold: 0.35 },
      )
      observer.observe(frame)
    }
    // Let the page's critical images load before the video starts streaming.
    const idle = window.setTimeout(startObserving, 900)
    return () => {
      window.clearTimeout(idle)
      observer?.disconnect()
    }
  }, [mode])

  // Smooth progress while the film plays with sound.
  useEffect(() => {
    if (mode !== "active" || !playing) return
    let frame = 0
    const tick = () => {
      const video = videoRef.current
      if (video) setTime(video.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [mode, playing])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      window.clearTimeout(hideTimer.current)
    }
  }, [])

  const revealControls = useCallback(() => {
    setControlsVisible(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), HIDE_CONTROLS_AFTER_MS)
  }, [])

  const startFilm = () => {
    const video = videoRef.current
    if (!video) return
    video.loop = false
    video.currentTime = 0
    video.muted = false
    setMuted(false)
    setEnded(false)
    setTime(0)
    setMode("active")
    revealControls()
    video.play().catch(() => {
      // Browser refused audio playback: fall back to muted rather than doing nothing.
      video.muted = true
      setMuted(true)
      video.play().catch(() => { })
    })
    frameRef.current?.focus({ preventScroll: true })
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (ended) {
      startFilm()
      return
    }
    if (video.paused) video.play().catch(() => { })
    else video.pause()
    revealControls()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    revealControls()
  }

  const toggleFullscreen = () => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { })
    } else if (frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => { })
    } else {
      video.webkitEnterFullscreen?.()
    }
  }

  const seekTo = (target: number) => {
    const video = videoRef.current
    if (!video) return
    const next = clamp(target, 0, duration)
    video.currentTime = next
    setTime(next)
    if (ended && next < duration) setEnded(false)
    revealControls()
  }

  const timeAtPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, time: 0, width: 0 }
    const x = clamp(clientX - rect.left, 0, rect.width)
    return { x, time: (x / rect.width) * duration, width: rect.width }
  }

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setScrubbing(true)
    seekTo(timeAtPointer(e.clientX).time)
  }

  const onTrackPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const point = timeAtPointer(e.clientX)
    setHover(point)
    if (scrubbing) seekTo(point.time)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== "active") return
    const onControl = (e.target as HTMLElement).closest("button, a")
    switch (e.key) {
      case " ":
      case "k":
        if (onControl && e.key === " ") return
        e.preventDefault()
        togglePlay()
        break
      case "m":
        toggleMute()
        break
      case "f":
        toggleFullscreen()
        break
      case "ArrowLeft":
        e.preventDefault()
        seekTo(time - 5)
        break
      case "ArrowRight":
        e.preventDefault()
        seekTo(time + 5)
        break
    }
  }

  const chapterIndex = chapterIndexAt(chapterStarts, time)
  const segments = chapterStarts.map((start, i) => ({
    start,
    end: chapterStarts[i + 1] ?? duration,
  }))
  const fillFor = (start: number, end: number, value: number) =>
    `${clamp((value - start) / (end - start), 0, 1) * 100}%`
  const showControls = mode === "active" && (!playing || scrubbing || controlsVisible || ended)

  return (
    <div className={cn("relative isolate mx-auto w-full text-left", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-12 bottom-6 -z-10 rounded-[48px] bg-[radial-gradient(ellipse_at_center,rgba(255,111,0,0.22),transparent_68%)] blur-2xl"
      />

      <div className="rounded-[22px] border border-white/15 bg-[#141414] p-1.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:rounded-[26px] sm:p-2">
        <div
          ref={frameRef}
          role="region"
          aria-label={copy.label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onPointerMove={mode === "active" ? revealControls : undefined}
          className={cn(
            "relative aspect-video overflow-hidden rounded-[16px] bg-black outline-none sm:rounded-[19px] [&:fullscreen]:rounded-none",
            mode === "active" && playing && !showControls && "cursor-none",
          )}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain"
            poster={poster}
            muted={muted}
            loop={mode === "preview"}
            playsInline
            preload="metadata"
            aria-label={copy.label}
            onClick={mode === "active" ? togglePlay : undefined}
            onDoubleClick={mode === "active" ? toggleFullscreen : undefined}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setEnded(true)
              setPlaying(false)
            }}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || fallbackDuration)}
            onTimeUpdate={(e) => {
              if (mode === "active" && !playing) setTime(e.currentTarget.currentTime)
            }}
            onProgress={(e) => {
              const ranges = e.currentTarget.buffered
              if (ranges.length) setBufferedEnd(ranges.end(ranges.length - 1))
            }}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          >
            <source src={sources.mobile} type="video/mp4" media="(max-width: 767px)" />
            <source src={sources.desktop} type="video/mp4" />
          </video>

          {/* Preview: silent loop behind a single "watch with sound" call to action */}
          {mode === "preview" && (
            <button
              type="button"
              onClick={startFilm}
              aria-label={copy.play}
              className="group/cta absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-4 bg-gradient-to-t from-black/60 via-black/15 to-black/0 transition-colors duration-300 hover:from-black/70 focus-visible:outline-none"
            >
              <PlayDisc large />

            </button>
          )}

          {/* Paused mid-film */}
          {mode === "active" && !playing && !ended && !scrubbing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={t("resume")}
              className="group/cta absolute inset-0 z-10 grid cursor-pointer place-items-center bg-black/25 focus-visible:outline-none"
            >
              <PlayDisc />
            </button>
          )}

          {/* End card */}
          {mode === "active" && ended && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-[3px]">
              <Link
                href={ctaHref}
                className="group relative inline-flex h-12 items-center rounded-md bg-white pl-5 pr-14 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 sm:h-14 sm:text-base"
              >
                {ctaLabel}
                <span className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-sm bg-[#ff6f00] sm:size-12">
                  <img
                    src="/arrow.svg"
                    alt=""
                    className="size-4 brightness-0 invert transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </Link>
              <button
                type="button"
                onClick={startFilm}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <RotateCcw className="size-3.5" />
                {t("replay")}
              </button>
            </div>
          )}

          {/* Controls */}
          {mode === "active" && (
            <div
              onPointerEnter={revealControls}
              className={cn(
                "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-14 transition-opacity duration-300 sm:px-5 sm:pb-3",
                showControls ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-label={t("seek")}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(time)}
                aria-valuetext={`${formatTime(time)} / ${formatTime(duration)} · ${chapters[chapterIndex]}`}
                onPointerDown={onTrackPointerDown}
                onPointerMove={onTrackPointerMove}
                onPointerUp={() => setScrubbing(false)}
                onPointerCancel={() => setScrubbing(false)}
                onPointerLeave={() => setHover(null)}
                className="group/track relative flex h-5 cursor-pointer touch-none items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <div
                  className={cn(
                    "flex w-full gap-[3px] transition-[height] duration-200 group-hover/track:h-[6px]",
                    scrubbing ? "h-[6px]" : "h-[3px]",
                  )}
                >
                  {segments.map((segment, i) => (
                    <div
                      key={segment.start}
                      className={cn(
                        "relative h-full overflow-hidden rounded-full bg-white/20 transition-transform duration-200",
                        hover && chapterIndexAt(chapterStarts, hover.time) === i && "scale-y-[1.35]",
                      )}
                      style={{ flexGrow: segment.end - segment.start, flexBasis: 0 }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-white/25"
                        style={{ width: fillFor(segment.start, segment.end, bufferedEnd) }}
                      />
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{ width: fillFor(segment.start, segment.end, time), background: ACCENT }}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className={cn(
                    "pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,111,0,0.35)] transition-opacity duration-200 group-hover/track:opacity-100",
                    scrubbing ? "opacity-100" : "opacity-0",
                  )}
                  style={{ left: `${(time / duration) * 100}%` }}
                />
                {hover && (
                  <div
                    className="pointer-events-none absolute bottom-full mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
                    style={{ left: clamp(hover.x, 70, hover.width - 70) }}
                  >
                    {chapters[chapterIndexAt(chapterStarts, hover.time)]}
                    <span className="ml-2 text-white/50">{formatTime(hover.time)}</span>
                  </div>
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-0.5 sm:gap-1">
                <ControlButton label={playing ? t("pause") : t("resume")} onClick={togglePlay}>
                  {playing ? <Pause className="fill-current" strokeWidth={0} /> : <Play className="fill-current" strokeWidth={0} />}
                </ControlButton>
                <ControlButton label={muted ? t("unmute") : t("mute")} onClick={toggleMute}>
                  {muted ? <VolumeX /> : <Volume2 />}
                </ControlButton>
                <span className="ml-1.5 font-mono text-[11px] tabular-nums text-white/85">
                  {formatTime(time)}
                  <span className="text-white/40"> / {formatTime(duration)}</span>
                </span>
                <span className="ml-4 hidden truncate font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:block">
                  {String(chapterIndex + 1).padStart(2, "0")} — {chapters[chapterIndex]}
                </span>
                <div className="ml-auto">
                  <ControlButton label={fullscreen ? t("exitFullscreen") : t("fullscreen")} onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize2 /> : <Maximize2 />}
                  </ControlButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
