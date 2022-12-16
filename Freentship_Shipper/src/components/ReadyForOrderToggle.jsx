import {
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Switch,
  Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/config'
import { async } from '@firebase/util'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ReadyForOrderToggle() {
  const [shipperID, setShipperID] = useState('')
  const [isReadyForOrder, setIsReadyForOrder] = useState()
  const [isEnabled, setIsEnabled] = useState()
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userID')
      if (value !== null) {
        setShipperID(value)
      }
    } catch (e) {
      // error reading value
    }
  }

  // Change the active value
  const toggleSwitch = () => {
    // Show confirm active message
    if (!isEnabled) {
      Alert.alert('Thông báo', 'Bạn có muốn nhận đơn hàng mới', [
        {
          text: 'Cancel',
          onPress: () => setIsEnabled(false),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setIsEnabled(true)
          },
        },
      ])
    } else {
      setIsEnabled(false)
    }
  }

  // Set the active state in database
  const changeState = async () => {
    console.log('con cuu', shipperID)
    if (shipperID !== '') {
      const isActive = doc(db, 'shippers', shipperID)
      await updateDoc(isActive, {
        isActive: isEnabled,
      })
    }
  }

  // Get the current status of shipper
  const getCurrentStatus = () => {
    const unsubscribe = onSnapshot(
      doc(db, 'shippers', shipperID + ''),
      (item) => {
        setIsEnabled(item.data().isActive)
      },
    )
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (shipperID !== '') getCurrentStatus()
  }, [shipperID])

  useEffect(() => {
    changeState()
  }, [isEnabled])

  return (
    <SafeAreaView style={styles.homepageHeader}>
      <Text style={styles.txtHeader}>Sẵn sàng nhận đơn:</Text>
      <Switch
        trackColor={{ false: '#000000', true: '#E94730' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#3e3e3e"
        onChange={toggleSwitch}
        value={isEnabled}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  homepageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
  },
  txtHeader: {
    fontSize: 20,
  },
})
