'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface Interest {
  id: number;
  name: string;
  icon: string;
  goal: number;
  progress: number;
}

interface Circle {
  id: number;
  name: string;
  icon: string;
  interestId: number;
}

interface CircleListProps {
  circles: Circle[];
  selectedInterest: Interest | null;
  selectedCircle: Circle | null;
  onSelectCircle: (circle: Circle) => void;
  className?: string;
}

export function CircleList({ circles, selectedInterest, selectedCircle, onSelectCircle, className }: CircleListProps) {
  const filteredCircles = selectedInterest
    ? circles.filter(circle => circle.interestId === selectedInterest.id)
    : circles;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Circles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredCircles.map((circle) => (
            <motion.div
              key={circle.id}
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
  )
}

