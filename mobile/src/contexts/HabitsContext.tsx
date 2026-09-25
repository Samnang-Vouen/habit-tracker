import { createContext, type ReactNode } from 'react'
import { useHabits as useHabitsState } from '../hooks/useHabits'

type HabitsContextValue = ReturnType<typeof useHabitsState>

// ListScreen and AddScreen are separate navigator routes — each one mounts
// fresh, so a bare useHabits() call in each would manage its own isolated
// state and never see the other's changes (adding a habit on AddScreen
// wouldn't appear back on ListScreen). This context is the mobile
// equivalent of Dashboard.tsx owning a single useHabits() call and handing
// it down as props on web: one source of truth, shared across screens.
export const HabitsContext = createContext<HabitsContextValue | undefined>(undefined)

export function HabitsProvider({ children }: { children: ReactNode }) {
  const value = useHabitsState()
  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
}
