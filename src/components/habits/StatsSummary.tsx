import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { HabitWithTodayLog } from '@/types/database'

interface StatsSummaryProps {
  habits: HabitWithTodayLog[]
  loading: boolean
}

export function StatsSummary({ habits, loading }: StatsSummaryProps) {
  if (loading) {
    return <Skeleton className="h-16 w-full rounded-xl" />
  }

  const total = habits.length
  const completed = habits.filter((habit) => habit.todayLog?.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Today's progress</p>
          <p className="text-muted-foreground text-sm">
            {total === 0 ? 'No habits yet' : `${completed} of ${total} habits completed`}
          </p>
        </div>
        <p className="text-2xl font-semibold">{percent}%</p>
      </CardContent>
    </Card>
  )
}
