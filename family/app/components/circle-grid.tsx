'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  id: number;
  name: string;
}

interface Circle {
  id: number;
  name: string;
  icon: string;
  streak: number;
  total: number;
  color: string;
}

interface CircleGridProps {
  circles: Circle[];
  selectedCircle: Circle | null;
  onSelectCircle: (circle: Circle) => void;
  selectedUser: User;
}

const golfCircles = [
  { id: 'golf-sydney', name: 'Sydney Golfers', icon: '⛳', color: 'bg-green-500' },
  { id: 'golf-worm', name: 'Worm Burners', icon: '🪱', color: 'bg-brown-500' },
  { id: 'golf-night', name: 'Night Owls', icon: '🦉', color: 'bg-purple-500' },
]

export function CircleGrid({ circles, selectedCircle, onSelectCircle, selectedUser }: CircleGridProps) {
  const [golfGoal, setGolfGoal] = useState({ current: 12, target: 20 })
  const [animatingCircle, setAnimatingCircle] = useState<number | null>(null)
  const circleRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (selectedCircle) {
      setAnimatingCircle(selectedCircle.id)
      const circleElements = circleRefs.current.filter(Boolean)
      if (circleElements.length > 0) {
        const selectedElement = circleElements.find(
          (el) => el?.dataset.circleId === selectedCircle.id.toString()
        )
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }
      setTimeout(() => setAnimatingCircle(null), 1000)
    }
  }, [selectedUser, selectedCircle])

  const isVisible = (circle: Circle) => {
    if (selectedUser.name === 'You') return true
    if (selectedUser.name === 'Family' && ['Dog Walking', 'Reading'].includes(circle.name)) return true
    if (selectedUser.name === 'Friends' && ['Golf'].includes(circle.name)) return true
    if (selectedUser.name === 'Coworkers' && ['Reading'].includes(circle.name)) return true
    return false
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatePresence>
          {circles.filter(isVisible).map((circle, index) => (
            <motion.button
              key={circle.id}
              ref={(el) => (circleRefs.current[index] = el)}
              data-circle-id={circle.id}
              className={cn(
                "p-4 rounded-lg text-white flex flex-col items-center justify-center aspect-square transition-all",
                circle.color,
                selectedCircle?.id === circle.id ? "ring-4 ring-offset-2 ring-offset-background ring-primary" : ""
              )}
              onClick={() => onSelectCircle(circle)}
              initial={animatingCircle === circle.id ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={animatingCircle === circle.id ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-4xl mb-2">{circle.icon}</span>
              <span className="font-semibold text-sm">{circle.name}</span>
              <span className="text-xs opacity-80">Streak: {circle.streak}</span>
              <span className="text-xs opacity-80">Total: {circle.total}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      {selectedCircle?.name === 'Golf' && (
        <div className="bg-card text-card-foreground rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Golf Goal Progress</h3>
          <Progress value={(golfGoal.current / golfGoal.target) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {golfGoal.current} / {golfGoal.target} games played
          </p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {golfCircles.map((subCircle) => (
              <button
                key={subCircle.id}
                className={cn(
                  "p-2 rounded-lg text-white flex flex-col items-center justify-center",
                  subCircle.color
                )}
                onClick={() => onSelectCircle({ ...subCircle, parent: 'Golf' } as unknown as Circle)}
              >
                <span className="text-2xl mb-1">{subCircle.icon}</span>
                <span className="font-semibold text-xs">{subCircle.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

