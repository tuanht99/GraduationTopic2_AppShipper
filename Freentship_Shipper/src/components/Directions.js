import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { KEY } from '../utils';

export const Directions = ({
    // eslint-disable-next-line react/prop-types
    destination,
    // eslint-disable-next-line react/prop-types
    origin,
    // eslint-disable-next-line react/prop-types
    onReady,
    // eslint-disable-next-line react/prop-types
    color = '#222',
    // eslint-disable-next-line react/prop-types
    optimizeWaypoints = true,
    // eslint-disable-next-line react/prop-types
    mode = 'DRIVING'
}) => (
    <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey={KEY}
        strokeWidth={4}
        strokeColor={color}
        waypoints={optimizeWaypoints ? [destination] : []}
        optimizeWaypoints={optimizeWaypoints}
        mode={mode}
    />
);
