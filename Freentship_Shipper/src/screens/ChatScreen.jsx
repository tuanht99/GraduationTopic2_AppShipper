import { View, Text, FlatList, Keyboard } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'
import ChatSample from '../components/ChatSample'
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '../services/config'
import { useEffect } from 'react'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { async } from '@firebase/util'

export default function ChatScreen({ route }) {
  const { chatID } = route.params
  const [chat, setChat] = useState()
  const [shipperID, setShipperID] = useState('')
  const [message, setMessage] = useState('')

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userID')
      if (value !== null) {
        setShipperID(value)
      }
    } catch (e) {
      console.log('Can get the ID')
    }
  }

  const getChatContent = async () => {
    const unsub = onSnapshot(doc(db, 'chatting', chatID), (doc) => {
      setChat(doc.data())
    })
  }

  const updateMessage = async () => {
    if (chat === undefined) {
      await setDoc(doc(db, 'chatting', chatID + ''), {
        content: [],
      })
    }
    const washingtonRef = doc(db, 'chatting', chatID)

    await updateDoc(washingtonRef, {
      content: arrayUnion({
        chatContent: message,
        userID: shipperID,
      }),
    })
  }

  useEffect(() => {
    getData()
    getChatContent()
  }, [])

  const renderItem = ({ item, index }) => (
    <ChatSample
      index={index}
      value={item}
      shipperID={shipperID}
      avatar={
        'https://cdn.tgdd.vn/Files/2021/12/10/1403586/hinh-anh-vai-tro-con-ga-va-nhung-dieu-ban-chua-biet-202112101447151707.jpg'
      }
    />
  )
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 11 }}>
        {chat !== undefined ? (
          <FlatList
            style={{ padding: 10 }}
            data={chat.content}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <Text>Chưa có tin nhắn nào</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <TextInput
          onChangeText={setMessage}
          value={message}
          placeholder={'Nhập tin nhắn ở đây....'}
          right={
            <TextInput.Icon
              icon="send"
              color="#E94730"
              onPress={() => {
                setMessage('')
                updateMessage()
                Keyboard.dismiss()
              }}
              style={{ height: '100%' }}
            />
          }
        />
      </View>
    </SafeAreaView>
  )
}
