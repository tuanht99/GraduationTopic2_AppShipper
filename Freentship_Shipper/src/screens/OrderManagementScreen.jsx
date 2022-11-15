import { SafeAreaView } from 'react-native-safe-area-context'
import { View, FlatList, StyleSheet, Text, StatusBar } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../services/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from 'react-native-web'
import { TouchableRipple } from 'react-native-paper'
import { OrderItem } from '../components/OrderItem'

export default function OrderManagementScreen() {
  const renderItem = ({ item }) => <OrderItem title={item.id} />

  const [orders, setOrders] = useState()

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userID')
      if (value !== null) {
        const q = query(
          collection(db, 'orders'),
          where('shipper_id', '==', value),
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allOrders = []
          querySnapshot.forEach((doc) => {
            allOrders.push({ id: doc.id, ...doc.data() })
          })
          console.log(allOrders)
          setOrders(allOrders)
        })
      }
    } catch (e) {
      console.log(12444)
    }
  }

  useState(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 32,
  },
})
