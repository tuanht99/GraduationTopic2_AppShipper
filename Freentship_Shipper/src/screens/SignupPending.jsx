import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'

export function SignupPending({ navigation }) {
  return (
    <SafeAreaView>
      <Text>
        Chúc mừng bạn đã đăng ký thành công.{'\n'}
        Vui lòng đến địa chỉ: 28A Hai Bà Trưng, P.Đa Kao, Q.1, TP.HCM để hoàn
        tất thủ tục.{'\n'}
        Xin chân thành cảm ơn!
      </Text>

      <Button
        buttonColor="#E94730"
        style={{ marginTop: 20 }}
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        OK
      </Button>
    </SafeAreaView>
  )
}
