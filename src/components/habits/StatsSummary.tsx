import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { HabitWithTodayLog } from '@/types/database'

interface StatsSummaryProps {
  habits: HabitWithTodayLog[]
  loading: boolean
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

export function StatsSummary({ habits, loading }: StatsSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    )
  }

  const total = habits.length
  const completed = habits.filter((habit) => habit.todayLog?.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile label="Total habits" value={String(total)} />
      <StatTile label="Completed today" value={`${completed} / ${total}`} />
      <StatTile label="Completion rate" value={`${percent}%`} />
    </div>
  )
}
