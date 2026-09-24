import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { DailyLog, Habit, HabitWithTodayLog } from '@/types/database'

function todayDateString(): string {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<HabitWithTodayLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data: habitRows, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })
      .returns<Habit[]>()

    if (habitsError) {
      setError(getErrorMessage(habitsError))
      setLoading(false)
      return
    }

    const today = todayDateString()
    const habitIds = habitRows.map((habit) => habit.id)

    let todayLogs: DailyLog[] = []
    if (habitIds.length > 0) {
      const { data: logRows, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('log_date', today)
        .in('habit_id', habitIds)
        .returns<DailyLog[]>()

      if (logsError) {
        setError(getErrorMessage(logsError))
        setLoading(false)
        return
      }
      todayLogs = logRows
    }

    setHabits(
      habitRows.map((habit) => ({
        ...habit,
        todayLog: todayLogs.find((log) => log.habit_id === habit.id) ?? null,
      })),
    )
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const addHabit = useCallback(
    async (name: string) => {
      if (!user) return { error: 'You must be signed in.' }

      const { data, error: insertError } = await supabase
        .from('habits')
        .insert({ name, user_id: user.id })
        .select()
        .returns<Habit[]>()
        .single()

      if (insertError) return { error: getErrorMessage(insertError) }

      setHabits((current) => [...current, { ...data, todayLog: null }])
      return { error: null }
    },
    [user],
  )

  const editHabit = useCallback(async (habitId: string, name: string) => {
    const { data, error: updateError } = await supabase
      .from('habits')
      .update({ name })
      .eq('id', habitId)
      .select()
      .returns<Habit[]>()
      .single()

    if (updateError) return { error: getErrorMessage(updateError) }

    setHabits((current) =>
      current.map((habit) => (habit.id === habitId ? { ...habit, ...data } : habit)),
    )
    return { error: null }
  }, [])

  const deleteHabit = useCallback(async (habitId: string) => {
    const { error: deleteError } = await supabase.from('habits').delete().eq('id', habitId)

    if (deleteError) return { error: getErrorMessage(deleteError) }

    setHabits((current) => current.filter((habit) => habit.id !== habitId))
    return { error: null }
  }, [])

  const toggleHabit = useCallback(
    async (habitId: string) => {
      const habit = habits.find((item) => item.id === habitId)
      if (!habit) return { error: 'Habit not found.' }

      const today = todayDateString()
      const nextCompleted = !habit.todayLog?.completed

      const { data, error: upsertError } = await supabase
        .from('daily_logs')
        .upsert(
          { habit_id: habitId, log_date: today, completed: nextCompleted },
          { onConflict: 'habit_id,log_date' },
        )
        .select()
        .returns<DailyLog[]>()
        .single()

      if (upsertError) return { error: getErrorMessage(upsertError) }

      setHabits((current) =>
        current.map((item) => (item.id === habitId ? { ...item, todayLog: data } : item)),
      )
      return { error: null }
    },
    [habits],
  )

  return { habits, loading, error, addHabit, editHabit, deleteHabit, toggleHabit, refetch: fetchHabits }
}
