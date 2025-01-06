'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

interface StatusUpdateProps {
  selectedCircle: Circle | null;
  selectedUser: User;
  className?: string;
}

export function StatusUpdate({ selectedCircle, selectedUser, className }: StatusUpdateProps) {
  const [status, setStatus] = useState('')
  const [posts, setPosts] = useState<Array<{ id: number; user: string; content: string; timestamp: string }>>([])

  const updateStatus = () => {
    if (status && selectedCircle) {
      const newPost = {
        id: Date.now(),
        user: selectedUser.name,
        content: status,
        timestamp: new Date().toISOString()
      }
      setPosts([newPost, ...posts])
      setStatus('')
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCircle ? (
          <>
            <div className="flex space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <Textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder={`What's happening in ${selectedCircle.name}?`}
                rows={3}
                className="flex-1"
              />
            </div>
            <Button onClick={updateStatus} disabled={!status.trim()}>
              Post Update
            </Button>
            <div className="mt-8 space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.user}`} />
                      <AvatarFallback>{post.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{post.user}</p>
                      <p>{post.content}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(post.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Select a circle to post an update</p>
        )}
      </CardContent>
    </Card>
  )
}

