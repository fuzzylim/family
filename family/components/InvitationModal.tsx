import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Invitation } from '../types/interfaces'

interface InvitationModalProps {
  isOpen: boolean
  onClose: () => void
  invitation: Invitation
  onAccept: () => void
  onDecline: () => void
}

export function InvitationModal({ isOpen, onClose, invitation, onAccept, onDecline }: InvitationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You've Been Invited!</DialogTitle>
          <DialogDescription>
            {invitation.invitedBy.name} has invited you to join their circle.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-lg font-semibold">Circle Details:</p>
          <p>{invitation.circle.icon} {invitation.circle.name}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onDecline}>Decline</Button>
          <Button onClick={onAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

