import { Platform, PixelRatio } from 'react-native';

export function getPixelSize(pixels) {
    return Platform.select({
        ios: pixels,
        android: PixelRatio.getPixelSizeForLayoutSize(pixels)
    });
}
export const KEY = 'AIzaSyBcQPt2HX3mEIcgARRTYwtJPv0yzDPsWGM';
