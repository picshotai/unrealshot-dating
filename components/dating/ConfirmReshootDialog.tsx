'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const QUICK_ADJUSTMENT_CHIPS = [
  'Fix hand / limb placement',
  'Both hands in pockets',
  'Look away from camera',
  'Lean on surface / railing',
  'More relaxed posture',
];

export const ConfirmReshootDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (feedback?: string) => void;
  isRegenerating: boolean;
  reshootsRemaining: number;
  shootTitle?: string;
  frameIndex?: number;
}> = ({
  open,
  onOpenChange,
  onConfirm,
  isRegenerating,
  reshootsRemaining,
  shootTitle,
  frameIndex,
}) => {
  const none = reshootsRemaining <= 0;
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!open) {
      setFeedback('');
    }
  }, [open]);

  const hasFeedback = feedback.trim().length > 0;

  const handleChipClick = (chip: string) => {
    if (feedback.trim() === chip) {
      setFeedback('');
    } else {
      setFeedback(chip);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md p-6">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-white text-base font-semibold">
            {none ? 'You have used every Photo Retake' : 'Retake this photo?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-xs leading-relaxed">
            {none ? (
              <>This order has no Photo Retakes left, so this photo stays as it is.</>
            ) : (
              <>
                This replaces{' '}
                {shootTitle ? (
                  <span className="text-zinc-200">
                    frame {frameIndex} of {shootTitle}
                  </span>
                ) : (
                  'this photo'
                )}{' '}
                with a new take in the same place and clothes. Uses{' '}
                <span className="text-white font-medium">1 of your {reshootsRemaining}</span>{' '}
                remaining Photo Retakes.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!none && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-300 block mb-1.5">
                What should we adjust? <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK_ADJUSTMENT_CHIPS.map((chip) => {
                  const active = feedback.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-colors ${
                        active
                          ? 'bg-white/15 border-white/40 text-white font-medium'
                          : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, 160))}
                  placeholder="e.g. Both hands in pockets, don't rest hand on thigh, turn head slightly..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
                />
                <div className="text-right text-[10px] font-mono text-zinc-600 mt-1">
                  {feedback.length}/160
                </div>
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs h-9 mt-0">
            {none ? 'Close' : 'Keep this one'}
          </AlertDialogCancel>
          {!none && (
            <AlertDialogAction
              onClick={() => onConfirm(hasFeedback ? feedback.trim() : undefined)}
              disabled={isRegenerating}
              className="bg-white text-black hover:bg-zinc-200 text-xs h-9 font-medium"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Starting
                </>
              ) : hasFeedback ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Retake with adjustment
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Retake photo
                </>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

