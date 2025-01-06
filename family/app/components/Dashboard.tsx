'use client'

import { useState } from 'react'
import CircleList from './CircleList'
import EventList from './EventList'
import StatusUpdate from './StatusUpdate'
import Calendar from './Calendar'

export default function Dashboard() {
  const [selectedCircle, setSelectedCircle] = useState(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <CircleList onSelectCircle={setSelectedCircle} />
        <StatusUpdate circle={selectedCircle} />
      </div>
      <div className="md:col-span-2">
        <Calendar circle={selectedCircle} />
        <EventList circle={selectedCircle} />
      </div>
    </div>
  )
}

