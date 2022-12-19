import React from 'react';
import { View } from 'react-native';
import { Map } from '../components';
import { useSelector } from "react-redux";
import * as Location from 'expo-location';

export const MapScreen = ({ route }) => {
    const location = useSelector(state => state.locUser)
    const { customer, foodStore, lastestOrder, shipperID } = route.params;
    const [locationUser, setLocationUser] = React.useState(null);
    React.useEffect(() => {
        ;(async () => {
            setLocationUser(await Location.geocodeAsync(customer.address, {}))
        })()
    }, [])
    console.log('a', locationUser)
    return (
        <View style={{ flex: 1 }}>
            {locationUser !== null ? <Map shipperID={shipperID} location={location} locationCustomer={locationUser} foodStore={foodStore}
                  lastestOrder={lastestOrder}/> : null}
        </View>
    );
};