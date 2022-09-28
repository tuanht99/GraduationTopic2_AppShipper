import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getFirestore, doc, getDoc } from  'firebase/firestore';
import { db } from "./src/services/config"

export default async function App() {
  const colRef = collection(db, "categories");
try {
    const docsSnap = await getDocs(colRef);
    if(docsSnap.docs.length > 0) {
       docsSnap.forEach(doc => {
          console.log(doc.data());
          console.log(doc.id);
       })
    }
} catch (error) {
    console.log(error);
}
 try {
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        console.log(docSnap.data());
    } else {
        console.log("Document does not exist")
    }

} catch(error) {
    console.log(error)
};

}
