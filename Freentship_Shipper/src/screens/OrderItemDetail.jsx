import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Text,
  Image,
  StyleSheet,
  View,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native'
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import PhoneIcon from '../assets/icons/phone_icon.svg'
import UserLocationIcon from '../assets/icons/user-location-icon.svg'
import { db } from '../services/config'
import { async } from '@firebase/util'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SvgTest from '../assets/icons/logo-shipper.svg'
import FoodStoreLocationIcon from '../assets/icons/food_store_location.svg'

export function OrderItemDetail({ route, navigation }) {
  const { value } = route.params
  const [orderState, setOrderState] = useState(null) // Get all the order state
  const [foodStore, setFoodStore] = useState(null) // Foodstore information
  const [customer, setCustomer] = useState(null) // Customer information

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
    const orderState = doc(db, 'orders', value.id + '')
    await updateDoc(orderState, {
      status: 2,
      shipper_id: '',
    })
    // Change shipper lastest order id
    const cacelOrder = doc(db, 'shippers', value.shipper_id + '')
    await updateDoc(cacelOrder, {
      lastestOrderID: '',
    })

    navigation.goBack()
  }

  // Accept the order
  const acceptTheOrder = async () => {
    const orderState = doc(db, 'orders', value.id + '')
    await updateDoc(orderState, {
      status: 3,
    })
  }

  useEffect(() => {
    if (value != null) {
      // Get status list
      const q = query(collection(db, 'order_status'))
      const getOrderStatusList = onSnapshot(q, (querySnapshot) => {
        let statusList = []
        querySnapshot.forEach((doc) => {
          statusList.push(doc.data().value)
        })
        setOrderState(statusList)
      })

      // Get user information
      const user = onSnapshot(doc(db, 'users', value.user_id + ''), (item) => {
        setCustomer({ id: item.id, ...item.data() })
      })
      // Get food store information
      const foodStore = onSnapshot(
        doc(db, 'food_stores', value.food_store_id + ''),
        (item) => {
          setFoodStore({ id: item.id, ...item.data() })
        },
      )
    }
  }, [])
  return (
    <View style={styles.container}>
      {/* Logo app shipper */}
      <SvgTest width={50} height={50} style={styles.logo} />
      {/* Ready-For-Order Switch */}
      {/* Order detail */}
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
        }}
      >
        <View>
          <Text style={{ fontSize: 20 }}>
            Mã đơn hàng: {value.id != '' ? value.id : 'Loading...'}
          </Text>
          <Text style={{ fontSize: 20 }}>
            Trạng thái:{'\n'}
            {value != null && orderState != null
              ? orderState[value.status - 1]
              : 'Loading...'}
          </Text>
          <Text style={{ fontSize: 20 }} type="money">
            Tiền cần thu:{' '}
            {value.id != null
              ? value.totalPrice - value.deposit + ' VND'
              : 'Loading... '}
          </Text>
        </View>
        {/* Location */}
        <View style={styles.locationPane}>
          {/* Food store address */}
          <View style={{ flexDirection: 'row' }}>
            <FoodStoreLocationIcon />
            <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: 'bold' }}>
              {foodStore != null ? foodStore.name : 'Loading...'}
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
              {foodStore != null ? foodStore.address : 'Loading...'}
            </Text>
            {/* Contact via phone */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (foodStore != null) {
                  const foodStorePhone = {
                    // Config when making a phone call with food store
                    number: foodStore.phone + '', // String value with the number to call
                    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                    skipCanOpen: true, // Skip the canOpenURL check
                  }
                  call(foodStorePhone).catch(console.error)
                }
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
              {customer != null ? customer.name : 'loading...'}
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
              {customer != null ? customer.address : 'Loading...'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (customer != null) {
                  const customerPhone = {
                    // Config when making a phone call with customer
                    number: customer.phone + '', // String value with the number to call
                    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                    skipCanOpen: true, // Skip the canOpenURL check
                  }
                  call(customerPhone).catch(console.error)
                }
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
            Khoảng cách: {value != null ? value.distance + ' km' : 'Loading...'}
          </Text>

          <View
            style={{
              paddingTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {value.status == 3 && (
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => cancelTheOrder()}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'white', paddingLeft: 10 }}>
                    Huỷ đơn
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {value.status == 3 && (
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
            )}
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
