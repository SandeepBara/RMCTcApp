import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Image,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Colors = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#DC2626',
    blue: '#3B82F6',
};

const isImage = (uri) => {
    if (!uri) return false;
    const lowerCaseUri = uri.toLowerCase();
    return lowerCaseUri.endsWith('.jpg') || lowerCaseUri.endsWith('.jpeg') || 
           lowerCaseUri.endsWith('.png') || lowerCaseUri.endsWith('.gif');
};

const isPDF = (uri) => {
    if (!uri) return false;
    return uri.toLowerCase().endsWith('.pdf');
};

const DocumentViewer = ({ imageSrc, closePreview }) => {

    const fileIsImage = isImage(imageSrc);
    const fileIsPDF = isPDF(imageSrc);

    const handleOpenExternal = () => {
        // Use Linking to open the file in the device's default viewer
        Linking.openURL(imageSrc).catch(err => {
            console.error("Failed to open document:", err);
            alert(`Could not open document. Please check the URL.`);
        });
        // We close the modal immediately after trying to open the link
        closePreview();
    };

    const renderContent = () => {
        if (fileIsImage) {
            return (
                <Image
                    source={{ uri: imageSrc }}
                    style={styles.previewImage}
                    resizeMode="contain"
                />
            );
        } else if (fileIsPDF) {
            // For PDFs, prompt the user to open externally
            return (
                <View style={styles.documentPlaceholder}>
                    <Feather name="file-text" size={60} color={Colors.red} />
                    <Text style={styles.documentText}>PDF Document</Text>
                    <TouchableOpacity
                        onPress={handleOpenExternal}
                        style={styles.openButton}
                    >
                        <Text style={styles.openButtonText}>Open PDF Viewer</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.documentPlaceholder}>
                    <Feather name="file" size={60} color={Colors.blue} />
                    <Text style={styles.documentText}>External Document</Text>
                    <TouchableOpacity
                        onPress={handleOpenExternal}
                        style={styles.openButton}
                    >
                        <Text style={styles.openButtonText}>Open in App</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <Modal 
            visible={true} 
            transparent={true} 
            animationType="fade"
            onRequestClose={closePreview}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.previewContainer}>
                    <TouchableOpacity 
                        onPress={closePreview} 
                        style={styles.closeButton}
                    >
                        <Feather name="x" size={30} color={Colors.white} />
                    </TouchableOpacity>
                    
                    {renderContent()}

                </View>
            </View>
        </Modal>
    );
};

export default DocumentViewer;


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        width: '95%',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 40 : 10,
        right: 10,
        zIndex: 20,
        padding: 10,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    
    // --- Document Placeholder Styles ---
    documentPlaceholder: {
        backgroundColor: Colors.white,
        padding: 40,
        borderRadius: 10,
        alignItems: 'center',
        width: '70%',
        height: 250,
        justifyContent: 'space-around',
    },
    documentText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.black,
        marginTop: 10,
    },
    openButton: {
        backgroundColor: Colors.blue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    openButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});