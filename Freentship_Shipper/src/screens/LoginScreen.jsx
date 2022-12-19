import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Image
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import React, { useEffect, useState, useRef } from 'react';
import app, { auth } from '../services/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/config';

import {
    getAuth,
    RecaptchaVerifier,
    FirebaseRecaptchaVerifierModal,
    PhoneAuthProvider
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoginScreen({ navigation }) {
    const [value, setValue] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [valid, setValid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef(null);
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userID');
            if (value !== null) {
                const docRef = doc(db, 'shippers', value + '');
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data());
                if (docSnap.exists() && docSnap.data().isActivated == true) {
                    navigation.navigate('LocationScreen');
                }
            }
        } catch (e) {
            console.log(12444);
        }
    };

    getData();
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <SafeAreaView style={styles.wrapper}>
                    <Image
                        source={require('../../src/assets/logo_shipper.png')}
                        style={{ width: 120, height: 120, marginBottom: 10 }}
                    ></Image>
                    {showMessage && (
                        <View style={styles.message}>
                            {!valid ? (
                                <Text style={{ color: 'red' }}>
                                    Nhập SĐT sai cú pháp!
                                </Text>
                            ) : (
                                setShowMessage(false)
                            )}
                        </View>
                    )}
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="VN"
                        layout="first"
                        onChangeText={setValue}
                        onChangeFormattedText={setFormattedValue}
                        withDarkTheme
                        withShadow
                        autoFocus
                        placeholder="Nhập SĐT ở đây..."
                        countryPickerProps={{}}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            const checkValid = phoneInput.current?.isValidNumber(
                                value
                            );
                            setShowMessage(true);
                            setValid(checkValid ? checkValid : false);
                            if (checkValid) {
                                navigation.navigate('ConfirmOTP', {
                                    phoneNumber: formattedValue
                                });
                            }
                        }}
                    >
                        <Text style={{ color: 'white' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginTop: 20,
        height: 50,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E94730',
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: {
            width: 1,
            height: 5
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 14
    },
    redColor: {
        backgroundColor: '#F57777'
    },
    message: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
});
