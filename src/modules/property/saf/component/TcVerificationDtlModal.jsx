import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    ActivityIndicator,
    Image,
    Linking,
    Platform,
} from 'react-native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather'; 
import { verificationDtlApi } from '../../../../api/endpoint'; 
import { useAuthToken } from '../../../../utils/auth'; 
import {
    formatLocalDate,
    formatLocalDateTime,
    toTitleCase,
} from '../../../../utils/common'; 
import DocumentViewer from "../../../../Components/DocumentViewer";

const defaultAvatar = require('../../../../assets/image/default-avatar.jpg');

const Colors = {
    primary: '#007AFF', // Blue
    green600: '#059669',
    red600: '#DC2626',
    gray500: '#6B7280',
    gray700: '#374151',
    gray100: '#F3F4F6',
    black: '#000000',
    white: '#FFFFFF',
    border: '#E5E7EB',
};

// ---------------------------------

function TcVerificationDtlModal({ id, onClose }) {
    const [verificationData, setVerificationData] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Using isLoading instead of isFrozen
    const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
    const [previewImg, setPreviewImg] = useState('');
    
    // printRef is not directly useful in Native for snapshot printing
    const scrollRef = useRef(null);
    const token = useAuthToken();

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                verificationDtlApi,
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response?.data?.status) {
                setVerificationData(response?.data?.data);
                console.log("data",response?.data?.data);
            }
        } catch (error) {
            console.error('Error fetching verification data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openPreviewModel = (link) => {
        setIsModalPreviewOpen(true);
        setPreviewImg(link);
    };

    const closePreviewModel = () => {
        setIsModalPreviewOpen(false);
        setPreviewImg('');
    };

    const handlePrint = () => {
        console.log("Native Print functionality initiated. Use a library like 'react-native-print' or platform-specific modules.");
        
    };

    const openGoogleMap = (lat, lng) => {
        if (!lat || !lng) {
            alert('Coordinates are missing.');
            return;
        }
        const url = Platform.select({
            ios: `http://maps.apple.com/?q=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}`,
            default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });
        
        Linking.openURL(url).catch(err => console.error('An error occurred opening map:', err));
    };
    return (
        <Modal 
            visible={true} 
            transparent={true} 
            animationType="slide" 
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            Tax Collector Verification Details
                        </Text>
                        
                        {/* <TouchableOpacity 
                            onPress={handlePrint}
                            style={styles.printButton}
                        >
                            <Text style={styles.printButtonText}>Print</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity 
                            style={styles.closeIcon} 
                            onPress={onClose}
                        >
                            <Feather name="x" size={24} color={Colors.gray500} />
                        </TouchableOpacity>
                    </View>

                    {/* Content Body */}
                    <View style={styles.contentBody}>
                        {isLoading && (
                            <ActivityIndicator 
                                size="large" 
                                color={Colors.primary} 
                                style={styles.loadingOverlay} 
                            />
                        )}
                        
                        <ScrollView 
                            ref={scrollRef}
                            style={[
                                styles.scrollView,
                                isLoading && styles.blurredContent 
                            ]}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Verification Header */}
                            <View style={styles.verificationHeader}>
                                <Text style={styles.sectionTitleSmall}>
                                    Tax Collector Verification Details
                                </Text>
                                <Text style={styles.detailLine}>
                                    <Text style={styles.boldText}>Name of Tax Collector:</Text>{' '}
                                    {verificationData?.tcDtl?.userName || '-'} ({verificationData?.tcDtl?.verifiedBy || '-'})
                                </Text>
                                <Text style={styles.detailLine}>
                                    <Text style={styles.boldText}>Date of Verification:</Text>{' '}
                                    {formatLocalDateTime(verificationData?.tcDtl?.verificationDate) || '-'}
                                </Text>
                            </View>

                            {/* Basic Details */}
                            <View style={styles.detailCard}>
                                <Text style={styles.sectionTitle}>Basic Details</Text>
                                <View style={styles.detailGrid}>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>SAF No:</Text> {verificationData?.safDtl?.safNo || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Applied Date:</Text> {formatLocalDate(verificationData?.safDtl?.applyDate) || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Application Type:</Text> {verificationData?.safDtl?.assessmentType || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Property Transfer(%):</Text> {verificationData?.safDtl?.propertyTransfer || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Ward No:</Text> {verificationData?.safDtl?.wardNo || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Ownership Type:</Text> {verificationData?.safDtl?.ownershipType || '-'}
                                    </Text>
                                    <Text style={styles.gridItem}>
                                        <Text style={styles.boldText}>Holding No:</Text> {verificationData?.safDtl?.holdingNo || '-'}
                                    </Text>
                                </View>
                                
                                {/* Owner(s) Table */}
                                <View style={styles.ownerTableContainer}>
                                    <Text style={styles.ownerTableTitle}>Owner(s)</Text>
                                    {/* Simplified Table Rendering - using nested Views */}
                                    <View style={styles.table}>
                                        <View style={styles.tableHeader}>
                                            {['Name', 'Guardian', 'Relation', 'Mobile No'].map((h, i) => (
                                                <Text key={i} style={[styles.th, { flex: 1 }]}>{h}</Text>
                                            ))}
                                        </View>
                                        {(verificationData?.ownerDtl?.length > 0 ? verificationData.ownerDtl : [null]).map((owner, idx) => (
                                            <View key={idx} style={styles.tableRow}>
                                                {owner ? (
                                                    <>
                                                        <Text style={[styles.td, { flex: 1 }]}>{owner?.ownerName || '-'}</Text>
                                                        <Text style={[styles.td, { flex: 1 }]}>{owner?.guardianName || '-'}</Text>
                                                        <Text style={[styles.td, { flex: 1 }]}>{owner?.relationType || '-'}</Text>
                                                        <Text style={[styles.td, { flex: 1 }]}>{owner?.mobileNo || '-'}</Text>
                                                    </>
                                                ) : (
                                                    <Text style={[styles.td, styles.noDataCell]} colSpan={4}>No data</Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Verified Details */}
                            <View style={styles.detailCard}>
                                <Text style={styles.sectionTitle}>Verified Details</Text>
                                {/* SAF Components Table */}
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        {['#', 'Particular', 'Self-Assessed', 'Check', 'Verification'].map((h, i) => (
                                            <Text key={i} style={[styles.th, { flex: i === 1 ? 2 : 1 }]}>{h}</Text>
                                        ))}
                                    </View>
                                    {(verificationData?.safComp?.length > 0 ? verificationData.safComp : [null]).map((row, idx) => (
                                        <View key={idx} style={styles.tableRow}>
                                            {row ? (
                                                <>
                                                    <Text style={[styles.td, styles.centerText, { flex: 1 }]}>{idx + 1}</Text>
                                                    <Text style={[styles.td, { flex: 2 }]}>{row?.key || '-'}</Text>
                                                    <Text style={[styles.td, { flex: 1 }]}>{row?.self || '-'}</Text>
                                                    <Text style={[styles.td, styles.centerText, { flex: 1 }]}>{row?.test ? '✅' : '❌'}</Text>
                                                    <Text style={[styles.td, { flex: 1 }]}>{row?.verify || '-'}</Text>
                                                </>
                                            ) : (
                                                <Text style={[styles.td, styles.noDataCell]} colSpan={5}>No data</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Floor Verified Details */}
                            <View style={styles.detailCard}>
                                <Text style={styles.sectionTitle}>Floor Verified Details</Text>
                                {/* Floor Components Table */}
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        {['Type', 'Floor No', 'Usage', 'Occupancy', 'Construction', 'Built Up Area', 'Carpet Area', 'Date From', 'Date Upto'].map((h, i) => (
                                            <Text key={i} style={[styles.th, { flex: 1 }]}>{h}</Text>
                                        ))}
                                    </View>
                                    {(verificationData?.floorCom?.length > 0 ? verificationData.floorCom : [null]).map((row, idx) => {
                                        if (!row) {
                                            return <Text key='no-floor' style={[styles.td, styles.noDataCell]} colSpan={9}>No data</Text>;
                                        }

                                        const floorRows = [
                                            { type: 'Self Assessed', data: row, isCheck: false, isVerify: false, style: {} },
                                            { type: 'Check', data: row, isCheck: true, isVerify: false, style: { backgroundColor: Colors.gray100 } },
                                            { type: 'Verification', data: row, isCheck: false, isVerify: true, style: {} },
                                        ];

                                        return floorRows.map((fRow, fIdx) => (
                                            <View key={`${idx}_${fRow.type}`} style={[styles.tableRow, fRow.style]}>
                                                <Text style={[styles.td, { flex: 1 }]}>{fRow.type}</Text>
                                                <Text style={[styles.td, { flex: 1 }]}>{row?.floorName || '-'}</Text>
                                                
                                                {/* Usage */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.usageType?.test ? '✅' : '❌') : (fRow.isVerify ? row?.usageType?.verify : row?.usageType?.self) || '-'}
                                                </Text>
                                                {/* Occupancy */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.occupancyName?.test ? '✅' : '❌') : (fRow.isVerify ? row?.occupancyName?.verify : row?.occupancyName?.self) || '-'}
                                                </Text>
                                                {/* Construction */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.constructionType?.test ? '✅' : '❌') : (fRow.isVerify ? row?.constructionType?.verify : row?.constructionType?.self) || '-'}
                                                </Text>
                                                {/* Builtup Area */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.builtupArea?.test ? '✅' : '❌') : (fRow.isVerify ? row?.builtupArea?.verify : row?.builtupArea?.self) || '-'}
                                                </Text>
                                                {/* Carpet Area */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.carpetArea?.test ? '✅' : '❌') : (fRow.isVerify ? row?.carpetArea?.verify : row?.carpetArea?.self) || '-'}
                                                </Text>
                                                {/* Date From */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.dateFrom?.test ? '✅' : '❌') : (fRow.isVerify ? formatLocalDate(row?.dateFrom?.verify) : formatLocalDate(row?.dateFrom?.self)) || '-'}
                                                </Text>
                                                {/* Date Upto */}
                                                <Text style={[styles.td, { flex: 1 }]}>
                                                    {fRow.isCheck ? (row?.dateUpto?.test ? '✅' : '❌') : (fRow.isVerify ? formatLocalDate(row?.dateUpto?.verify) : formatLocalDate(row?.dateUpto?.self)) || '-'}
                                                </Text>
                                            </View>
                                        ));
                                    })}
                                </View>
                            </View>

                            {/* Geo Tagging */}
                            {verificationData?.tcDtl?.verifiedBy !== 'ULB TC' && (
                                <View style={styles.detailCard}>
                                    <Text style={styles.sectionTitle}>Geo Tagging</Text>
                                    <View style={styles.table}>
                                        <View style={styles.tableHeader}>
                                            {['Location', 'Image', 'Latitude', 'Longitude', 'View on Map'].map((h, i) => (
                                                <Text key={i} style={[styles.th, { flex: 1 }]}>{h}</Text>
                                            ))}
                                        </View>
                                        {(verificationData?.getGeoTag?.length > 0 ? verificationData.getGeoTag : [null]).map((tag, idx) => (
                                            <View key={idx} style={styles.tableRow}>
                                                {tag ? (
                                                    <>
                                                        <Text style={[styles.td, { flex: 1 }]}>{toTitleCase(tag?.directionType) || '-'}</Text>
                                                        <View style={[styles.td, { flex: 1, padding: 4 }]}>
                                                            {tag?.imagePath ? (
                                                                <TouchableOpacity
                                                                    onPress={() => openPreviewModel(tag?.imagePath || defaultAvatar)}
                                                                    style={styles.imageWrapper}
                                                                >
                                                                    <Image
                                                                        source={{ uri: tag?.imagePath }}
                                                                        style={styles.geoImage}
                                                                        resizeMode="cover"
                                                                    />
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <View style={styles.noImage}>
                                                                    <Text style={{ fontSize: 10 }}>N/A</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <Text style={[styles.td, { flex: 1 }]}>{tag?.latitude || '-'}</Text>
                                                        <Text style={[styles.td, { flex: 1 }]}>{tag?.longitude || '-'}</Text>
                                                        <View style={[styles.td, styles.centerText, { flex: 1 }]}>
                                                            <TouchableOpacity
                                                                onPress={() => openGoogleMap(tag?.latitude, tag?.longitude)}
                                                                style={styles.mapButton}
                                                            >
                                                                <Text style={styles.mapButtonText}>Map</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                ) : (
                                                    <Text style={[styles.td, styles.noDataCell]} colSpan={6}>No geo tag data</Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
                {isModalPreviewOpen && (
                    <DocumentViewer imageSrc={previewImg} closePreview={closePreviewModel} />                    
                )}
            </View>
        </Modal>
    );
}


export default TcVerificationDtlModal;

const styles = StyleSheet.create({
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: '100%',
        maxWidth: 800, 
        height: '90%', 
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.gray700,
        flex: 1, 
    },
    printButton: {
        backgroundColor: Colors.green600,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        marginRight: 15,
    },
    printButtonText: {
        color: Colors.white,
        fontSize: 14,
    },
    closeIcon: {
        padding: 5,
    },

    contentBody: {
        flex: 1,
        position: 'relative',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 15,
    },
    blurredContent: {
        opacity: 0.5,
    },
    
    verificationHeader: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 10,
    },
    sectionTitleSmall: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5,
    },
    detailLine: {
        fontSize: 12,
        color: Colors.gray700,
        marginBottom: 2,
    },
    boldText: {
        fontWeight: 'bold',
    },
    detailCard: {
        backgroundColor: Colors.white,
        marginBottom: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 14,
        color: Colors.gray700,
        marginBottom: 10,
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%', 
        fontSize: 12,
        marginBottom: 5,
    },
    ownerTableContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 5,
    },
    ownerTableTitle: {
        fontWeight: '600',
        fontSize: 12,
        marginBottom: 5,
    },

    // --- Table Styles (Generic) ---
    table: {
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.gray100,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    th: {
        fontWeight: 'bold',
        fontSize: 10,
        padding: 8,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: Colors.border,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    td: {
        fontSize: 10,
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        textAlign: 'left',
        flex: 1,
    },
    centerText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataCell: {
        flex: 1,
        textAlign: 'center',
        fontStyle: 'italic',
        color: Colors.gray500,
    },

    // --- Geo Tagging Specific ---
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    geoImage: {
        width: 48,
        height: 48,
        borderRadius: 5,
    },
    noImage: {
        width: 48,
        height: 48,
        backgroundColor: Colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    mapButton: {
        backgroundColor: Colors.red600,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    mapButtonText: {
        color: Colors.white,
        fontSize: 10,
    },

    // --- Image Preview Modal Styles (from placeholder) ---
    previewContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '90%',
        height: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 20,
        padding: 10,
    },
});