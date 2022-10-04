import {
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Switch,
} from 'react-native'
import React, { useState } from 'react'
export default function ReadyForOrderToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

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
