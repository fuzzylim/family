'use client'

import { useState } from 'react'

const initialCircles = [
  { id: 1, name: 'Dog Walking' },
  { id: 2, name: 'Gymnastics Carpool' },
  { id: 3, name: 'Golf Events' },
]

export default function CircleList({ onSelectCircle }) {
  const [circles, setCircles] = useState(initialCircles)
  const [newCircleName, setNewCircleName] = useState('')

  const addCircle = () => {
    if (newCircleName) {
      setCircles([...circles, { id: Date.now(), name: newCircleName }])
      setNewCircleName('')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Circles</h2>
      <ul className="space-y-2">
        {circles.map((circle) => (
          <li
            key={circle.id}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => onSelectCircle(circle)}
          >
            {circle.name}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newCircleName}
          onChange={(e) => setNewCircleName(e.target.value)}
          placeholder="New circle name"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addCircle}
          className="mt-2 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Add Circle
        </button>
      </div>
    </div>
  )
}

