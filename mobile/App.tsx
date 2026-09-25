import './global.css'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/contexts/AuthContext'
import { HabitsProvider } from './src/contexts/HabitsContext'
import { useAuth } from './src/hooks/useAuth'
import { LoginScreen } from './src/screens/LoginScreen'
import { ListScreen } from './src/screens/ListScreen'
import { AddScreen } from './src/screens/AddScreen'
import type { RootStackParamList } from './src/navigation/types'

const Stack = createNativeStackNavigator<RootStackParamList>()

function Root() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <HabitsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddScreen} options={{ title: 'Add Habit' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </HabitsProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
      <StatusBar style="auto" />
    </AuthProvider>
  )
}
