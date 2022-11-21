import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'

export function OrderItem({ value, navigation }) {
  return (
    <View
      style={styles.item}
      onStartShouldSetResponder={() => {
        navigation.navigate('OrderItemDetail', {
          value: value,
        })
      }}
    >
      {/* <AntDesign name="checkcircle" size={24} color="black" />
       <AntDesign name="closecircle" size={24} color="black" /> */}
      {value.status == 5 && (
        <AntDesign name="checkcircle" size={24} color="green" />
      )}
      {value.status == 9 && (
        <AntDesign name="closecircle" size={24} color="#E94730" />
      )}
      {(value.status == 3 || value.status == 2) && (
        <MaterialIcons name="pending" size={24} color="#E94730" />
      )}
      <Text style={styles.title}>{value.id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
})
