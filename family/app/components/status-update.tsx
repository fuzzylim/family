'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function StatusUpdate({ selectedCircle, selectedUser }) {
  const [status, setStatus] = useState('')
  const [posts, setPosts] = useState([])

  const updateStatus = () => {
    if (status && selectedCircle) {
      const newPost = {
        id: Date.now(),
        user: selectedUser.name,
        content: status,
        circle: selectedCircle.parent || selectedCircle.name,
        subCircle: selectedCircle.parent ? selectedCircle.name : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString()
      }
      setPosts([newPost, ...posts])
      setStatus('')
    }
  }

  const isEditable = selectedUser.name === 'You'

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Updates</h2>
      {selectedCircle ? (
        <>
          <div className="flex space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedUser.name}`} />
              <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
            </Avatar>
            <Textarea
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder={`What's happening in ${selectedCircle.name}?`}
              rows={3}
              className="flex-1"
              disabled={!isEditable}
            />
          </div>
          <Button onClick={updateStatus} disabled={!isEditable || !status.trim()}>
            Post Update
          </Button>
          <div className="mt-8 space-y-4">
            {posts.filter(post => post.circle === selectedCircle.name || 
              (selectedCircle.parent === 'Golf' && post.circle === 'Golf' && post.subCircle === selectedCircle.name))
              .map(post => (
              <div key={post.id} className="bg-accent rounded-lg p-4">
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
                    {post.subCircle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        in {post.subCircle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Select a circle to post an update</p>
      )}
    </div>
  )
}

