import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useHabitsContext } from '../hooks/useHabitsContext'
import type { RootStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<RootStackParamList, 'Add'>

export function AddScreen({ navigation }: Props) {
  const { addHabit } = useHabitsContext()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    setError(null)
    setSaving(true)
    const { error: addError } = await addHabit(name.trim())
    setSaving(false)

    if (addError) {
      setError(addError)
      return
    }

    navigation.goBack()
  }

  return (
    <View className="flex-1 gap-4 bg-white p-4">
      <View className="gap-1">
        <Text className="text-lg font-semibold text-neutral-900">New habit</Text>
        <Text className="text-sm text-neutral-500">What do you want to track daily?</Text>
      </View>

      <TextInput
        className="rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900"
        placeholder="e.g. Morning Exercise"
        placeholderTextColor="#a3a3a3"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      {error && <Text className="text-sm text-red-600">{error}</Text>}

      <Pressable
        className="items-center rounded-xl bg-neutral-900 py-3 active:opacity-80 disabled:opacity-50"
        onPress={handleCreate}
        disabled={saving || name.trim().length === 0}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">Create</Text>}
      </Pressable>
    </View>
  )
}
