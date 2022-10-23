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
  // Constants declaration
  const shipperID = 'mzVAqynSkWk0KV0LZg0j' // Shipper ID - Get after authentication
  const [lastestOrder, setLastestOrder] = useState([]) // The lastest order if exists
  const [lastestOrderID, setLastestOrderID] = useState('') // Get the lastest order ID if exsists
  const [orderState, setOrderState] = useState([]) // Get all the order state
  const [foodStore, setFoodStore] = useState([]) // Foodstore information
  const [customer, setCustomer] = useState([]) // Customer information
  const foodStorePhone = {
    // Config when making a phone call with food store
    number: foodStore.phone, // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  }
  const customerPhone = {
    // Config when making a phone call with customer
    number: customer.phone, // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  }

  // Cancel the order notification
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
  // Cancle order function
  const cancelOrder = async () => {
    // Change order state when cancel
    const orderState = doc(db, 'orders', lastestOrder.id + '')
    await updateDoc(orderState, {
      status: 2,
    })
    // Change shipper lastest order id
    const cacelOrder = doc(db, 'shippers', shipperID + '')
    await updateDoc(cacelOrder, {
      lastest_order_id: '',
    })
  }

  // Accept the order
  const acceptTheOrder = async () => {
    const orderState = doc(db, 'orders', lastestOrder.id + '')
    await updateDoc(orderState, {
      status: 3,
    })
  }

  // Get lastest order ID
  useEffect(() => {
    const getLastestOrderID = onSnapshot(
      doc(db, 'shippers', shipperID + ''),
      (item) => {
        setLastestOrderID(item.data().lastest_order_id)
        console.log(item.data().lastest_order_id)
      },
    )
  }, [])

  // Get lastest order
  useEffect(() => {
    console.log(lastestOrderID)
    // // Get lastest order
    // const getLastestOrder = onSnapshot(
    //   doc(db, 'orders', lastestOrderID),
    //   (item) => {
    //     setLastestOrder({ id: item.id, ...item.data() })
    //   },
    // )
    // getLastestOrder()

    // // Get status list
    // const q = query(collection(db, 'order_status'))
    // const getOrderStatusList = onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     setOrderState((orderState) => [...orderState, doc.data().value])
    //   })
    // })
    // getOrderStatusList()

    // // Get user information
    // const user = onSnapshot(
    //   doc(db, 'users', lastestOrder.user_id + ''),
    //   (item) => {
    //     setCustomer({ id: item.id, ...item.data() })
    //   },
    // )
    // user()

    // // Get food store information
    // const foodStore = onSnapshot(
    //   doc(db, 'food_stores', lastestOrder.food_store_id + ''),
    //   (item) => {
    //     setFoodStore({ id: item.id, ...item.data() })
    //   },
    // )
    // foodStore()
  }, [lastestOrderID])

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
