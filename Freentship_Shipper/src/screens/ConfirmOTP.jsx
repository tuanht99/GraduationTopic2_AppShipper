import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from 'expo-firebase-recaptcha'
import { initializeApp, getApp } from 'firebase/app'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/config'
import app, { auth } from '../services/config'
import React, { useEffect, useState, useRef } from 'react'
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Double-check that we can run the example
if (!app?.options || Platform.OS === 'web') {
  throw new Error(
    'This example only works on Android or iOS, and requires a valid Firebase config.',
  )
}

export function ConfirmOTP({ route, navigation }) {
  // Ref or state management hooks
  const recaptchaVerifier = useRef(null)
  const { phoneNumber } = route.params
  const [verificationId, setVerificationId] = useState()
  const [verificationCode, setVerificationCode] = useState()

  const firebaseConfig = app ? app.options : undefined
  const [message, showMessage] = useState()
  const attemptInvisibleVerification = false
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('userID', auth.currentUser.uid)
    } catch (e) {
      // saving error
    }
  }
  const isActivatedAccount = () => {
    console.log('current', auth.currentUser.uid)
    storeData()
    const unsub = onSnapshot(
      doc(db, 'shippers', auth.currentUser.uid + ''),
      (doc) => {
        console.log('test', doc.data())
        if (doc.data() != undefined) {
          if (doc.data().isActivated == false)
            navigation.navigate('SignupPending')
          else navigation.navigate('LocationScreen')
        } else navigation.navigate('SignupScreen')
      },
    )
  }
  const sendVerificationCode = async () => {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    try {
      const phoneProvider = new PhoneAuthProvider(auth)
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber + '',
        recaptchaVerifier.current,
      )
      setVerificationId(verificationId)
      showMessage({
        text: 'Verification code has been sent to your phone.',
      })
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: 'red' })
    }
  }

  useEffect(() => {
    sendVerificationCode()
  }, [])

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // attemptInvisibleVerification
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        // editable={!!verificationId}
        placeholder="Nhập mã OTP ở đây..."
        keyboardType="numeric"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(
              verificationId,
              verificationCode,
            )
            await signInWithCredential(auth, credential)
            showMessage({ text: 'Phone authentication successful 👍' })
            isActivatedAccount()
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' })
            goBack()
          }
        }}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}
        >
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}
          >
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  )
}
