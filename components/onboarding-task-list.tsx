'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Task {
  title: string;
  completed: boolean;
  description: string;
  tip: string;
}

interface OnboardingTaskListProps {
  tasks: Task[];
  currentStep: number;
}

export function OnboardingTaskList({ tasks, currentStep }: OnboardingTaskListProps) {
  return (
    <TooltipProvider>
      <motion.div
        className="fixed top-0 left-0 right-0 bg-background border-b p-4 overflow-x-auto whitespace-nowrap"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ul className="flex space-x-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex items-center space-x-2 ${
                index === currentStep ? 'text-primary' : index < currentStep ? 'text-muted-foreground' : ''
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
              <span>{task.title}</span>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{task.description}</p>
                  <p className="mt-2 font-bold">Tip: {task.tip}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </motion.div>
    </TooltipProvider>
  )
}

