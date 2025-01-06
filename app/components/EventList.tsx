'use client'

import { useState } from 'react'

const initialEvents = [
  { id: 1, name: 'Morning Walk', date: '2023-06-15', circle: 'Dog Walking' },
  { id: 2, name: 'Gymnastics Practice', date: '2023-06-16', circle: 'Gymnastics Carpool' },
  { id: 3, name: 'Golf Tournament', date: '2023-06-18', circle: 'Golf Events' },
]

export default function EventList({ circle }) {
  const [events, setEvents] = useState(initialEvents)
  const [newEvent, setNewEvent] = useState({ name: '', date: '' })

  const filteredEvents = circle ? events.filter(event => event.circle === circle.name) : events

  const addEvent = () => {
    if (newEvent.name && newEvent.date && circle) {
      setEvents([...events, { ...newEvent, id: Date.now(), circle: circle.name }])
      setNewEvent({ name: '', date: '' })
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <ul className="space-y-2">
        {filteredEvents.map((event) => (
          <li key={event.id} className="flex justify-between items-center">
            <span>{event.name}</span>
            <span className="text-gray-500">{event.date}</span>
          </li>
        ))}
      </ul>
      {circle && (
        <div className="mt-4">
          <input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder="Event name"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={addEvent}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Add Event
          </button>
        </div>
      )}
    </div>
  )
}

