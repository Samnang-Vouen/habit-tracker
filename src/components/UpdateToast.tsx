import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      // Tabs are often left open for a long time; check for a fresh
      // service worker every hour so "New version available" isn't
      // stuck waiting for the next full page load.
      setInterval(() => registration.update(), 60 * 60 * 1000)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <Alert className="bg-popover w-full max-w-sm shadow-lg">
        <AlertDescription className="flex w-full items-center justify-between gap-3 text-foreground">
          <span>New version available</span>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => updateServiceWorker(true)}>
              Refresh
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
