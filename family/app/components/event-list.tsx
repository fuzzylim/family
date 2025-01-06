'use client'

import { useState } from 'react'
import { CalendarIcon, MessageCircle, Heart, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockEvents = [
  { id: 1, name: 'Morning Walk', date: '2023-06-15', circle: 'Dog Walking', user: 'Alice', likes: 5, comments: 2, shares: 1 },
  { id: 2, name: 'Gymnastics Practice', date: '2023-06-16', circle: 'Gymnastics', user: 'Bob', likes: 3, comments: 1, shares: 0 },
  { id: 3, name: 'Golf Tournament', date: '2023-06-18', circle: 'Golf', subCircle: 'Sydney Golfers', user: 'Charlie', likes: 8, comments: 4, shares: 2 },
  { id: 4, name: 'Book Club Meeting', date: '2023-06-20', circle: 'Reading', user: 'David', likes: 6, comments: 3, shares: 1 },
]

export function EventList({ selectedCircle, selectedUser }) {
  const [events, setEvents] = useState(mockEvents)
  const [newEvent, setNewEvent] = useState({ name: '', date: '' })

  const filteredEvents = selectedCircle
    ? events.filter(event => 
        event.circle === selectedCircle.name || 
        (selectedCircle.parent === 'Golf' && event.circle === 'Golf' && event.subCircle === selectedCircle.name)
      )
    : events

  const addEvent = () => {
    if (newEvent.name && newEvent.date && selectedCircle) {
      setEvents([
        ...events, 
        { 
          ...newEvent, 
          id: Date.now(), 
          circle: selectedCircle.parent || selectedCircle.name,
          subCircle: selectedCircle.parent ? selectedCircle.name : undefined,
          user: selectedUser.name,
          likes: 0,
          comments: 0,
          shares: 0
        }
      ])
      setNewEvent({ name: '', date: '' })
    }
  }

  const isEditable = selectedUser.name === 'You'

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <ul className="space-y-4 mb-4">
        {filteredEvents.map((event) => (
          <li key={event.id} className="bg-accent rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${event.user}`} />
                <AvatarFallback>{event.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{event.user}</p>
                <p>{event.name}</p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {event.date}
                </p>
                {event.subCircle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    in {event.subCircle}
                  </p>
                )}
                <div className="flex space-x-4 mt-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="w-4 h-4 mr-1" />
                    {event.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {event.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Repeat2 className="w-4 h-4 mr-1" />
                    {event.shares}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isEditable && selectedCircle && (
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder="Event name"
          />
          <Input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Button onClick={addEvent}>Add Event</Button>
        </div>
      )}
    </div>
  )
}

