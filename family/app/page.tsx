import { AppProvider } from '../contexts/AppContext'
import { CalendarView } from '@/components/calendar-view'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <main className="min-h-screen bg-background">
          <CalendarView />
        </main>
      </ErrorBoundary>
    </AppProvider>
  )
}

