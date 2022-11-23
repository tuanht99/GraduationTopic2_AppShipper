import ReadyForOrderToggle from '../components/ReadyForOrderToggle'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
} from 'react-native'
import SvgTest from '../assets/icons/logo-shipper.svg'
import { db } from '../services/config'
import { doc, onSnapshot } from 'firebase/firestore'
import LastestOrder from '../components/LastestOrder'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect, useRef } from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  const [shipperID, setShipperID] = useState('')
  const [lastestOrderID, setLastestOrderID] = useState('')
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userID')
      if (value !== null) {
        setShipperID(value + '')
      }
    } catch (e) {}
  }

  // Notification-code
  useEffect(() => {
    getData()

    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification)
      },
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response)
      },
    )
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  useEffect(() => {
    if (shipperID != '') {
      const unsub = onSnapshot(doc(db, 'shippers', shipperID + ''), (doc) => {
        setLastestOrderID(doc.data().lastestOrderID)
        if (doc.data().lastestOrderID != '') {
          schedulePushNotification(doc.data())
        }
      })
    }
  }, [shipperID])

  if (lastestOrderID !== '') {
    return <LastestOrder lastestOrderID={lastestOrderID} />
  } else {
    return (
      <View style={styles.container}>
        {/* Logo app shipper */}
        <SvgTest width={50} height={50} style={styles.logo} />
        {/* Ready-For-Order Switch */}
        <ReadyForOrderToggle />
        <View>
          <Text>Không có đơn hàng nào!</Text>
        </View>
      </View>
    )
  }
}

async function schedulePushNotification(data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bạn có đơn hàng mới',
      body: `Mã đơn hàng: ${data.lastestOrderID}`,
      data: { data: 'goes here' },
      // sound: 'notification-sound.wav',
    },
    trigger: { seconds: 2 },
  })
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      // sound: 'notification-sound.wav',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}

const styles = StyleSheet.create({
  logo: {
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  container: {
    marginTop: 50,
  },
  locationPane: {
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#E94730',
    padding: 10,
    borderRadius: 20,
  },
  buttonCancel: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
  },
  buttonAccept: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
  },
})
