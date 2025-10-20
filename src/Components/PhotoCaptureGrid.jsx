// PhotoCaptureGrid.jsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PhotoCaptureGrid = ({ 
    sidesToRender, 
    geoTagData, 
    location, 
    capturePhoto, 
    removePhoto 
}) => {
    return (
        <View style={styles.photosGrid}>
            {sidesToRender.map(sideKey => {
                const photo = geoTagData[sideKey];
                const label = sideKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                return (
                    <View key={sideKey} style={styles.photoItem}>
                        <Text style={styles.photoLabel}>{label}</Text>
                        
                        {photo ? (
                            <View style={styles.photoWrapper}>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={styles.photoImage}
                                />
                                {/* Display Lat/Long on the photo */}
                                <View style={styles.photoOverlay}>
                                    <Text style={styles.photoOverlayText}>
                                        {`${photo.latitude.toFixed(4)}, ${photo.longitude.toFixed(4)}`}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.photoDeleteButton}
                                    onPress={() => removePhoto(sideKey)}
                                >
                                    <Text style={styles.photoDeleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.captureButton, !location && styles.disabledButton]}
                                onPress={() => capturePhoto(sideKey)}
                                disabled={!location} 
                            >
                                <Text style={styles.captureButtonIcon}>📷</Text>
                                <Text style={styles.captureButtonText}>Capture</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default PhotoCaptureGrid;

const styles = StyleSheet.create({
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
    photoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 2,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    photoOverlayText: {
        color: 'white',
        fontSize: 8,
        textAlign: 'center',
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
        backgroundColor: '#007AFF',
        padding: 6,
        borderRadius: 8,
        alignItems: 'center',
        width: 100,
        height: 100,
        justifyContent: 'center',
    },
    captureButtonIcon: { 
        color: '#fff', 
        fontSize: 28 
    },
    captureButtonText: { 
        color: '#fff', 
        fontSize: 12,
        marginTop: 4,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
});

