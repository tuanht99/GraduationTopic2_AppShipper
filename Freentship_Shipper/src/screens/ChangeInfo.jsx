import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { db } from '../services/config'
import { storage, storageRef } from '../services/config'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { Paragraph, Dialog, Portal } from 'react-native-paper'
import { async } from '@firebase/util'

export default function ChangeInfo({ navigation }) {
  const [shipperName, setShipperName] = useState('')
  const [shipperPhone, setShipperPhone] = useState('')
  const [shipperDOB, setShipperDOB] = useState('')
  const [shipperSex, setShipperSex] = useState('')
  const [shipperCitizenID, setShipperCitizenID] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [shipperID, setShipperID] = useState('')
  const [shipper, setShipper] = useState()

  // Update shipper info
  const updateShipperInfo = async () => {
    const washingtonRef = doc(db, 'users', shipperID)

    await updateDoc(washingtonRef, {
      capital: true,
    })
  }

  // Get shipper's ID
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userID')
      if (value !== null) {
        setShipperID(value)
      }
    } catch (e) {
      console.log(12444)
    }
  }
  // Get shipper's avt
  const getShipperInfo = () => {
    const getAvt = onSnapshot(doc(db, 'users', shipperID), (doc) => {
      setShipper(doc.data())
      console.log(doc.data())
      setImage(doc.data().avatar)
    })
  }

  // Pick an avatar
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (result.granted === false) {
      alert('Permission to access camera roll is required!')
      console.log(111223)
      return
    }
    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  // Upload avatar
  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', image, true)
      xhr.send(null)
    })
    const refe = ref(storage, `avatar/shippers/${shipperID}`)
    const uploadTask = uploadBytesResumable(refe, blob)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          saveShipperAvtUrl(downloadURL)
        })
      },
    )
  }

  // Save shipper avt url after changed
  const saveShipperAvtUrl = async (url) => {
    const updateAvtUrl = doc(db, 'users', shipperID)

    // Set the "capital" field of the city 'DC'
    await updateDoc(updateAvtUrl, {
      avatar: url,
    })
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    //
    if (shipperID != '') getShipperInfo()
  }, [shipperID])

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          pickImage()
        }}
        style={{ alignSelf: 'center', paddingTop: 20 }}
      >
        <Avatar.Image size={150} source={{ uri: image }} />
      </TouchableOpacity>

      {shipper && (
        <>
          <TextInput
            label="Họ tên:"
            value={shipper.name}
            onChangeText={(shipperName) => setText(shipperName)}
          />
          <TextInput
            label="Số điện thoại:"
            value={shipper.phone}
            onChangeText={(shipperPhone) => setText(shipperPhone)}
          />
          <TextInput
            label="Ngày sinh:"
            value={'25/7/1999'}
            onChangeText={(shipperDOB) => setText(shipperDOB)}
          />
          <TextInput
            label="Giới tính:"
            value={shipper.sex}
            onChangeText={(shipperSex) => setText(shipperSex)}
          />
          <TextInput
            label="Mã CCCD:"
            value={shipper.citizenID}
            onChangeText={(shipperCitizenID) => setText(shipperCitizenID)}
          />
        </>
      )}

      {!uploading ? (
        <Button
          title="Lưu cập nhật"
          onPress={() => {
            uploadImage()
            ToastAndroid.show('Request sent successfully!', ToastAndroid.SHORT)
          }}
        />
      ) : (
        <ActivityIndicator size={'small'} color="black" />
      )}
    </SafeAreaView>
  )
}
