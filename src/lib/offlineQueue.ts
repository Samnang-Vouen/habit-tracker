export interface QueuedHabit {
  tempId: string
  userId: string
  name: string
  createdAt: string
}

const STORAGE_KEY = 'habit-tracker:offline-queue'

function readQueue(): QueuedHabit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QueuedHabit[]) : []
  } catch {
    return []
  }
}

function writeQueue(queue: QueuedHabit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function getQueuedHabits(userId: string): QueuedHabit[] {
  return readQueue().filter((item) => item.userId === userId)
}

export function enqueueHabit(entry: QueuedHabit) {
  writeQueue([...readQueue(), entry])
}

export function dequeueHabit(tempId: string) {
  writeQueue(readQueue().filter((item) => item.tempId !== tempId))
}
