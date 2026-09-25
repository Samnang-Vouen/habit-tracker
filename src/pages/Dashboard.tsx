import { useState } from 'react'
import { ImageIcon, LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useHabits'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
import { StatsSummary } from '@/components/habits/StatsSummary'
import { AvatarUploadDialog } from '@/components/profile/AvatarUploadDialog'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ShareButton } from '@/components/ShareButton'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { habits, loading, error, addHabit, editHabit, deleteHabit, toggleHabit } = useHabits()
  const { profile, updateAvatarUrl } = useProfile()
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-4 sm:p-8">
      <ErrorBoundary title="Navigation failed" message="The header couldn't be displayed.">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Habit Tracker</h1>
          <div className="flex items-center gap-1">
            <ShareButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User menu" className="rounded-full">
                  <Avatar>
                    {/* Above the fold, part of the header's first paint — kept eager,
                        but given explicit dimensions so it can't shift layout on load. */}
                    <AvatarImage
                      src={profile?.avatar_url ?? undefined}
                      alt="Your avatar"
                      width={32}
                      height={32}
                    />
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-muted-foreground truncate font-normal">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setAvatarDialogOpen(true)}>
                  <ImageIcon className="size-4" />
                  Change avatar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </ErrorBoundary>

      <section>
        <h2 className="text-2xl font-semibold">Good day 👋</h2>
        <p className="text-muted-foreground">Track your habits today.</p>
      </section>

      <ErrorBoundary title="Stats unavailable" message="We couldn't load your progress summary.">
        <StatsSummary habits={habits} loading={loading} />
      </ErrorBoundary>

      <div className="flex justify-end">
        <AddHabitDialog onAdd={addHabit} />
      </div>

      <ErrorBoundary title="Habit list unavailable" message="We couldn't load your habits.">
        <HabitList
          habits={habits}
          loading={loading}
          error={error}
          onToggle={toggleHabit}
          onSave={editHabit}
          onDelete={deleteHabit}
        />
      </ErrorBoundary>

      <AvatarUploadDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        profile={profile}
        onUploaded={updateAvatarUrl}
      />
    </div>
  )
}
