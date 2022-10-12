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
export default function ReadyForOrderToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => {
    if (isEnabled) {
      Alert.alert('Thông báo', 'Bạn có muốn nhận đơn hàng mới', [
        {
          text: 'Cancel',
          onPress: () => setIsEnabled(false),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => setIsEnabled(true) },
      ])
    }
  }

  useEffect(() => {}, [isEnabled])

  return (
    <SafeAreaView style={styles.homepageHeader}>
      <Text style={styles.txtHeader}>Sẵn sàng nhận đơn:</Text>
      <Switch
        trackColor={{ false: '#000000', true: '#E94730' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
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
