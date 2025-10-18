import Geolocation from '@react-native-community/geolocation';
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Linking, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

function GeoTagModal({isRwh=false}) {
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [geoTagData,setGeoTagData] = useState([{}]);
    const sides = isRwh ? ["left","right","Water Harvesting"]:["left","right","front"];

    const getCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const openLocationSettings = () => {
        if (Platform.OS === 'android') {
            Linking.openSettings();
        } else {
            Linking.openURL('app-settings:');
        }
    };
    
    const capturePhoto = async photoIndex => {
        const locationPermission = await getLocationPermission();
        if (!locationPermission) {
        Alert.alert(
            'Location Permission Required',
            'This app needs location access to capture photos with location data.',
            [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
            { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
            ],
        );
        return;
        }

        const cameraPermission = await getCameraPermission();
        if (!cameraPermission) {
        Alert.alert(
            'Camera Permission Required',
            'Camera permission is required to capture photos.',
            [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
            { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
            ],
        );
        return;
        }

        Geolocation.getCurrentPosition(
        pos => {
            setLocation(pos.coords);
            launchCamera({ mediaType: 'photo' }, res => {
            if (res.didCancel || !res.assets) return;
            const photo = res.assets[0];
            if (photoIndex === 'left') setLeft(photo);
            if (photoIndex === 'right') setRight(photo);
            if (photoIndex === 'front') setFront(photo);
            });
        },
        () => {
            Alert.alert('Location Error', 'Unable to get current location.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
            { text: 'Retry', onPress: () => capturePhoto(photoIndex) },
            ]);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };
    return (
        <>
            {/* Location & Photos */}
            <View style={styles.locationPhotoCard}>
                <Text style={styles.locationPhotoTitle}>Photo & Location</Text>
                {loadingLocation ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : !location ? (
                    <>
                        <TouchableOpacity
                            style={styles.getLocationButton}
                            onPress={() => {
                                getLocationPermission().then(granted => {
                                    if (!granted) {
                                        Alert.alert(
                                            'Location Required',
                                            'Please enable location services.',
                                        );
                                        return;
                                    }
                                    setLoadingLocation(true);
                                    Geolocation.getCurrentPosition(
                                        pos => {
                                            setLocation(pos.coords);
                                            setLoadingLocation(false);
                                        },
                                        () => {
                                            setLoadingLocation(false);
                                            Alert.alert('Error', 'Unable to fetch location');
                                        },
                                        {
                                            enableHighAccuracy: true,
                                            timeout: 60000,
                                            maximumAge: 30000,
                                        },
                                    );
                                });
                            }}
                        >
                            <Text style={styles.getLocationButtonText}>
                                📍 Get Current Location
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.locationHelpText}>
                            * Location is required before capturing photos
                        </Text>
                    </>
                ) : (
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationLabel}>
                            📍 Location Captured
                        </Text>
                        <View style={styles.coordinatesBox}>
                            <View style={styles.coordinateRow}>
                                <Text style={styles.coordinateLabel}>Latitude:</Text>
                                <Text style={styles.coordinateValue}>
                                    {location.latitude.toFixed(6)}
                                </Text>
                            </View>
                            <View style={styles.coordinateRow}>
                                <Text style={styles.coordinateLabel}>Longitude:</Text>
                                <Text style={styles.coordinateValue}>
                                    {location.longitude.toFixed(6)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.photosGrid}>
                            {['left', 'right', 'front'].map(side => {
                                const photo =
                                    side === 'left'
                                        ? left
                                        : side === 'right'
                                            ? right
                                            : front;
                                const setPhoto =
                                    side === 'left'
                                        ? setLeft
                                        : side === 'right'
                                            ? setRight
                                            : setFront;
                                return (
                                    <View key={side} style={styles.photoItem}>
                                        <Text style={styles.photoLabel}>
                                            {side.charAt(0).toUpperCase() + side.slice(1)}
                                        </Text>
                                        {photo ? (
                                            <View style={styles.photoWrapper}>
                                                <Image
                                                    source={{ uri: photo.uri }}
                                                    style={styles.photoImage}
                                                />
                                                <TouchableOpacity
                                                    style={styles.photoDeleteButton}
                                                    onPress={() => setPhoto(null)}
                                                >
                                                    <Text style={styles.photoDeleteText}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.captureButton}
                                                onPress={() => capturePhoto(side)}
                                            >
                                                <Text style={styles.captureButtonIcon}>📷</Text>
                                                <Text style={styles.captureButtonText}>
                                                    Capture
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
            </View>
        </>
    )
}

export default GeoTagModal;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    tableCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111',
        textAlign: 'center',
    },
    tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
    tableRowEven: { backgroundColor: '#f9f9f9' },
    tableRowOdd: { backgroundColor: '#fff' },
    tableHeader: {
        backgroundColor: '#007AFF',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    tableHeaderText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    tableCellLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#333' },
    tableCellValue: { flex: 1, fontSize: 14, color: '#000', textAlign: 'right' },

    remarksContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    remarksTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111',
        textAlign: 'center',
    },
    remarksBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    remarksText: { fontSize: 14, color: '#333', lineHeight: 20 },

    locationPhotoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    locationPhotoTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111',
        textAlign: 'center',
    },
    getLocationButton: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    getLocationButtonText: { color: '#fff', fontWeight: 'bold' },
    locationHelpText: { fontSize: 12, color: 'gray', textAlign: 'center' },
    locationInfo: { marginTop: 10 },
    locationLabel: { fontWeight: '600', fontSize: 14 },
    coordinatesBox: { padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 },
    coordinateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    coordinateLabel: { fontWeight: '600' },
    coordinateValue: { fontWeight: '400', color: '#333' },

    photosGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    photoItem: { width: '30%', alignItems: 'center', marginBottom: 12 },
    photoLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
    photoWrapper: { position: 'relative' },
    photoImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    photoDeleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#ff4444',
        borderRadius: 12,
        paddingHorizontal: 4,
    },
    photoDeleteText: { color: '#fff', fontWeight: 'bold' },
    captureButton: {
        backgroundColor: '#eff7feff',
        padding: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    captureButtonIcon: { color: '#fff', fontSize: 20 },
    captureButtonText: { color: '#fff', fontSize: 12 },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    disabledButton: {
        backgroundColor: '#ccc',
    },

    extraFloorCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    extraFloorTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
    floorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    floorLabel: { fontWeight: '600' },
});
