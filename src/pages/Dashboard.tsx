import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useHabits'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddHabitDialog } from '@/components/habits/AddHabitDialog'
import { HabitList } from '@/components/habits/HabitList'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { habits, loading, error, addHabit, editHabit, deleteHabit, toggleHabit } = useHabits()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-4 sm:p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Habit Tracker</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-muted-foreground truncate font-normal">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">Good day 👋</h2>
        <p className="text-muted-foreground">Track your habits today.</p>
      </section>

      <div className="flex justify-end">
        <AddHabitDialog onAdd={addHabit} />
      </div>

      <HabitList
        habits={habits}
        loading={loading}
        error={error}
        onToggle={toggleHabit}
        onSave={editHabit}
        onDelete={deleteHabit}
      />
    </div>
  )
}
