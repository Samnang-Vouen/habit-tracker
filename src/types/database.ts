export interface Habit {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface HabitInsert {
  name: string
}

export interface HabitUpdate {
  name: string
}

export interface DailyLog {
  id: string
  habit_id: string
  log_date: string
  completed: boolean
  created_at: string
}

export interface HabitWithTodayLog extends Habit {
  todayLog: DailyLog | null
}
