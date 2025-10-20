// LocationStatusCard.jsx
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LocationStatusCard = ({
    location,
    loadingLocation,
    onGetLocation, 
    openLocationSettings
}) => {
    
    if (loadingLocation) {
        return <ActivityIndicator size="large" color="#007AFF" />;
    }

    if (!location) {
        return (
            <>
                <TouchableOpacity
                    style={styles.getLocationButton}
                    onPress={onGetLocation}
                >
                    <Text style={styles.getLocationButtonText}>
                        📍 Get Current Location
                    </Text>
                </TouchableOpacity>
                <Text style={styles.locationHelpText}>
                    * Location is required before capturing photos
                </Text>
            </>
        );
    }
    
    // Location is captured
    return (
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
        </View>
    );
};


export default LocationStatusCard;

const styles = StyleSheet.create({
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
    locationLabel: { fontWeight: '600', fontSize: 14, marginBottom: 8, textAlign: 'center' },
    coordinatesBox: { padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 },
    coordinateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    coordinateLabel: { fontWeight: '600' },
    coordinateValue: { fontWeight: '400', color: '#333' },
});
