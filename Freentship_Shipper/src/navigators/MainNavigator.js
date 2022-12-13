import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeNavigation } from './HomeNavigation';
import { LocationScreen } from '../screens/LocationScreen';
import { LoginScreen } from '../screens/LoginScreen'
import { ConfirmOTP } from '../screens/ConfirmOTP'
import { SignupScreen } from '../screens/SignupScreen'
import { SignupPending } from '../screens/SignupPending'
import { OrderItemDetail } from '../screens/OrderItemDetail';
import { OrderManagementScreen } from '../screens/OrderManagementScreen';
import { OrderItem } from '../components/OrderItem';
import { NotificationTest } from '../screens/NotificationTest';
import ChatScreen from '../screens/ChatScreen';
import ChangeInfo from '../screens/ChangeInfo';

const Stack = createNativeStackNavigator()

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='LoginScreen'
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'ChatScreen'} component={ChatScreen} />
        <Stack.Screen name={'NotificationTest'} component={NotificationTest} />
        <Stack.Screen name={'OrderItem'} component={OrderItem} />
        <Stack.Screen name={'OrderManagementScreen'} component={OrderManagementScreen} />
        <Stack.Screen name={'OrderItemDetail'} component={OrderItemDetail} />
        <Stack.Screen name={'ConfirmOTP'} component={ConfirmOTP} />
        <Stack.Screen name={'SignupScreen'} component={SignupScreen} />
        <Stack.Screen name={'LocationScreen'} component={LocationScreen} />
        <Stack.Screen name={'HomeNavigation'} component={HomeNavigation} />
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
        <Stack.Screen name={'ChangeInfo'} component={ChangeInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}