// GeoTagModal.jsx
import Geolocation from '@react-native-community/geolocation';
import React, { useState } from 'react';
import { Alert, Linking, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
// Import the new components
import LocationStatusCard from '../../../../Components/LocationStatusCard';
import PhotoCaptureGrid from '../../../../Components/PhotoCaptureGrid';

const INITIAL_GEOTAG_STATE = { left: null, right: null, front: null, 'Water Harvesting': null };

function GeoTagModal({
    isRwh = false,
    onChange = () => { },
    onClose = () => { }
}) {
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [geoTagData, setGeoTagData] = useState(INITIAL_GEOTAG_STATE);

    const sidesToRender = isRwh ? ["left", "right", "Water Harvesting"] : ["left", "right", "front"];

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


    const handleLocationFetch = async () => {
        const granted = await getLocationPermission();
        if (!granted) {
            Alert.alert(
                'Location Required',
                'Please enable location services and grant permission.',
                [{ text: 'Open Settings', onPress: openLocationSettings }, { text: 'Cancel' }],
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
            { enableHighAccuracy: true, timeout: 60000, maximumAge: 30000 },
        );
    };

    const capturePhoto = async sideKey => {
        if (!location) return Alert.alert('Error', 'Please capture location first.');

        const cameraPermission = await getCameraPermission();
        if (!cameraPermission) {
            Alert.alert(
                'Camera Permission Required',
                'Camera permission is required to capture photos.',
                [{ text: 'Open Settings', onPress: openLocationSettings }, { text: 'Cancel' }],
            );
            return;
        }
        
        launchCamera({ mediaType: 'photo', saveToPhotos: false }, res => {
            if (res.didCancel || res.errorCode || !res.assets || res.assets.length === 0) {
                console.log('Camera cancelled or failed:', res.errorMessage);
                return;
            }

            const photo = res.assets[0];
            
            setGeoTagData(prevData => {
                const newGeoTagData = {
                    ...prevData,
                    [sideKey]: {
                        ...photo,
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                };
                onChange(newGeoTagData);
                return newGeoTagData;
            });
        });
    };

    const removePhoto = (sideKey) => {
        setGeoTagData(prevData => {
            const newGeoTagData = { ...prevData, [sideKey]: null };
            onChange(newGeoTagData);
            return newGeoTagData;
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContentWrapper}>
                <View style={[styles.locationPhotoCard, styles.modalCard]}>
                    <Text style={styles.locationPhotoTitle}>Photo & Location</Text>

                    <LocationStatusCard
                        location={location}
                        loadingLocation={loadingLocation}
                        onGetLocation={handleLocationFetch}
                        openLocationSettings={openLocationSettings}
                    />

                    {location && (
                        <>
                            <PhotoCaptureGrid
                                sidesToRender={sidesToRender}
                                geoTagData={geoTagData}
                                location={location}
                                capturePhoto={capturePhoto}
                                removePhoto={removePhoto}
                            />

                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={onClose}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

export default GeoTagModal;

// --- Main Modal Styles ---
const styles = StyleSheet.create({
    modalContentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
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
    modalCard: {
        width: '90%', 
        maxHeight: '80%',
        padding: 20,
    },
    locationPhotoTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111',
        textAlign: 'center',
    },
    doneButton: {
        backgroundColor: '#28a745', // Green for done/submit
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});