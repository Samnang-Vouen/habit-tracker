import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAuth } from '../hooks/useAuth'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { shareApp } from '../lib/share'
import type { RootStackParamList } from '../navigation/types'
import type { HabitWithTodayLog } from '../types/database'

type Props = NativeStackScreenProps<RootStackParamList, 'List'>

function HabitRow({
  habit,
  onToggle,
  onDelete,
}: {
  habit: HabitWithTodayLog
  onToggle: () => void
  onDelete: () => void
}) {
  const completed = habit.todayLog?.completed ?? false

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <Pressable
        className="flex-1 flex-row items-center gap-3"
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={`Mark ${habit.name} as ${completed ? 'not done' : 'done'} today`}
      >
        <View
          className={`h-5 w-5 items-center justify-center rounded border ${
            completed ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
          }`}
        >
          {completed && <Text className="text-xs font-bold text-white">✓</Text>}
        </View>
        <Text className="flex-1 text-base text-neutral-900" numberOfLines={1}>
          {habit.name}
        </Text>
      </Pressable>

      <View className={`rounded-full px-2 py-0.5 ${completed ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
        <Text className={`text-xs font-medium ${completed ? 'text-white' : 'text-neutral-600'}`}>
          {completed ? 'Done today' : 'Not done'}
        </Text>
      </View>

      <Pressable onPress={onDelete} hitSlop={8} accessibilityLabel={`Delete ${habit.name}`}>
        <Text className="text-sm text-red-600">Delete</Text>
      </Pressable>
    </View>
  )
}

export function ListScreen({ navigation }: Props) {
  const { user, signOut } = useAuth()
  const { habits, loading, error, toggleHabit, deleteHabit, refetch } = useHabitsContext()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  return (
    <View className="flex-1 bg-neutral-50 px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-neutral-900">Habit Tracker</Text>
          <Text className="text-sm text-neutral-500" numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => shareApp()} hitSlop={8}>
            <Text className="text-sm font-medium text-neutral-700">Share</Text>
          </Pressable>
          <Pressable onPress={() => signOut()} hitSlop={8}>
            <Text className="text-sm font-medium text-neutral-700">Sign out</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        className="mb-4 items-center self-end rounded-full bg-neutral-900 px-4 py-2 active:opacity-80"
        onPress={() => navigation.navigate('Add')}
      >
        <Text className="font-semibold text-white">+ Add Habit</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator className="mt-8" />
      ) : error ? (
        <Text className="text-red-600">{error}</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text className="mt-8 text-center text-neutral-500">
              No habits yet. Add your first one to get started.
            </Text>
          }
          renderItem={({ item }) => (
            <HabitRow
              habit={item}
              onToggle={() => toggleHabit(item.id)}
              onDelete={() => deleteHabit(item.id)}
            />
          )}
        />
      )}
    </View>
  )
}
