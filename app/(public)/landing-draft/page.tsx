'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * DRAFT — bento dashboard landing for the dating shoot.
 *
 * Every figure rendered here is read from the real system:
 *   15 shoots x 4 frames = 60   (lib/dating/shoots.ts)
 *   wardrobe lean 65 / 20 / 15  (lib/dating/interests.ts)
 *   5 lineup roles              (lib/dating/roles.ts)
 *   22 interests, max 3 shoots  (lib/dating/select-shoots.ts)
 *   4 exclusions, 15 Photo Retakes  (lib/dating/types.ts)
 * No placeholder imagery — every visual is SVG or CSS.
 * ------------------------------------------------------------------ */

const ACCENT = '#CCFF00';

const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-[#141416] border border-[#242427] p-6 flex flex-col relative overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#5a5a5c]">
    {children}
  </p>
);

/* --- Light dial: the analogue of a world clock, for light direction --- */
const LightDial = ({
  name,
  sublabel,
  angle,
  strength,
  delay,
}: {
  name: string;
  sublabel: string;
  angle: number;
  strength: 1 | 2 | 3 | 4;
  delay: number;
}) => {
  // Rounded to whole pixels and applied as offsets rather than a transform
  // string: a full-precision float renders differently on server and client
  // and trips React's hydration check.
  const dx = Math.round(Math.cos((angle - 90) * (Math.PI / 180)) * 16);
  const dy = Math.round(Math.sin((angle - 90) * (Math.PI / 180)) * 16);

  return (
  <div className="flex flex-col items-center">
    <h3 className="text-[13px] font-medium mb-1 text-[#e8e8e8]">{name}</h3>
    <p className="font-mono text-[9px] text-[#5a5a5c] mb-4 tracking-wider">
      {angle}&deg;
    </p>

    <div className="relative w-20 h-20 rounded-full bg-[#1b1b1e] border border-[#242427] mb-4 flex items-center justify-center">
      {/* directional glow — where the light is coming from */}
      <motion.div
        className="absolute w-14 h-14 rounded-full blur-[14px]"
        style={{
          backgroundColor: ACCENT,
          left: `calc(50% - 28px + ${dx}px)`,
          top: `calc(50% - 28px + ${dy}px)`,
        }}
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, delay }}
      />

      {/* tick marks */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div
            className={`w-[1px] ${
              i % 3 === 0 ? 'h-1.5 bg-[#5a5a5c]' : 'h-1 bg-[#2f2f32]'
            } mx-auto mt-1`}
          />
        </div>
      ))}

      {/* the key-light needle */}
      <motion.div
        className="absolute w-[1.5px] h-9 origin-bottom rounded-full"
        style={{ bottom: '50%', background: ACCENT }}
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: angle, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14, delay }}
      />
      <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
    </div>

    {/* hardness meter */}
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="w-1 h-1 rounded-full"
          style={{
            background: n <= strength ? ACCENT : 'transparent',
            border: n <= strength ? 'none' : '1px solid #2f2f32',
          }}
        />
      ))}
    </div>
    <p className="text-[10px] text-[#8a8a8e] text-center leading-tight">
      {sublabel}
    </p>
  </div>
  );
};

/* --- Wardrobe donut --- */
const CIRC = 2 * Math.PI * 36;

const Donut = () => {
  const segments = [
    { label: 'Casual', pct: 0.65, color: ACCENT, start: 0 },
    { label: 'Sharp', pct: 0.2, color: '#e8e8e8', start: 0.65 },
    { label: 'Street', pct: 0.15, color: '#5a5a5c', start: 0.85 },
  ];

  return (
    <>
      <div className="relative w-[168px] h-[168px] mx-auto my-2">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="transparent"
            stroke="#1e1e21"
            strokeWidth="18"
          />
          {segments.map((s) => (
            <motion.circle
              key={s.label}
              cx="50"
              cy="50"
              r="36"
              fill="transparent"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - s.pct) }}
              transition={{ duration: 1.4, delay: 0.2 + s.start, ease: 'easeOut' }}
              style={{
                rotate: `${s.start * 360}deg`,
                transformOrigin: 'center',
              }}
            />
          ))}
          <circle cx="50" cy="50" r="22" fill="#141416" />
        </svg>
      </div>

      <div className="flex justify-between w-full px-1">
        {segments.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="text-2xl font-semibold mb-1 tracking-tight">
              {Math.round(s.pct * 100)}%
            </span>
            <span className="text-[11px] text-[#8a8a8e] mb-2">{s.label}</span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: s.color }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

/* --- 60 cells in 15 groups of four, one group per shoot --- */
const ROLE_TONES = [
  ACCENT,
  '#e8e8e8',
  '#7f8f4a',
  '#5a5a5c',
  '#a8bf3c',
];

const PhotoGrid = () => (
  // Grouped in fours, because the group is the point: one place, one outfit,
  // one light, four frames of it. A flat wall of cells says the opposite.
  <div className="grid grid-cols-5 gap-[7px]">
    {[...Array(15)].map((_, shoot) => (
      <div key={shoot} className="grid grid-cols-2 gap-[3px]">
        {[...Array(4)].map((_, frame) => {
          const i = shoot * 4 + frame;
          const tone = ROLE_TONES[shoot % 5];
          const dim = 0.4 + ((i * 37) % 50) / 100;
          return (
            <motion.div
              key={frame}
              className="aspect-square"
              style={{ background: tone, opacity: dim }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: dim, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.012 }}
              whileHover={{ opacity: 1, scale: 1.35, zIndex: 10 }}
            />
          );
        })}
      </div>
    ))}
  </div>
);

/* --- The lineup, as a stacked bar --- */
const LINEUP = [
  { role: 'Your opener', note: 'Decides the swipe', weight: 100 },
  { role: 'Your full body', note: 'Every app asks for it', weight: 84 },
  { role: 'What you do', note: 'Your actual hobbies', weight: 72 },
  { role: 'Out in the world', note: 'Somewhere real', weight: 64 },
  { role: 'The rest', note: 'Profile depth', weight: 52 },
];

const INTERESTS = [
  'Gym', 'Running', 'Hiking', 'Climbing',
  'Cycling', 'Dogs', 'Coffee', 'Going out',
  'Cooking', 'Reading', 'Music', 'Travel',
  'Football', 'Motorcycles', 'Art', 'Surf',
];

const ACTIVE = new Set(['Gym', 'Coffee', 'Travel', 'Motorcycles']);

export default function LandingDraft() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* top bar */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg font-bold uppercase tracking-tight">
            UnrealShot AI
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5a5a5c] hidden sm:block">
            Draft layout
          </span>
        </div>
        <Link
          href="/login"
          className="font-mono text-[10px] uppercase tracking-[0.15em] border border-[#2f2f32] px-4 py-2 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
        >
          Start shoot
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-[4px]">
        {/* ---------------- ROW 1 ---------------- */}

        {/* 1. Hero */}
        <Card className="lg:col-span-4 min-h-[420px] justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 border border-[#CCFF00]/40 bg-[#CCFF00]/5 px-2.5 py-1 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#CCFF00]">
                Built for dating apps
              </span>
            </div>

            <h1 className="font-display text-[44px] leading-[0.92] font-bold uppercase tracking-tight mb-5">
              15 shoots.
              <br />
              <span className="text-[#CCFF00]">60 photos.</span>
            </h1>

            <p className="font-mono text-[12px] leading-relaxed text-[#8a8a8e] max-w-xs">
              Upload 4&ndash;6 selfies. Get fifteen separate shoots back &mdash;
              each one a different place, a different outfit and a different
              light, photographed four ways.
            </p>
          </div>

          {/* Fanned stack of frames. Decorative only, and hidden below lg —
              on a narrow hero it lands on top of the paragraph. */}
          <div className="hidden lg:block absolute right-4 top-[44%] w-44 h-48 pointer-events-none z-0">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 rounded-full blur-[50px] opacity-25"
              style={{ backgroundColor: ACCENT }}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-20 h-28 border"
                style={{
                  borderColor: i === 4 ? ACCENT : '#2f2f32',
                  backgroundColor: i === 4 ? 'rgba(204,255,0,0.05)' : '#18181b',
                  marginLeft: -40,
                  marginTop: -56,
                  rotate: `${-16 + i * 8}deg`,
                  zIndex: i,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.09 }}
              />
            ))}
          </div>

          <div className="relative z-10 mt-8">
            <Link href="/login" className="block w-full max-w-[260px]">
              <button className="w-full bg-[#CCFF00] text-black font-display text-lg uppercase font-bold py-4 px-6 flex items-center justify-between group hover:bg-white transition-colors">
                <span>Get my 60 photos</span>
                <span className="font-mono text-xs group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </button>
            </Link>
          </div>
        </Card>

        {/* 2. Wardrobe mix */}
        <Card className="lg:col-span-3 items-center">
          <div className="text-center w-full mb-2">
            <h2 className="text-[15px] font-semibold mb-1">Wardrobe mix</h2>
            <p className="text-[12px] text-[#8a8a8e]">
              You pick the lead. All three ship.
            </p>
          </div>
          <Donut />
          <p className="font-mono text-[9px] text-[#5a5a5c] mt-5 text-center leading-relaxed">
            Sixty photos in one register reads flat.
            <br />
            The range is the product.
          </p>
        </Card>

        {/* 3. Light dials */}
        <Card className="lg:col-span-5 justify-between">
          <div className="flex items-start justify-between mb-2">
            <CardLabel>Key light &middot; direction &amp; hardness</CardLabel>
            <CardLabel>156 setups</CardLabel>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-4">
            <LightDial
              name="Golden hour"
              sublabel="Low sun, long shadows"
              angle={205}
              strength={2}
              delay={0.2}
            />
            <LightDial
              name="Window light"
              sublabel="Soft, wrapping, close"
              angle={310}
              strength={1}
              delay={0.4}
            />
            <LightDial
              name="Night flash"
              sublabel="Hard, frontal, on-camera"
              angle={95}
              strength={4}
              delay={0.6}
            />
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="border border-[#2f2f32] rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a8e] mb-3">
              No two photos share one
            </div>
            <h2 className="text-2xl font-medium tracking-tight">
              Light, written per shot
            </h2>
          </div>
        </Card>

        {/* ---------------- ROW 2 ---------------- */}

        {/* 4. The 60 */}
        <Card className="lg:col-span-3 justify-between">
          <div>
            <PhotoGrid />
            <p className="text-[13px] text-[#e5e5e5] mt-4">
              One block, one shoot
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-baseline">
              <span className="text-[56px] font-bold tracking-tighter leading-none">
                15
              </span>
              <span className="text-xl text-[#8a8a8e] ml-2">&times;4</span>
            </div>
            <p className="text-[14px] text-[#8a8a8e] mt-1">
              places, outfits and lights &mdash; four frames each
            </p>
          </div>
        </Card>

        {/* 5. Lineup */}
        <Card className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-[15px] font-semibold mb-1">
              Your profile, sorted
            </h2>
            <p className="text-[12px] text-[#8a8a8e]">
              Delivered in the slots apps ask you to fill
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-1 justify-center">
            {LINEUP.map((l, i) => (
              <div key={l.role}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[12px] text-[#e8e8e8]">{l.role}</span>
                  <span className="font-mono text-[9px] text-[#5a5a5c]">
                    0{i + 1}
                  </span>
                </div>
                <div className="h-[6px] bg-[#1e1e21] w-full">
                  <motion.div
                    className="h-full"
                    style={{
                      background: i === 0 ? ACCENT : '#3f3f43',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${l.weight}%` }}
                    transition={{
                      duration: 0.9,
                      delay: 0.3 + i * 0.12,
                      ease: 'easeOut',
                    }}
                  />
                </div>
                <p className="font-mono text-[9px] text-[#5a5a5c] mt-1">
                  {l.note}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. Interests */}
        <Card className="lg:col-span-4 justify-between">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                What you actually do
              </h2>
              <p className="text-[12px] text-[#8a8a8e]">
                Pick as many as are true. We deal them out.
              </p>
            </div>
            <CardLabel>16</CardLabel>
          </div>

          <div className="grid grid-cols-4 gap-[3px] flex-1 content-center">
            {INTERESTS.map((chip, i) => {
              const on = ACTIVE.has(chip);
              return (
                <motion.div
                  key={chip}
                  className="border px-2 py-3 text-center"
                  style={{
                    borderColor: on ? ACCENT : '#242427',
                    background: on ? 'rgba(204,255,0,0.07)' : 'transparent',
                    color: on ? ACCENT : '#6a6a6e',
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.03 }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    {chip}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <p className="font-mono text-[9px] text-[#5a5a5c] mt-5 leading-relaxed">
            Capped at 3 shoots per interest &mdash; so one hobby never takes
            over your profile.
          </p>
        </Card>

        {/* 7. Price */}
        <Card className="lg:col-span-2 justify-between">
          <div>
            <CardLabel>One payment</CardLabel>
            <div className="flex items-baseline mt-4">
              <span className="text-[52px] font-bold tracking-tighter leading-none">
                $39
              </span>
            </div>
            <p className="text-[12px] text-[#8a8a8e] mt-1">
              No subscription
            </p>
          </div>

          {/* Photo Retakes meter */}
          <div className="my-8">
            <CardLabel>Free Photo Retakes</CardLabel>
            <div className="flex flex-col gap-[3px] mt-3 w-14">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-3"
                  style={{ background: i < 5 ? ACCENT : '#242427' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                />
              ))}
            </div>
            <p className="text-[28px] font-bold tracking-tight mt-3 leading-none">
              15
            </p>
            <p className="font-mono text-[9px] text-[#5a5a5c] mt-1">
              Hate one? Replace it.
            </p>
          </div>

          <p className="font-mono text-[9px] text-[#5a5a5c] leading-relaxed">
            7-day money-back guarantee
          </p>
        </Card>

        {/* ---------------- ROW 3 ---------------- */}

        <Card className="lg:col-span-12 flex-row items-center justify-between flex-wrap gap-8">
          <div className="flex items-center gap-10 flex-wrap">
            <div>
              <CardLabel>Leave out</CardLabel>
              <div className="flex gap-[3px] mt-3">
                {['Drinks', 'Dogs', 'Bikes', 'Team sport'].map((x) => (
                  <span
                    key={x}
                    className="font-mono text-[10px] uppercase tracking-wider border border-[#242427] text-[#6a6a6e] px-3 py-2"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-12 w-[1px] bg-[#242427] hidden md:block" />

            <div>
              <CardLabel>You in every frame</CardLabel>
              <p className="text-[15px] text-[#e8e8e8] mt-3 max-w-sm leading-snug">
                One person in every photo. No filler crowds, no strangers
                standing around behind you.
              </p>
            </div>
          </div>

          <Link href="/login">
            <button className="bg-[#CCFF00] text-black font-display text-base uppercase font-bold py-4 px-8 hover:bg-white transition-colors">
              Start your shoot &rarr;
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
