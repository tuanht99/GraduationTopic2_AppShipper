import React, { Component, Fragment } from 'react';
import {
    Button,
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { Directions } from '../Directions';
import { UpdateShipper } from '../../services/shipers';
// import { KEY } from '../../../key';
// import { getPixelSize } from '../../utils';

import markerImageShop from '../../assets/shop.png';
import SvgArrowDirections from '../../assets/arrow-directions.svg';
// import markerImageBike from '../../assets/bike.png';

// Geocoder.init(KEY);

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let carts = [
    {
        id: '2a0HmLolzLzkazuwjBu3',
        name: 'CƠM TRỘN HÀN QUỐC 188',
        storeLocation: {
            latitude: 10.7613952,
            longitude: 106.6821874
        }
    },
    {
        id: '4dpAvRWJVrvdbml9vKDL',
        name: 'Bánh bột lọc O Hương',
        storeLocation: {
            latitude: 10.774335290382156,
            longitude: 106.55262099784558
        }
    }
];

export class Map extends Component {
    state = {
        curLoc: {
            latitude: 10.8511574,
            longitude: 106.7579434
        },
        coordinate: new AnimatedRegion({
            latitude: 10.8511574,
            longitude: 106.7579434,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        destination: {
            latitude: carts[0].storeLocation.latitude,
            longitude: carts[0].storeLocation.longitude,
            title: carts[0].name
        },
        duration: 0,
        distance: 0,
        location: null,
        count: 0,
        heading: 0,
        isMiddle: true,
        speed: 0,
        statusShipper: [],
        took: 0,
        user: {
            location: {
                latitude: 10.950358503375979,
                longitude: 106.73584800514023
            }
        }
    };
    updateShipper = (location, status, heading) => {
        UpdateShipper('1Xi8FCf7RzdWT48YJJCDboJUVh33', {
            location: location,
            statusShipper: status,
            heading,
            took: this.state.took
        })
            .then(() => console.log('ok'))
            .catch(() => console.log('error'));
    };
    handleTook = () => {
        const { took, statusShipper, curLoc, user } = this.state;
        if (took !== statusShipper.length) {
            statusShipper[took].status = true;

            this.setState({
                statusShipper,
                took: took + 1,
                destination:
                    took === statusShipper.length - 1
                        ? {
                              latitude: user.location.latitude,
                              longitude: user.location.longitude,
                              title: 'Khách hàng'
                          }
                        : {
                              latitude: carts[took + 1].storeLocation.latitude,
                              longitude:
                                  carts[took + 1].storeLocation.longitude,
                              title: carts[took + 1].name
                          }
            });
        } else {
            console.log('Bạn đã giao hàng xong');
        }
        this.updateShipper(curLoc, statusShipper, this.state.heading);
    };

    async componentDidMount() {
        console.log('componentDidMount');

        const statusShipper = [];
        carts.forEach(item => {
            statusShipper.push({
                id: item.id,
                name: item.name,
                location: item.storeLocation,
                status: false
            });
        });
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let locationTemp = await Location.getCurrentPositionAsync({});
        let heading = await Location.getHeadingAsync();
        let { latitude, longitude, speed } = locationTemp.coords;
        this.updateShipper(
            { latitude, longitude },
            statusShipper,
            heading.trueHeading
        );
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));
        this.animate(latitude, longitude);
        this.setState({
            heading: heading.trueHeading,
            location,
            statusShipper,
            speed: speed.toFixed(0),
            curLoc: {
                latitude,
                longitude
            },
            coordinate: {
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
        return Location.watchPositionAsync(
            {
                // accuracy: Location.Accuracy.BestForNavigation,
                // timeInterval: 6000,
                // distanceInterval: 6
                accuracy: Location.Accuracy.High,
                timeInterval: 1000,
                distanceInterval: 1
            },
            updateLocation => {
                this.setState({
                    heading: updateLocation.coords.heading,
                    curLoc: {
                        latitude: updateLocation.coords.latitude,
                        longitude: updateLocation.coords.longitude
                    },
                    coordinate: {
                        latitude: updateLocation.coords.latitude,
                        longitude: updateLocation.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    },
                    speed: updateLocation.coords.speed.toFixed(0)
                });
            }
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { curLoc, statusShipper } = this.state;
        if (curLoc !== prevState.curLoc) {
            this.updateShipper(curLoc, statusShipper, this.state.heading);
        }
    }

    handleCountClick = () => {
        this.setState({ isMiddle: true });
    };
    handleCountClick2 = () => {
        this.setState({ isMiddle: false });
    };

    updateState = data => this.setState(state => ({ ...state, ...data }));

    animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS === 'android') {
            if (this.markerRef.current) {
                this.markerRef.current.animateMarkerToCoordinate(
                    newCoordinate,
                    7000
                );
            }
        } else {
            this.state.coordinate.timing(newCoordinate).start();
        }
    };

    fetchTime = (d, t, s) => {
        console.log('s', s);
        this.updateState({
            distance: d.toFixed(3),
            duration: t.toFixed(0)
        });
    };

    render() {
        const {
            coordinate,
            destination,
            duration,
            location,
            count,
            distance,
            curLoc,
            heading,
            isMiddle,
            statusShipper,
            took
        } = this.state;
        return (
            <View style={styles.container}>
                {isMiddle ? (
                    <MapView
                        style={{ width: screen.width, height: screen.height }}
                        ref={el => (this.mapView = el)}
                        // showsUserLocation
                        // followsUserLocation
                        mapType={'terrain'}
                        onPanDrag={this.handleCountClick2}
                        region={{
                            ...curLoc,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}
                    >
                        {/*<Marker.Animated*/}
                        {/*    ref={el => (this.markerRef = el)}*/}
                        {/*    coordinate={coordinate}*/}
                        {/*    anchor={{ x: 0.5, y: 0.5 }}*/}
                        {/*>*/}
                        {/*    <Image*/}
                        {/*        source={markerImageBike}*/}
                        {/*        style={[*/}
                        {/*            styles.markerImage,*/}
                        {/*            { transform: [{ rotate: `${heading}deg` }] }*/}
                        {/*        ]}*/}
                        {/*        resizeMode="contain"*/}
                        {/*    />*/}
                        {/*</Marker.Animated>*/}
                        {destination && (
                            <Fragment>
                                <Directions
                                    origin={curLoc}
                                    destination={destination}
                                    onReady={result => {
                                        this.fetchTime(
                                            result.distance,
                                            result.duration,
                                            result.speed
                                        );
                                        // this.mapView.fitToCoordinates(
                                        //     result.coordinates,
                                        //     {
                                        //         edgePadding: {
                                        //             // right: 0,
                                        //             // left: 0,
                                        //             // top: 0,
                                        //             // bottom: 0
                                        //         }
                                        //     }
                                        // );
                                    }}
                                />
                                <Marker.Animated
                                    ref={el => (this.markerRef = el)}
                                    coordinate={curLoc}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <SvgArrowDirections
                                        width={60}
                                        height={60}
                                        style={{
                                            transform: [
                                                { rotate: `${heading}deg` }
                                            ]
                                        }}
                                    />
                                </Marker.Animated>
                                <Marker coordinate={destination}>
                                    <Image
                                        style={styles.markerImage}
                                        source={markerImageShop}
                                    />
                                </Marker>
                            </Fragment>
                        )}
                    </MapView>
                ) : (
                    <MapView
                        style={{ width: screen.width, height: screen.height }}
                        ref={el => (this.mapView = el)}
                        showsUserLocation
                        followsUserLocation
                        mapType={'terrain'}
                        // rotateEnabled={false}
                        nitialRegion={{
                            ...curLoc,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}
                    >
                        {/*<Marker.Animated*/}
                        {/*    ref={el => (this.markerRef = el)}*/}
                        {/*    coordinate={coordinate}*/}
                        {/*    anchor={{ x: 0.5, y: 0.5 }}*/}
                        {/*>*/}
                        {/*    <Image*/}
                        {/*        source={markerImageBike}*/}
                        {/*        style={[*/}
                        {/*            styles.markerImage,*/}
                        {/*            { transform: [{ rotate: `${heading}deg` }] }*/}
                        {/*        ]}*/}
                        {/*        resizeMode="contain"*/}
                        {/*    />*/}
                        {/*</Marker.Animated>*/}
                        {destination && (
                            <Fragment>
                                <Directions
                                    origin={curLoc}
                                    destination={destination}
                                    onReady={result => {
                                        this.fetchTime(
                                            result.distance,
                                            result.duration
                                        );
                                        // this.mapView.fitToCoordinates(
                                        //     result.coordinates,
                                        //     {
                                        //         edgePadding: {
                                        //             // right: 0,
                                        //             // left: 0,
                                        //             // top: 0,
                                        //             // bottom: 0
                                        //         }
                                        //     }
                                        // );
                                    }}
                                />
                                <Marker.Animated
                                    ref={el => (this.markerRef = el)}
                                    coordinate={curLoc}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <SvgArrowDirections
                                        width={60}
                                        height={60}
                                        style={{
                                            transform: [
                                                { rotate: `${heading}deg` }
                                            ]
                                        }}
                                    />
                                </Marker.Animated>
                                <Marker coordinate={destination}>
                                    <Image
                                        style={styles.markerImage}
                                        source={markerImageShop}
                                    />
                                </Marker>
                            </Fragment>
                        )}
                    </MapView>
                )}
                <View style={styles.containerBottom}>
                    <View style={styles.containerBottomLeft}>
                        <View>
                            <Text style={{ textAlign: 'center' }}>
                                {duration}
                            </Text>
                            <Text>MIN</Text>
                        </View>
                        <View>
                            <Text>{distance}</Text>
                            <Text style={{ textAlign: 'center' }}>KM</Text>
                        </View>
                    </View>
                    <View style={styles.containerBottomRight}>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 16,
                                marginBottom: 10
                            }}
                        >
                            {location}
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 10
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                Tổng của hàng:{' '}
                                {`${took}/${statusShipper.length}`}
                            </Text>
                            {took !== statusShipper.length ? (
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 4,
                                        marginStart: 10,
                                        backgroundColor: '#59C1BD',
                                        borderWidth: 1,
                                        borderColor: '#181818',
                                        borderRadius: 4
                                    }}
                                    onPress={this.handleTook}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#E7FEFC'
                                        }}
                                    >
                                        Đã lấy đồ ăn
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => console.log('test 1')}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 4,
                                        marginStart: 10,
                                        backgroundColor: '#59C1BD',
                                        borderWidth: 1,
                                        borderColor: '#181818',
                                        borderRadius: 4
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#E7FEFC'
                                        }}
                                    >
                                        Đã giao đồ ăn
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                {!isMiddle && (
                    <TouchableOpacity
                        onPress={this.handleCountClick}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            position: 'absolute',
                            bottom: 120,
                            left: 20,
                            backgroundColor: '#F8FFDB',
                            padding: 10,
                            borderRadius: 10,
                            borderWidth: 1
                        }}
                    >
                        <Ionicons
                            name="navigate-sharp"
                            size={24}
                            color="black"
                        />
                        <Text>Về giữa</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    markerImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    containerBottom: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        marginHorizontal: 20
    },
    containerBottomLeft: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#59C1BD',
        borderTopStartRadius: 10,
        borderBottomStartRadius: 10,
        paddingVertical: 10
    },
    containerBottomRight: {
        flex: 0.7,
        justifyContent: 'center',
        backgroundColor: '#B3FFAE',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        paddingVertical: 10
    }
});
