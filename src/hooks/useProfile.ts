import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Profile } from '@/types/database'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .returns<Profile[]>()
      .maybeSingle()

    if (!error && data) {
      setProfile(data)
    } else {
      setProfile({ id: user.id, avatar_url: null, updated_at: new Date().toISOString() })
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateAvatarUrl = useCallback(
    async (avatarUrl: string) => {
      if (!user) return { error: 'You must be signed in.' }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .select()
        .returns<Profile[]>()
        .single()

      if (error) return { error: getErrorMessage(error) }

      setProfile(data)
      return { error: null }
    },
    [user],
  )

  return { profile, loading, updateAvatarUrl }
}
