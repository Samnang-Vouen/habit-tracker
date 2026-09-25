import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { useAuth } from '../hooks/useAuth'

export function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setError(null)
    setLoading(true)
    const { error: signInError } = await signIn(email.trim(), password)
    setLoading(false)
    if (signInError) setError(signInError)
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-full max-w-sm gap-4">
        <View className="gap-1">
          <Text className="text-center text-2xl font-semibold text-neutral-900">Habit Tracker</Text>
          <Text className="text-center text-neutral-500">Sign in to track your habits.</Text>
        </View>

        <TextInput
          className="rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900"
          placeholder="Email"
          placeholderTextColor="#a3a3a3"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900"
          placeholder="Password"
          placeholderTextColor="#a3a3a3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text className="text-center text-sm text-red-600">{error}</Text>}

        <Pressable
          className="items-center rounded-xl bg-neutral-900 py-3 active:opacity-80 disabled:opacity-50"
          onPress={handleSignIn}
          disabled={loading || email.length === 0 || password.length === 0}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">Sign in</Text>}
        </Pressable>
      </View>
    </View>
  )
}
