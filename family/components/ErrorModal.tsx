import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: Error | null;
}

const BREATH_DURATION = 4000; // 4 seconds for each inhale/exhale
const TOTAL_BREATHS = 5; // Number of breaths before auto-dismissal

const calmingColors = [
  'rgb(173, 216, 230)', // Light Blue
  'rgb(152, 251, 152)', // Pale Green
  'rgb(255, 218, 185)', // Peach
  'rgb(230, 230, 250)', // Lavender
  'rgb(255, 255, 224)', // Light Yellow
];

export function ErrorModal({ isOpen, onClose, error }: ErrorModalProps) {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(BREATH_DURATION / 1000);
  const [breathCount, setBreathCount] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const advanceBreath = useCallback(() => {
    setBreathCount((prev) => {
      if (prev + 1 >= TOTAL_BREATHS) {
        onClose();
        return 0;
      }
      return prev + 1;
    });
    setColorIndex((prev) => (prev + 1) % calmingColors.length);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            setBreathPhase((phase) => {
              if (phase === 'exhale') {
                advanceBreath();
              }
              return phase === 'inhale' ? 'exhale' : 'inhale';
            });
            return BREATH_DURATION / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, advanceBreath]);

  const message = error
    ? error.message
    : "Take a moment to breathe and reflect. You're doing great!";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-transparent border-none shadow-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={colorIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="rounded-lg p-6"
            style={{ backgroundColor: calmingColors[colorIndex] }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold mb-2 text-gray-800">
                {error ? "Take a Breath" : "Mindful Moment"}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {error ? "Let's pause and recenter." : "A moment of calm in your day."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              <motion.div
                animate={{
                  scale: breathPhase === 'inhale' ? 1.2 : 0.8,
                  transition: { duration: BREATH_DURATION / 1000, ease: "easeInOut" }
                }}
                className="w-32 h-32 rounded-full bg-white/50 flex items-center justify-center text-gray-800 shadow-lg"
              >
                <span className="text-4xl font-bold">{countdown}</span>
              </motion.div>
              <p className="mt-4 text-center text-xl font-medium text-gray-800">
                {breathPhase === 'inhale' ? 'Breathe in...' : 'Breathe out...'}
              </p>
              <p className="mt-2 text-center text-gray-600">
                Breath {breathCount + 1} of {TOTAL_BREATHS}
              </p>
              <p className="mt-4 text-center text-gray-700">{message}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={onClose} variant="outline" className="bg-white/50 hover:bg-white/75 text-gray-800">
                Close
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

