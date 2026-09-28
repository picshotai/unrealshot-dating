// lib/fonts.ts
import { Inter_Tight } from 'next/font/google';

// Configure the Inter Tight font
export const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});