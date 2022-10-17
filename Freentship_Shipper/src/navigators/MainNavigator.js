import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from "react-native";

import HomeScreen from '../screens/HomeScreen'
import OrderManagementScreen from '../screens/OrderManagementScreen'
import PersonalInformationScreen from '../screens/PersonalInformationScreen'
import { NavigationContainer } from '@react-navigation/native';

import ReadyForOrderIcon from '../assets/icons/ready-for-order.svg'
import OrderManagement from '../assets/icons/order-management.svg'
import UserManagement from '../assets/icons/user-management.svg'


const Tab = createBottomTabNavigator();

export function MainNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,

                }}>
                <Tab.Screen
                    name="Home" component={HomeScreen}
                    options={{
                        tabBarIcon: () => (<ReadyForOrderIcon width={120} height={40} />),
                    }}
                />
                <Tab.Screen
                    name="OrderManagementScreen" component={OrderManagementScreen}
                    options={{
                        tabBarIcon: () => (<OrderManagement />),
                    }}
                />
                <Tab.Screen
                    name="PersonalInformationScreen" component={PersonalInformationScreen}
                    options={{
                        tabBarIcon: () => (<UserManagement />)
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>

    );
}

