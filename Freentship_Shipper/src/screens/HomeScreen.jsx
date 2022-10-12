import ReadyForOrderToggle from '../components/ReadyForOrderToggle'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SvgTest from '../assets/icons/logo-shipper.svg'
import { db } from '../services/config'
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore'
import FoodStoreLocationIcon from '../assets/icons/food_store_location.svg'
import UserLocationIcon from '../assets/icons/user-location-icon.svg'
import call from 'react-native-phone-call'
import PhoneIcon from '../assets/icons/phone_icon.svg'
import * as Notifications from 'expo-notifications'

export default function HomeScreen() {
  const [lastestOrder, setLastestOrder] = useState()
  const args = {
    number: '9093900003', // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  }
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'orders', 'mu5Mdy3uPMLC1Mo5xvph'),
      (item) => {
        setLastestOrder({ id: item.id, ...item.data() })
      },
    )
    return unsubscribe
  }, [])

  console.log(lastestOrder)

  return (
    <View style={styles.container}>
      {/* Logo app shipper */}
      <SvgTest width={50} height={50} style={styles.logo} />
      {/* Ready-For-Order Switch */}
      <ReadyForOrderToggle />
      {/* Order detail */}
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
        }}
      >
        <View>
          <Text style={{ fontSize: 20 }}>Mã đơn hàng: {'#121123213213'}</Text>
          <Text style={{ fontSize: 20 }}>
            Trạng thái: {'Đang chờ xác nhận'}
          </Text>
          <Text style={{ fontSize: 20 }}>Tiền cần thu: {'50.000 VNĐ'}</Text>
        </View>
        {/* Location */}
        <View style={styles.locationPane}>
          {/* Food store address */}
          <View style={{ flexDirection: 'row' }}>
            <FoodStoreLocationIcon />
            <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: 'bold' }}>
              Trà sữa Thanh Tuấn
            </Text>
          </View>
          {/* Food store address and contact */}
          <View
            style={{
              marginLeft: 10,
              marginTop: 10,
              paddingLeft: 10,
              borderRadius: 1,
              borderLeftWidth: 1,
              borderLeftColor: '#E94730',
            }}
          >
            <Text style={{ fontSize: 20 }}>
              1 Hai Bà Trưng, P.Đa Kao, Q.1, TP. Hồ Chí Minh
            </Text>
            {/* Contact via phone */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                call(args).catch(console.error)
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <PhoneIcon />
                <Text style={{ color: 'white', paddingLeft: 10 }}>
                  Gọi cho quán
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* User address */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <UserLocationIcon />
            <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: 'bold' }}>
              Trần Quốc Huy
            </Text>
          </View>
          {/* User address and contact*/}
          <View
            style={{
              paddingLeft: 10,
              marginLeft: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>
              200 Hai Bà Trưng, P.Đa Kao, Q.1, TP. Hồ Chí Minh
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                call(args).catch(console.error)
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <PhoneIcon />
                <Text style={{ color: 'white', paddingLeft: 10 }}>
                  Gọi cho khách
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, paddingTop: 10 }}>
            Khoảng cách: {'20km'}
          </Text>
        </View>
      </View>
    </View>
  )
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
})
