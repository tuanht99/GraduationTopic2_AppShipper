import { View, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { Avatar, Text } from 'react-native-paper'

export default function ChatSample({ value, shipperID, avatar }) {
  if (value.userID !== shipperID) {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 10,
        }}
      >
        <Avatar.Image
          size={24}
          style={{ alignSelf: 'center', marginRight: 5 }}
          source={{
            uri: avatar,
          }}
        />
        <Text style={[styles.user1, styles.user]}>{value.chatContent}</Text>
      </View>
    )
  } else {
    return (
      <View style={{ alignItems: 'flex-end', paddingBottom: 10 }}>
        <Text style={[styles.user2, styles.user]}>{value.chatContent}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  user: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  user1: {
    backgroundColor: '#D2D2CF',
  },
  user2: {
    backgroundColor: '#E94730',
    color: 'white',
  },
})
