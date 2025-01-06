'use client'

import React, { useMemo } from 'react';
import { CalendarIcon, MessageCircle, Heart, Repeat2, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AvatarGroup } from '@/components/ui/avatar-group';
import { User, Circle, Interest, Event } from '../types/interfaces';
import { EventForm } from './event-form';

interface EventListProps {
  selectedCircle: Circle | null;
  selectedUser: User | null;
  circles: Circle[];
  interests: Interest[];
  events: Event[];
  users: User[];
  promoteToMember: (eventId: number, userId: number) => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>) => void;
}

export const EventList: React.FC<EventListProps> = ({ 
  selectedCircle, 
  selectedUser, 
  circles, 
  interests, 
  events, 
  users, 
  promoteToMember,
  onCreateEvent
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredEvents = useMemo(() => {
    if (!selectedUser) return [];
    return selectedCircle
      ? events.filter(event => event.circleId === selectedCircle.id)
      : events.filter(event => 
          circles.some(circle => circle.id === event.circleId && circle.members.includes(selectedUser.id)) ||
          event.participants.includes(selectedUser.id) || 
          event.invited.includes(selectedUser.id)
        );
  }, [selectedCircle, selectedUser, events, circles]);

  const handleCreateEvent = async (newEvent: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>) => {
    await onCreateEvent(newEvent);
    setIsDialogOpen(false);
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex justify-between items-center">
          <CardTitle>Events</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventForm 
                circles={circles} 
                onSubmit={handleCreateEvent}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <ul className="space-y-4">
          {filteredEvents.map((event) => (
            <li key={`event-${event.id}`} className="bg-muted rounded-lg p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={users.find(u => u.id === event.organizer)?.image} />
                      <AvatarFallback>{users.find(u => u.id === event.organizer)?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {event.invited && event.invited.includes(selectedUser.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => promoteToMember(event.id, selectedUser.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      {event.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {event.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Repeat2 className="h-4 w-4 mr-1" />
                      {event.shares}
                    </Button>
                  </div>
                  <AvatarGroup
                    avatars={event.participants.map((participantId) => {
                      const participant = users.find(u => u.id === participantId);
                      return participant ? {
                        name: participant.name,
                        image: participant.image
                      } : null;
                    }).filter((avatar): avatar is NonNullable<typeof avatar> => avatar !== null)}
                    max={3}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

