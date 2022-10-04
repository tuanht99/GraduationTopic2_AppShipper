import ReadyForOrderToggle from '../components/ReadyForOrderToggle'
import {
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Switch,
} from 'react-native'
import React from 'react'

export default function HomePage() {
  return (
    <View>
      <ReadyForOrderToggle />
    </View>
  )
}

const styles = StyleSheet.create({})
