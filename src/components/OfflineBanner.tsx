import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="bg-foreground text-background flex items-center justify-center gap-2 px-4 py-2 text-center text-sm">
      <WifiOff className="size-4 shrink-0" />
      You're offline. New habits will be queued and synced when you reconnect.
    </div>
  )
}
