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

export default function LastestOrder() {
  const [shipperID, setShipperID] = useState('mzVAqynSkWk0KV0LZg0j')
  // Constants declaration
  const [lastestOrder, setLastestOrder] = useState([])
  const [orderState, setOrderState] = useState([])
  const [foodStore, setFoodStore] = useState([])
  const [customer, setCustomer] = useState([])

  const foodStorePhone = {
    number: foodStore.phone, // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  }

  const customerPhone = {
    number: customer.phone, // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  }

  const cancelOrder = async () => {
    const orderState = doc(db, 'orders', lastestOrder.id + '')

    // Set the "capital" field of the city 'DC'
    await updateDoc(orderState, {
      status: 2,
    })

    const cacelOrder = doc(db, 'shippers', shipperID + '')

    // Set the "capital" field of the city 'DC'
    await updateDoc(cacelOrder, {
      lastest_order_id: '',
    })
  }

  // Get lastest order
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'orders', 'mu5Mdy3uPMLC1Mo5xvph'),
      (item) => {
        setLastestOrder({ id: item.id, ...item.data() })
        console.log("lastestOrder.user_id :"+lastestOrder.user_id)
      },
    )
    const q = query(collection(db, 'order_status'))

    const order = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setOrderState((orderState) => [...orderState, doc.data().value])
      })
    })
    const user = onSnapshot(
      doc(db, 'users', lastestOrder.user_id + ''),
      (item) => {
        setCustomer({ id: item.id, ...item.data() })
      },
    )
    const foodStore = onSnapshot(
      doc(db, 'food_stores', lastestOrder.food_store_id + ''),
      (item) => {
        setFoodStore({ id: item.id, ...item.data() })
      },
    )
  }, [lastestOrder.user_id])

  // Cancel the order
  const cancelTheOrder = () => {
    Alert.alert('Thông báo', 'Bạn có muốn huỷ đơn hàng này không?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          cancelOrder()
        },
      },
    ])
  }

  // Accept the order
  const acceptTheOrder = async () => {
    const orderState = doc(db, 'orders', lastestOrder.id + '')

    // Set the "capital" field of the city 'DC'
    await updateDoc(orderState, {
      status: 3,
    })
  }
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
          <Text style={{ fontSize: 20 }}>
            Mã đơn hàng: {lastestOrder != undefined ? lastestOrder.id : ''}
          </Text>
          <Text style={{ fontSize: 20 }}>
            Trạng thái:{'\n'}
            {lastestOrder != undefined
              ? orderState[lastestOrder.status]
              : 'Loading...'}
          </Text>
          <Text style={{ fontSize: 20 }} type="money">
            Tiền cần thu:{' '}
            {lastestOrder != undefined
              ? lastestOrder.totalPrice - lastestOrder.deposit + ' VND'
              : 'Loading... '}
          </Text>
        </View>
        {/* Location */}
        <View style={styles.locationPane}>
          {/* Food store address */}
          <View style={{ flexDirection: 'row' }}>
            <FoodStoreLocationIcon />
            <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: 'bold' }}>
              {foodStore != undefined ? foodStore.name : 'Loading...'}
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
              {foodStore != undefined ? foodStore.address : 'Loading...'}
            </Text>
            {/* Contact via phone */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                call(foodStorePhone).catch(console.error)
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
              {customer != undefined ? customer.address : 'Loading...'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                call(customerPhone).catch(console.error)
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
            Khoảng cách:{' '}
            {lastestOrder != undefined
              ? lastestOrder.distance + ' km'
              : 'Loading...'}
          </Text>

          <View
            style={{
              paddingTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => cancelTheOrder()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white', paddingLeft: 10 }}>Huỷ đơn</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => {
                acceptTheOrder()
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white', paddingLeft: 10 }}>
                  Chấp nhận đơn
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
