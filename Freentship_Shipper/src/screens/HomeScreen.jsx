import ReadyForOrderToggle from '../components/ReadyForOrderToggle'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import SvgTest from '../assets/icons/logo-shipper.svg'
import { db } from '../services/config'
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import FoodStoreLocationIcon from '../assets/icons/food_store_location.svg'
import UserLocationIcon from '../assets/icons/user-location-icon.svg'
import call from 'react-native-phone-call'
import PhoneIcon from '../assets/icons/phone_icon.svg'
import * as Notifications from 'expo-notifications'
import { async } from '@firebase/util'
import LastestOrder from '../components/LastestOrder'
import app, { auth } from '../services/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomeScreen() {
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

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (shipperID != '') {
      console.log('shipperBug', shipperID)
      const unsub = onSnapshot(doc(db, 'shippers', shipperID + ''), (doc) => {
        setLastestOrderID(doc.data().lastestOrderID)
        console.log('tesst', doc.data())
      })
    }
  }, [shipperID])
  console.log('lto', lastestOrderID)
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
