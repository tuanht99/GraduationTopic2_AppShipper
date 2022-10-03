import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from "./src/services/config"
import { setDoc, addDoc, collection } from "firebase/firestore";
import { Button } from 'react-native-web';


export default function App() {
  function create() {
    addDoc(collection(db, "categories"), {
      danhmuc: "con cuu",
    });

  }

  return (
    <View>
      <Button
        onPress={create}
        title="Learn More"

      />
    </View>

  );
}
