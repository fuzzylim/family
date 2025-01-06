"use client";
import React, { createContext, useContext, useState } from 'react';
import { User, Circle, Interest, Event, Invitation } from '../types/interfaces';
import { mockUsers, mockCircles, mockInterests, mockEvents, mockInvitations } from '../utils/mockData';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  circles: Circle[];
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
  interests: Interest[];
  setInterests: React.Dispatch<React.SetStateAction<Interest[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  invitations: Record<number, Invitation>;
  setInvitations: React.Dispatch<React.SetStateAction<Record<number, Invitation>>>;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const queryClient = new QueryClient();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [circles, setCircles] = useState<Circle[]>(mockCircles);
  const [interests, setInterests] = useState<Interest[]>(mockInterests);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [invitations, setInvitations] = useState<Record<number, Invitation>>(mockInvitations);
  const [error, setError] = useState<Error | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ 
        users, setUsers, 
        circles, setCircles, 
        interests, setInterests, 
        events, setEvents, 
        invitations, setInvitations,
        error, setError
      }}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

