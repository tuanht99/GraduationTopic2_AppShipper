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
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../services/config'
import { async } from '@firebase/util'

export default function ReadyForOrderToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
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
    const isActive = doc(db, 'users', 'Eih2n7ixJmZWhpTf5tbS')
    await updateDoc(isActive, {
      isActive: isEnabled,
    })
  }
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
