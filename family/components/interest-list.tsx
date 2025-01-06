'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronRight } from 'lucide-react'

interface Interest {
  id: number;
  name: string;
  icon: string;
  goal: number;
  progress: number;
}

interface InterestListProps {
  interests: Interest[];
  selectedInterest: Interest | null;
  onSelectInterest: (interest: Interest) => void;
  className?: string;
}

export function InterestList({ interests, selectedInterest, onSelectInterest, className }: InterestListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Interests & Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {interests.map((interest) => (
            <motion.div
              key={interest.id}
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
  )
}

