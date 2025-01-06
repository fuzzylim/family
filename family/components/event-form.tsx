import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Circle, Event } from '../types/interfaces';

interface EventFormProps {
  circles: Circle[];
  onSubmit: (event: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ circles, onSubmit, onCancel }) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    circleId: 0,
    isRecurring: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: eventData.name,
      date: `${eventData.date}T${eventData.time}`,
      circleId: eventData.circleId,
      location: eventData.location,
      description: eventData.description,
      isRecurring: eventData.isRecurring,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={eventData.time}
            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={eventData.location}
          onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={eventData.description}
          onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="circle">Circle</Label>
        <Select
          value={eventData.circleId.toString()}
          onValueChange={(value) => setEventData({ ...eventData, circleId: parseInt(value, 10) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a circle" />
          </SelectTrigger>
          <SelectContent>
            {circles.map((circle) => (
              <SelectItem key={circle.id} value={circle.id.toString()}>
                {circle.icon} {circle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={eventData.isRecurring}
          onCheckedChange={(checked) => setEventData({ ...eventData, isRecurring: checked })}
        />
        <Label htmlFor="recurring">Recurring Event</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
};

