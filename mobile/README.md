# Habit Tracker — Mobile (Expo)

The same habit tracker, ported to React Native. Same Supabase project, same
`habits`/`daily_logs` tables, same account — just native primitives instead
of DOM ones (`FlatList` instead of a mapped `<div>` list, `Pressable`
instead of `<button>`, NativeWind classes instead of Tailwind on `className`
for the web).

## Setup

```bash
cd mobile
npm install
cp .env.example .env   # fill in the same Supabase project URL + anon key
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) on a real phone, or press
`a` / `i` in the terminal for an Android/iOS emulator, or `w` for a browser
tab (uses `react-native-web` — same components, no native runtime needed to
sanity-check the UI).

## What's shared vs. what's platform-specific

Everything is shared code — screens, styling, Supabase calls, navigation —
**except** the one call in `src/lib/share.ts`, which branches on
`Platform.select`:

- `web`: `navigator.share()` (falls back to clipboard if unsupported)
- everything else (iOS/Android): React Native's `Share.share()`

## Structure

```
App.tsx                        # navigation shell + auth/habits providers
src/
  contexts/AuthContext.tsx     # same sign-in logic as the web app
  contexts/HabitsContext.tsx   # shared state across List/Add screens
  hooks/useHabits.ts           # ~identical to the web hook — same queries
  lib/supabase.ts              # RN client (AsyncStorage instead of localStorage)
  lib/share.ts                 # the one Platform.select branch
  screens/LoginScreen.tsx
  screens/ListScreen.tsx       # FlatList of habits
  screens/AddScreen.tsx
```
