import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen'
import { OrderManagementScreen } from '../screens/OrderManagementScreen'
import PersonalInformationScreen from '../screens/PersonalInformationScreen'
import { NavigationContainer } from '@react-navigation/native';

import ReadyForOrderIcon from '../assets/icons/ready-for-order.svg'
import OrderManagement from '../assets/icons/order-management.svg'
import UserManagement from '../assets/icons/user-management.svg'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


const Tab = createMaterialBottomTabNavigator();

export const HomeNavigation = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
      barStyle={{ backgroundColor: '#fff' }}
      labeled='false'
    >
      <Tab.Screen
        name="Home" component={HomeScreen}
        options={{
          tabBarIcon: () => (<ReadyForOrderIcon />),
          title: 'Trang chủ'
        }}
      />
      <Tab.Screen
        name="Orders" component={OrderManagementScreen}
        options={{
          tabBarIcon: () => (<OrderManagement />),
          title: 'Đơn hàng'
        }}
      />
      <Tab.Screen
        name="Info" component={PersonalInformationScreen}
        options={{
          tabBarIcon: () => (<UserManagement />),
          title: 'Thông tin'
        }}
      />
    </Tab.Navigator>
  );
}

