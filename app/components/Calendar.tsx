'use client'

export default function Calendar({ circle }) {
  // This is a placeholder for the actual calendar implementation
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Calendar</h2>
      {circle ? (
        <p>Calendar view for {circle.name}</p>
      ) : (
        <p>Select a circle to view its calendar</p>
      )}
      {/* You would implement the actual calendar view here */}
    </div>
  )
}

