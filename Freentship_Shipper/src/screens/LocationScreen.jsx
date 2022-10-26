import React from 'react'
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import * as Location from 'expo-location'

export const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = React.useState(null)
  const [errorMsg, setErrorMsg] = React.useState(null)
  const [isCheckedLocation, setIsCheckedLocation] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
      } else {
        try {
          let locationTemp = await Location.getCurrentPositionAsync({})
          const locationAddress = await Location.reverseGeocodeAsync({
            latitude: locationTemp.coords.latitude,
            longitude: locationTemp.coords.longitude,
          })
          await setLocation({
            latitude: locationTemp.coords.latitude,
            longitude: locationTemp.coords.longitude,
            address: `${locationAddress[0].streetNumber}, ${locationAddress[0].street}, ${locationAddress[0].subregion}, ${locationAddress[0].region}, ${locationAddress[0].country}`,
          })
        } catch (e) {
          if (!location) {
            Alert.alert(
              'Thông báo',
              'Bạn vui lòng cho phép truy cập vị trí của bạn để sử dụng ứng dụng',
              [
                {
                  text: 'Đồng ý',
                  style: 'cancel',
                },
              ],
            )
          }
        }
      }
    })()
  }, [isCheckedLocation])

  React.useEffect(() => {
    if (location) {
      navigation.navigate('HomeNavigation', { location: location })
    }
  }, [location])

  let text = 'Vui lòng cho phép truy cập vị trí'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Button
        title={'Lấy vị trí'}
        onPress={() => setIsCheckedLocation(!isCheckedLocation)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
