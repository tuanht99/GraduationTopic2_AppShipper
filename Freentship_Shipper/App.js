import HomePage from './src/screens/HomePage'
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <HomePage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  }
});