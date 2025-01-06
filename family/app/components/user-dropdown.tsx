'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface User {
  id: number;
  name: string;
}

interface UserDropdownProps {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
  onSimulateLogin: () => void;
}

export function UserDropdown({ users, selectedUser, onSelectUser, onSimulateLogin }: UserDropdownProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure users is always an array and not null or undefined
  const safeUsers = users && Array.isArray(users) ? users : []

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedUser?.name || "Select user..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {safeUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    onSelectUser(user)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button onClick={onSimulateLogin} variant="outline" size="icon">
        <UserPlus className="h-4 w-4" />
        <span className="sr-only">Simulate Login</span>
      </Button>
    </div>
  )
}

