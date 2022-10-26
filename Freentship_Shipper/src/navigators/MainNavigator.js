import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeNavigation } from './HomeNavigation';
import { LocationScreen } from '../screens/LocationScreen';
import { LoginScreen } from '../screens/LoginScreen'
import { ConfirmOTP } from '../screens/ConfirmOTP'

const Stack = createNativeStackNavigator()

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='LoginScreen'
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'ConfirmOTP'} component={ConfirmOTP} />
        <Stack.Screen name={'LocationScreen'} component={LocationScreen} />
        <Stack.Screen name={'HomeNavigation'} component={HomeNavigation} />
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}