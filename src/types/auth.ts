import type { Session, User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export interface AuthFormValues {
  email: string
  password: string
}

export interface AuthContextValue extends AuthState {
  signUp: (values: AuthFormValues) => Promise<{ error: string | null }>
  signIn: (values: AuthFormValues) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}
