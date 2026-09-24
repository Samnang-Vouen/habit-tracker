import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EditHabitDialog } from '@/components/habits/EditHabitDialog'
import type { HabitWithTodayLog } from '@/types/database'

interface HabitCardProps {
  habit: HabitWithTodayLog
  onToggle: (habitId: string) => Promise<{ error: string | null }>
  onSave: (habitId: string, name: string) => Promise<{ error: string | null }>
  onDelete: (habitId: string) => Promise<{ error: string | null }>
}

export function HabitCard({ habit, onToggle, onSave, onDelete }: HabitCardProps) {
  const [toggling, setToggling] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const completed = habit.todayLog?.completed ?? false

  async function handleToggle() {
    setToggling(true)
    await onToggle(habit.id)
    setToggling(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await onDelete(habit.id)
    setDeleting(false)
    if (!error) {
      setDeleteOpen(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Checkbox
          checked={completed}
          disabled={toggling}
          onCheckedChange={handleToggle}
          aria-label={`Mark ${habit.name} as ${completed ? 'not done' : 'done'} today`}
        />

        <div className="flex-1">
          <p className="font-medium">{habit.name}</p>
        </div>

        {toggling ? (
          <Spinner className="size-4" />
        ) : (
          <Badge variant={completed ? 'default' : 'secondary'}>
            {completed ? 'Done today' : 'Not done'}
          </Badge>
        )}

        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="Edit habit">
          <Pencil className="size-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)} aria-label="Delete habit">
          <Trash2 className="size-4" />
        </Button>
      </CardContent>

      <EditHabitDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} onSave={onSave} />

      <AlertDialog open={deleteOpen} onOpenChange={(next) => !deleting && setDeleteOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{habit.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all of its daily logs. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
            >
              {deleting && <Spinner className="size-4" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
