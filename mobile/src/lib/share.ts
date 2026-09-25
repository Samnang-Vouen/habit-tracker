import { Platform, Share } from 'react-native'

/**
 * The one platform branch in this app. Everywhere else — screens, styling,
 * data fetching — is identical code on web and native. Only the share
 * surface itself differs: the browser's Web Share API vs React Native's
 * native share sheet. The `web` branch only ever runs when Platform.OS
 * is "web" (i.e. this same code running via `expo start --web`), so
 * `navigator` is never touched on iOS/Android.
 */
export async function shareApp(): Promise<void> {
  const title = 'Habit Tracker'
  const message = 'Track your daily habits, online or off.'

  const share = Platform.select<() => Promise<void>>({
    web: async () => {
      if (navigator.share) {
        await navigator.share({ title, text: message })
      } else {
        await navigator.clipboard.writeText(message)
      }
    },
    default: async () => {
      await Share.share({ title, message })
    },
  })

  try {
    await share()
  } catch {
    // User dismissed the share sheet, or the browser denied clipboard
    // access — neither is an error worth surfacing to the user.
  }
}
