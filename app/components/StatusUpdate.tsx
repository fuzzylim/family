'use client'

import { useState } from 'react'

export default function StatusUpdate({ circle }) {
  const [status, setStatus] = useState('')

  const updateStatus = () => {
    if (status && circle) {
      console.log(`Status updated for ${circle.name}: ${status}`)
      setStatus('')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Status Update</h2>
      {circle ? (
        <>
          <textarea
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder={`What's happening in ${circle.name}?`}
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          <button
            onClick={updateStatus}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Post Update
          </button>
        </>
      ) : (
        <p>Select a circle to post an update</p>
      )}
    </div>
  )
}

