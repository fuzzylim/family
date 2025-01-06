'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface User {
  id: number;
  name: string;
  image: string;
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

export function CircleGrid({ circles, selectedCircle, onSelectCircle, selectedUser }: CircleGridProps) {
  const isVisible = (circle: Circle) => {
    if (selectedUser.name === 'You') return true
    if (selectedUser.name === 'Family' && ['Dog Walking', 'Reading'].includes(circle.name)) return true
    if (selectedUser.name === 'Friends' && ['Golf'].includes(circle.name)) return true
    if (selectedUser.name === 'Coworkers' && ['Reading'].includes(circle.name)) return true
    return false
  }

  return (
    <>
      {circles.filter(isVisible).map((circle) => (
        <motion.div
          key={`circle-${circle.id}`}
          className={cn(
            "rounded-xl p-4 text-white flex flex-col items-center justify-center aspect-square transition-all cursor-pointer",
            circle.color,
            selectedCircle?.id === circle.id ? "ring-4 ring-offset-2 ring-offset-background ring-primary" : ""
          )}
          onClick={() => onSelectCircle(circle)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl mb-2">{circle.icon}</span>
          <span className="font-semibold text-sm">{circle.name}</span>
          <span className="text-xs opacity-80">Streak: {circle.streak}</span>
          <span className="text-xs opacity-80">Total: {circle.total}</span>
        </motion.div>
      ))}
    </>
  )
}

