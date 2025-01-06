import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface InvitedUserStatusProps {
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  onAccept: () => void;
  onDecline: () => void;
}

export function InvitedUserStatus({ name, status, onAccept, onDecline }: InvitedUserStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Invited User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{name}</span>
            <Badge variant={status === 'accepted' ? 'success' : status === 'declined' ? 'destructive' : 'secondary'}>
              {status}
            </Badge>
          </div>
          {status === 'pending' && (
            <div className="space-x-2">
              <Button onClick={onAccept} variant="outline" size="sm">Accept</Button>
              <Button onClick={onDecline} variant="outline" size="sm">Decline</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

