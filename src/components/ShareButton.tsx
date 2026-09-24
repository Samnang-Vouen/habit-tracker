import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ShareButton() {
  async function handleShare() {
    const shareData = {
      title: 'Habit Tracker',
      text: 'Track your daily habits, online or off.',
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User dismissed the native share sheet; nothing to do.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareData.url)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share Habit Tracker">
      <Share2 className="size-4" />
    </Button>
  )
}
