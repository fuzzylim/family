import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarGroupProps {
  avatars: {
    name: string
    image?: string
  }[]
  max?: number
}

export function AvatarGroup({ avatars, max = 4 }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(avatars.length - max, 0)

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, i) => (
        <Avatar key={i} className="ring-2 ring-background">
          {avatar.image ? (
            <AvatarImage src={avatar.image} alt={avatar.name} />
          ) : (
            <AvatarFallback>{avatar.name[0]}</AvatarFallback>
          )}
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className="ring-2 ring-background">
          <AvatarFallback>+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

