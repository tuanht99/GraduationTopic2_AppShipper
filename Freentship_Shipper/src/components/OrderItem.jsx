import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'

export function OrderItem({ title }) {
  return (
    <View style={styles.item}>
      <TouchableRipple
        rippleColor="rgba(233, 71, 48, 1)"
        onPress={() => console.log('Pressed')}
      >
        <AntDesign name="checkcircle" size={24} color="black" />
        <Text style={styles.title}>{title}</Text>
      </TouchableRipple>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
})
