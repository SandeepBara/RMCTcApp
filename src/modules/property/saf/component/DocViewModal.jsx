import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    StyleSheet, 
    ScrollView,
    ActivityIndicator,
    Image,
    Alert,
} from "react-native";
import axios from "axios";
import Feather from 'react-native-vector-icons/Feather'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentViewer from "../../../../Components/DocumentViewer"; 
import { safUploadedDocListApi } from "../../../../api/endpoint";
import { formatLocalDateTime } from "../../../../utils/common";
import { useAuthToken } from "../../../../utils/auth";
import Colors from "../../../../Constants/Colors";

function DocViewModal({ id, onClose }) {
    const [docList, setDocList] = useState([]);
    const [isFrozen, setIsFrozen] = useState(false);
    const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
    const [previewImg, setPreviewImg] = useState("");
    const token = useAuthToken();

    useEffect(() => {
        // Only fetch data if ID and token are valid
        if (token && id) fetchData();
    }, [id, token]);

    const fetchData = async () => {
        setIsFrozen(true);
        try {
            const response = await axios.post(
                safUploadedDocListApi,
                { id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response?.data?.status) {
                setDocList(response.data.data);
            } else {
                Alert.alert("Error", "Could not fetch document list.");
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            Alert.alert("Error", "Failed to load documents.");
        } finally {
            setIsFrozen(false);
        }
    };

    const openPreviewModel = (link) => {
        setIsModalPreviewOpen(true);
        setPreviewImg(link);
    };

    const closePreviewModel = () => {
        setIsModalPreviewOpen(false);
        setPreviewImg("");
    };

    const renderFileCell = (item) => {
        if (!item.docPath) {
            return <Text style={styles.noFileText}>No file</Text>;
        }

        const isPdf = item.docPath.toLowerCase().endsWith(".pdf");

        return (
            <View style={styles.fileCellContainer}>
                {isPdf ? (
                    <TouchableOpacity 
                        onPress={() => openPreviewModel(item.docPath)}
                        style={styles.pdfIconWrapper}
                    >
                        <FontAwesome 
                            name="file-pdf-o" 
                            size={40} 
                            color="#DC2626" // text-red-600
                        />
                        <Text style={styles.viewPdfText}>View PDF</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => openPreviewModel(item.docPath)}>
                        <Image
                            source={{ uri: item.docPath }}
                            style={styles.docImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
                <Text style={styles.uploadInfoText}>
                    {item?.uploadedBy} :- {formatLocalDateTime(item?.createdAt)}
                </Text>
            </View>
        );
    };

    const renderStatusCell = (status) => {
        let text = "Pending";
        let bgColor = "#F3F4F6"; 
        let textColor = "#4B5563"; 

        if (status === 1) {
            text = "Verified";
            bgColor = "#D1FAE5"; 
            textColor = "#059669"; 
        } else if (status === 2) {
            text = "Rejected";
            bgColor = "#FEE2E2"; 
            textColor = "#B91C1C";
        }

        return (
            <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.statusText, { color: textColor }]}>
                    {text}
                </Text>
            </View>
        );
    };

    const renderTableContent = () => {
        if (docList.length === 0 && !isFrozen) {
            return (
                <View style={styles.emptyRow}>
                    <Text style={styles.emptyText}>No documents found.</Text>
                </View>
            );
        }

        return docList.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellIndex]}>{index + 1}</Text>
                <View style={[styles.tableCell, styles.cellDocName]}>
                    <Text style={styles.docNameText}>
                        {item.docName}
                    </Text>
                    {item?.ownerName && (
                        <Text style={styles.ownerNameText}>
                            ({item.ownerName})
                        </Text>
                    )}
                </View>
                <View style={[styles.tableCell, styles.cellFile]}>
                    {renderFileCell(item)}
                </View>
                <View style={[styles.tableCell, styles.cellStatus]}>
                    {renderStatusCell(item.verifiedStatus)}
                </View>
                <Text style={[styles.tableCell, styles.cellRemark]}>
                    {item?.remarks || 'N/A'}
                </Text>
            </View>
        ));
    };

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="slide" 
            onRequestClose={onClose}
        > 
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Document View</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Feather name="x" size={24} color="#4B5563" /> 
                        </TouchableOpacity>
                    </View>

                    {/* Table Content */}
                    <View style={styles.contentArea}>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, styles.cellIndex]}>#</Text>
                            <Text style={[styles.headerCell, styles.cellDocName]}>Document Name</Text>
                            <Text style={[styles.headerCell, styles.cellFile]}>File</Text>
                            <Text style={[styles.headerCell, styles.cellStatus]}>Status</Text>
                            <Text style={[styles.headerCell, styles.cellRemark]}>Remark</Text>
                        </View>
                        
                        {/* Table Body - ScrollView */}
                        <ScrollView style={styles.scrollView}>
                            <ScrollView 
                                    horizontal
                                    contentContainerStyle={styles.scrollViewContent}
                                    directionalLockEnabled={true} 
                                    nestedScrollEnabled={true} 
                                    scrollsToTop={false}
                                >
                                    {renderTableContent()}
                                </ScrollView>
                        </ScrollView>

                        {/* Frozen Overlay (Loading/Processing) */}
                        {isFrozen && (
                            <View style={styles.frozenOverlay}>
                                <ActivityIndicator size="large" color="#1F2937" />
                                <Text style={styles.frozenText}>Processing...</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Image Preview Modal (Keep separate for clean layering) */}
            {isModalPreviewOpen && (
                <DocumentViewer
                    imageSrc={previewImg}
                    closePreview={closePreviewModel}
                />
            )}
        </Modal>
    );
}

export default DocViewModal;

// --- STYLES ---

const styles = StyleSheet.create({
    // Modal Layout
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // bg-black bg-opacity-50
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
         backgroundColor: Colors.white,
        borderRadius: 10,
        width: '100%',
        maxWidth: 700, 
        height: '90%', 
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16, // p-6
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // border-gray-200
    },
    headerTitle: {
        fontWeight: '600',
        color: '#1E40AF', // text-blue-900 (approximation)
        fontSize: 20, // text-xl
    },
    closeButton: {
        padding: 4,
        // hover:text-red-600 is handled by custom logic if needed
    },

    // Content Area
    contentArea: {
        flex: 1, // flex-grow
        position: 'relative',
        overflow: 'hidden', // clips the content inside
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 8, 
        alignItems: 'center', 
    },

    // Table Styles (Using Flexbox for React Native Table)
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1E40AF', // bg-blue-800
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        position: 'sticky', // sticky header (best effort)
        top: 0,
        zIndex: 10,
    },
    headerCell: {
        padding: 8, // p-2
        color: '#FFFFFF',
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#FFFFFF',
        textAlign: 'center',
        fontSize: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // border-t
        minHeight: 50,
    },
    tableCell: {
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        fontSize: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Column Widths (Flex ratios)
    cellIndex: { flex: 1, maxWidth: 40 },
    cellDocName: { flex: 5, alignItems: 'flex-start' },
    cellFile: { flex: 4, paddingVertical: 4 },
    cellStatus: { flex: 2 },
    cellRemark: { flex: 3 },

    // Cell Content
    docNameText: {
        fontSize: 13,
    },
    ownerNameText: {
        fontSize: 11,
        color: '#4ADE80', // text-green-300
    },
    fileCellContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    docImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB', // border-gray-300
    },
    pdfIconWrapper: {
        alignItems: 'center',
        padding: 4,
    },
    viewPdfText: {
        fontSize: 10,
        color: '#DC2626',
        marginTop: 2,
        fontWeight: '500',
    },
    uploadInfoText: {
        fontSize: 10,
        color: '#60A5FA', // text-blue-400
        marginTop: 4,
        textAlign: 'center',
    },
    noFileText: {
        color: '#9CA3AF', // text-gray-400
    },

    // Status Badge
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },

    // Empty/Loading State
    emptyRow: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
    },
    frozenOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/60
        // No direct support for backdrop-blur in basic RN styles
    },
    frozenText: {
        marginTop: 10,
        fontWeight: '600',
        color: '#4B5563', // text-gray-800
        fontSize: 16,
    }
});