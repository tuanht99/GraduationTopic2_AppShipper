import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {HomeNavigation} from "./HomeNavigation";
import {LocationScreen} from "../screens/LocationScreen";

const Stack = createNativeStackNavigator()

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name={'LocationScreen'} component={LocationScreen} />
        <Stack.Screen name={'HomeNavigation'} component={HomeNavigation} />
      </Stack.Navigator>
      </NavigationContainer>
  )
}