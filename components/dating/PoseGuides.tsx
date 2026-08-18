/**
 * Pose guides for the reference-photo upload step.
 *
 * Seedream's edit model anchors composition to the references it is given, so a
 * set of six arm's-length selfies produces six tightly cropped outputs whatever
 * the prompt asks for. Showing the five poses we actually want — two angles, a
 * front, a half body and a full body — gets a reference set with real variation
 * in distance and head turn, which is what lets the library's framing direction
 * take effect.
 */

import type { ReactElement } from 'react';

type PoseGuideProps = { className?: string };

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Head-and-shoulders, squared to camera. */
function FrontPose({ className }: PoseGuideProps) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden="true">
      <g {...STROKE}>
        <ellipse cx="24" cy="22" rx="11" ry="13" />
        <path d="M13 20a2.4 2.4 0 0 0 0 5M35 20a2.4 2.4 0 0 1 0 5" />
        <path d="M19.5 20h2.5M26 20h2.5" />
        <path d="M24 23v3.5" />
        <path d="M21 30.5c1.8 1.2 4.2 1.2 6 0" />
        <path d="M6 60c2-10 9-15.5 18-15.5S40 50 42 60" />
        <path d="M24 35v9" />
      </g>
    </svg>
  );
}

/** Head turned roughly 45 degrees; far ear hidden, both eyes still readable. */
function ThreeQuarterPose({
  className,
  flip = false,
}: PoseGuideProps & { flip?: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden="true">
      <g
        {...STROKE}
        transform={flip ? 'translate(48 0) scale(-1 1)' : undefined}
      >
        <path d="M31 12.5c4 3 5.5 7 5.2 11.4-.4 6.4-4.8 11.1-10.8 11.1-6.4 0-11.4-5.2-11.4-12.2 0-6.6 4.6-12 11.2-12 2.2 0 4.1.6 5.8 1.7Z" />
        <path d="M15 21a2.4 2.4 0 0 0 0 5" />
        <path d="M19 21h2.2M26.5 21h2.4" />
        <path d="M23.5 24c1.6 1 2.6 1.9 2.6 2.8 0 .7-.7 1.1-2 1.2" />
        <path d="M21 31.2c1.7 1 3.7 1 5.2.1" />
        <path d="M7 60c1.8-9.6 8.4-15.5 17-15.5 8.8 0 15.4 5.9 17 15.5" />
        <path d="M24.5 35v9" />
      </g>
    </svg>
  );
}

/** Waist-up, arms readable. */
function HalfBodyPose({ className }: PoseGuideProps) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden="true">
      <g {...STROKE}>
        <circle cx="24" cy="13" r="7.5" />
        <path d="M24 20.5v6" />
        <path d="M13 60V34.5C13 29.8 17.9 26.5 24 26.5s11 3.3 11 8V60" />
        <path d="M13 35 8.5 52M35 35l4.5 17" />
        <path d="M24 26.5V60" opacity="0.35" />
      </g>
    </svg>
  );
}

/** Standing, head to feet, with space around him. */
function FullBodyPose({ className }: PoseGuideProps) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden="true">
      <g {...STROKE}>
        <circle cx="24" cy="9" r="5" />
        <path d="M24 14v4" />
        <path d="M17 20.5c0-1.6 3.1-2.5 7-2.5s7 .9 7 2.5v13.5H17Z" />
        <path d="M17 21.5 13 35M31 21.5 35 35" />
        <path d="M19.5 34v10.5L18 58M28.5 34v10.5L30 58" />
        <path d="M15.5 58.5h5M27.5 58.5h5" />
      </g>
    </svg>
  );
}

export type PoseGuide = {
  key: string;
  label: string;
  hint: string;
  Icon: (props: PoseGuideProps) => ReactElement;
};

export const POSE_GUIDES: PoseGuide[] = [
  {
    key: 'front',
    label: 'Front',
    hint: 'Straight to camera',
    Icon: FrontPose,
  },
  {
    key: 'angle-left',
    label: '45° left',
    hint: 'Turned, still both eyes',
    Icon: (props) => <ThreeQuarterPose {...props} />,
  },
  {
    key: 'angle-right',
    label: '45° right',
    hint: 'Turned, still both eyes',
    Icon: (props) => <ThreeQuarterPose {...props} flip />,
  },
  {
    key: 'half-body',
    label: 'Half body',
    hint: 'Waist up, arms visible',
    Icon: HalfBodyPose,
  },
  {
    key: 'full-body',
    label: 'Full body',
    hint: 'Head to feet',
    Icon: FullBodyPose,
  },
];
