'use client';

import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
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

/**
 * Confirms a reshoot before it spends one.
 *
 * The reshoot button used to fire on the first tap. On a phone that is a real
 * problem: the tile's controls only appeared on hover, so on touch they were
 * invisible but still hit-testable — tapping a photo to enlarge it could land
 * on the reshoot button and silently spend a reshoot instead. The controls are
 * always visible on small screens now, and this dialog means even a deliberate
 * tap has to be confirmed.
 *
 * It names what is about to happen, because a reshoot is not free and is not
 * reversible: the old photograph is replaced, not kept alongside.
 */
export const ConfirmReshootDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-base font-semibold">
            {none ? 'You have used every reshoot' : 'Reshoot this photo?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-xs leading-relaxed">
            {none ? (
              <>This order has no reshoots left, so this photo stays as it is.</>
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
                with a new take in the same place and the same clothes. The
                current photo is lost, and it uses{' '}
                <span className="text-white font-medium">1 of your {reshootsRemaining}</span>{' '}
                remaining reshoots.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs h-9 mt-0">
            {none ? 'Close' : 'Keep this one'}
          </AlertDialogCancel>
          {!none && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isRegenerating}
              className="bg-white text-black hover:bg-zinc-200 text-xs h-9 font-medium"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Starting
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Reshoot it
                </>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
