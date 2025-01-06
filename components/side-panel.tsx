import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Interest, Circle } from '../types/interfaces';

interface SidePanelProps {
  interests: Interest[];
  circles: Circle[];
  selectedInterest: Interest | null;
  selectedCircle: Circle | null;
  onSelectInterest: (interest: Interest) => void;
  onSelectCircle: (circle: Circle) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = memo(({
  interests,
  circles,
  selectedInterest,
  selectedCircle,
  onSelectInterest,
  onSelectCircle,
  isOpen,
  onClose
}) => {
  const filteredCircles = useMemo(() => {
    return selectedInterest
      ? circles.filter(circle => circle.interestId === selectedInterest.id)
      : circles;
  }, [selectedInterest, circles]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-64 bg-background z-50 shadow-lg overflow-auto"
        >
          <div className="p-4">
            <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4">
              <X className="h-4 w-4" />
            </Button>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Interests & Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {interests.map((interest) => (
                    <motion.div
                      key={`interest-${interest.id}`}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                        selectedInterest?.id === interest.id ? 'bg-primary/10' : 'bg-muted'
                      }`}
                      onClick={() => onSelectInterest(interest)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{interest.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm">{interest.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {interest.progress} / {interest.goal}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Circles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredCircles.map((circle) => (
                    <motion.div
                      key={`circle-${circle.id}`}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                        selectedCircle?.id === circle.id ? 'bg-primary/10' : 'bg-muted'
                      }`}
                      onClick={() => onSelectCircle(circle)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{circle.icon}</span>
                        <h3 className="font-semibold text-sm">{circle.name}</h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SidePanel.displayName = 'SidePanel';

