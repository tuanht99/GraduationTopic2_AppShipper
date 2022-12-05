import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Menu } from 'react-native-paper'
import ChangeInfo from './ChangeInfo'

export default function PersonalInformationScreen({ navigation }) {
  const [shipperInfo, setShipperInfo] = useState()

  const getShipperInFo = () => {
    const unsub = onSnapshot(doc(db, 'cities', 'SF'), (doc) => {})
  }
  return (
    <SafeAreaView>
      <View>
        <Menu.Item
          icon="account-cog-outline"
          onPress={() => {
            navigation.navigate('ChangeInfo')
          }}
          title="Chỉnh sửa thông tin"
          trailingIcon="logout"
        />
        <Menu.Item icon="logout" onPress={() => {}} title="Đăng xuất" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: 'white',
  },
})
