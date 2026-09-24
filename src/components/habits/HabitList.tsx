import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HabitCard } from '@/components/habits/HabitCard'
import type { HabitWithTodayLog } from '@/types/database'

interface HabitListProps {
  habits: HabitWithTodayLog[]
  loading: boolean
  error: string | null
  onToggle: (habitId: string) => Promise<{ error: string | null }>
  onSave: (habitId: string, name: string) => Promise<{ error: string | null }>
  onDelete: (habitId: string) => Promise<{ error: string | null }>
}

export function HabitList({ habits, loading, error, onToggle, onSave, onDelete }: HabitListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed py-12 text-center">
        No habits yet. Add your first habit to get started.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
