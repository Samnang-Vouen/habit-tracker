import { useContext } from 'react'
import { HabitsContext } from '../contexts/HabitsContext'

export function useHabitsContext() {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error('useHabitsContext must be used within a HabitsProvider')
  }
  return context
}
