import React, { useEffect, useState, useRef } from "react";
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
import QRCodeComponent from "../../../../Components/QRCodeComponent";
import { FRONTEND_URL, safPaymentReceiptApi } from "../../../../api/endpoint";
import { useAuthToken } from "../../../../utils/auth";
import { formatLocalDate, toTitleCase } from "../../../../utils/common";
import Colors from "../../../../Constants/Colors";

function PaymentReceiptModal({ id, onClose }) {
    const [isLoading, setIsLoading] = useState(false); 
    const [receiptData, setReceiptData] = useState({});
    const [qurCode, setQurCode] = useState(null);
    const printRef = useRef(null); 
    const hostInfo = FRONTEND_URL;
    const token = useAuthToken();
    const isDataLoaded = Object.keys(receiptData).length > 0;

    useEffect(() => {
        let isCancelled = false;
        
        const fetchData = async () => {
            if (!id) return; 
            
            // Set loading only if data is not already present
            if (!isDataLoaded) setIsLoading(true);
            
            try {
                const response = await axios.post(safPaymentReceiptApi, { id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response?.data?.status && !isCancelled) {
                    setReceiptData(response.data.data || {});
                } else if (!isCancelled) {
                    Alert.alert("Error", "Could not fetch receipt data from API.");
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Error fetching receipt:", error);
                    Alert.alert("Error", "Could not fetch receipt data.");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [id, token]); 

    useEffect(() => {
        if (id) {
            const host = hostInfo;
            setQurCode(
                <QRCodeComponent value={host + "/saf/payment-receipt/" + id} size={90} />
            );
        } else {
            setQurCode(null);
        }
    }, [id, hostInfo]);


    const renderReceiptContent = () => (
        <View style={[styles.receiptContainer, isLoading && styles.frozenContent]} ref={printRef}>
            <View style={styles.header}>
                <Image
                    source={{ uri: receiptData?.ulbDtl?.logoImg }} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.ulbNameText}>
                    {receiptData?.ulbDtl?.ulbName}
                </Text>
                <Text style={styles.descriptionText}>
                    <Text style={styles.descriptionTextBorder}>
                        {receiptData?.description}
                    </Text>
                </Text>
            </View>

            <View style={styles.detailsGrid}>
                <View style={styles.detailColumn}>
                    <Text style={styles.detailItem}>
                        Receipt No.: <Text style={styles.bold}>{receiptData?.tranNo}</Text>
                    </Text>
                    <Text style={styles.detailItem}>
                        Department: <Text style={styles.bold}>{receiptData?.department}</Text>
                    </Text>
                    <Text style={styles.detailItem}>
                        Account: <Text style={styles.bold}>{receiptData?.accountDescription}</Text>
                    </Text>
                </View>
                <View style={styles.detailColumn}>
                    <Text style={styles.detailItem}>
                        Date: <Text style={styles.bold}>{formatLocalDate(receiptData?.tranDate)}</Text>
                    </Text>
                    <Text style={styles.detailItem}>
                        Ward No: <Text style={styles.bold}>{receiptData?.wardNo}</Text>
                    </Text>
                    <Text style={styles.detailItem}>
                        New Ward No: <Text style={styles.bold}>{receiptData?.newWardNo}</Text>
                    </Text>
                    {receiptData?.safNo ? (
                        <Text style={styles.detailItem}>
                            SAF No: <Text style={styles.bold}>{receiptData?.safNo}</Text>
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.detailItem}>
                                Holding No: <Text style={styles.bold}>{receiptData?.holdingNo}</Text>
                            </Text>
                            <Text style={styles.detailItem}>
                                New Holding No: <Text style={styles.bold}>{receiptData?.newHoldingNo}</Text>
                            </Text>
                        </>
                    )}
                </View>
            </View>

            <View style={styles.receivedDetails}>
                <Text style={styles.detailItem}>
                    Received From: <Text style={styles.bold}>{receiptData?.ownerName}</Text>
                </Text>
                <Text style={styles.detailItem}>
                    Address: <Text style={styles.bold}>{receiptData?.address}</Text>
                </Text>
                <Text style={styles.detailItem}>
                    A Sum of Rs.: <Text style={styles.bold}>{receiptData?.amount}</Text>
                </Text>
                <Text style={styles.detailItem}>
                    (In words):{" "}
                    <Text style={[styles.bold, styles.underlineDotted]}>
                        {receiptData?.amountInWords}
                    </Text>
                </Text>
                <Text style={styles.detailItem}>
                    Towards: <Text style={styles.bold}>{receiptData?.accountDescription}</Text>
                    <Text>{"  "}Vide: </Text>
                    <Text style={styles.bold}>{receiptData?.paymentMode}</Text>
                </Text>
                
                {receiptData?.chequeNo && (
                    <Text style={styles.detailItem}>
                        {toTitleCase(receiptData?.paymentMode)} No:{" "}
                        <Text style={[styles.bold, styles.underlineDotted]}>
                            {receiptData?.chequeNo}
                        </Text>
                        {"  "}
                        {toTitleCase(receiptData?.paymentMode)} Date:{" "}
                        <Text style={[styles.bold, styles.underlineDotted]}>
                            {receiptData?.chequeDate}
                        </Text>
                        {"  "}
                        Bank Name:{" "}
                        <Text style={[styles.bold, styles.underlineDotted]}>
                            {receiptData?.bankName}
                        </Text>
                        {"  "}
                        Branch Name:{" "}
                        <Text style={[styles.bold, styles.underlineDotted]}>
                            {receiptData?.branchName}
                        </Text>
                    </Text>
                )}
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCellHeader, styles.colSpan5]}>Description</Text>
                    <Text style={[styles.tableCellHeader, styles.colSpan4]}>Period</Text>
                    <Text style={[styles.tableCellHeader, styles.colSpan6]}>Amount</Text>
                </View>
                <View style={styles.tableHeaderSub}>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan5]}></Text>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan1]}>From QTR</Text>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan1]}>From FY</Text>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan1]}>To QTR</Text>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan1]}>To FY</Text>
                    <Text style={[styles.tableCellSubHeader, styles.colSpan6]}></Text>
                </View>
                
                {[
                    { headName: "Holding Tax", amount: receiptData?.holdingTax },
                    { headName: "Water Tax", amount: receiptData?.waterTax },
                    { headName: "Education Cess", amount: receiptData?.educationCessTax },
                    { headName: "Health Cess", amount: receiptData?.healthCessTax },
                    { headName: "Latrine Tax", amount: receiptData?.latrineTax },
                    { headName: "RWH", amount: receiptData?.rwhTax },
                ].filter(item => item.amount > 0).map((item, index) => (
                    <View style={styles.tableRow} key={`tax_${index}`}>
                        <Text style={[styles.tableCell, styles.colSpan5]}>{item.headName}</Text>
                        <Text style={[styles.tableCell, styles.colSpan1]}>{receiptData?.fromQtr}</Text>
                        <Text style={[styles.tableCell, styles.colSpan1]}>{receiptData?.fromFyear}</Text>
                        <Text style={[styles.tableCell, styles.colSpan1]}>{receiptData?.uptoQtr}</Text>
                        <Text style={[styles.tableCell, styles.colSpan1]}>{receiptData?.uptoFyear}</Text>
                        <Text style={[styles.tableCell, styles.colSpan6]}>{item.amount}</Text>
                    </View>
                ))}

                {receiptData?.fineRebate?.filter(item => item?.amount > 0)?.map((item, index) => (
                    <View style={styles.tableRow} key={`fine_${index}`}>
                        <Text style={[styles.tableCell, styles.colSpan10]}>{item?.headName}</Text>
                        <Text style={[styles.tableCell, styles.colSpan6]}>{item?.amount}</Text>
                    </View>
                ))}

                <View style={styles.tableRowTotal}>
                    <Text style={[styles.tableCellTotal, styles.colSpan10]}>Total Amount</Text>
                    <Text style={[styles.tableCellTotal, styles.colSpan6]}>{receiptData?.amount}</Text>
                </View>
                <View style={styles.tableRowTotal}>
                    <Text style={[styles.tableCellTotal, styles.colSpan10, styles.bold]}>Total Paid Amount</Text>
                    <Text style={[styles.tableCellTotal, styles.colSpan6, styles.bold]}>{receiptData?.amount}</Text>
                </View>
            </View>

            <View style={styles.footerRow}>
                <View>{qurCode}</View>
                <View style={styles.footerDetails}>
                    <Text style={styles.footerText}>
                        Visit:{" "}
                        <Text style={styles.linkText} onPress={() => {/* Linking.openURL(receiptData?.ulbDtl?.ulbUrl) */}}>
                            {receiptData?.ulbDtl?.ulbUrl}
                        </Text>
                    </Text>
                    <Text style={styles.footerText}>Call: {receiptData?.ulbDtl?.tollFreeNo}</Text>
                    <Text style={[styles.footerText, { marginTop: 8 }]}>
                        In collaboration with {"\n"}
                        <Text>{receiptData?.ulbDtl?.collaboration}</Text>
                    </Text>
                </View>
            </View>

            <Text style={styles.footerNote}>
                ** This is a computer-generated receipt and does not require signature. **
            </Text>
        </View>
    );

    return (
        <Modal
            visible={true}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            
            <View style={styles.modalOverlay}>
                
                <View style={styles.modalContainer}>
                    
                    <View style={styles.controlBar}>
                        <Text style={styles.modalTitle}>View Receipt</Text>
                        <View style={styles.buttonGroup}>                          
                            {onClose && (
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                    disabled={isLoading}
                                >
                                    <Feather name="x" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>                            
                    <View style={styles.contentArea}>
                        
                        {isLoading && !isDataLoaded ? (
                            <View style={styles.emptyState}>
                                <ActivityIndicator size="large" color="#1F2937" />
                                <Text style={styles.emptyText}>Loading receipt data...</Text>
                            </View>
                        ) : isDataLoaded ? (
                            <ScrollView
                                contentContainerStyle={styles.scrollViewContent}
                                style={styles.scrollView}
                            >
                                <ScrollView 
                                    horizontal
                                    contentContainerStyle={styles.scrollViewContent}
                                    directionalLockEnabled={true} 
                                    nestedScrollEnabled={true} 
                                    scrollsToTop={false}
                                >
                                    {renderReceiptContent()}
                                </ScrollView>
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No receipt data available.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default PaymentReceiptModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(241, 233, 233, 0.94)',
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
    controlBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', 
    },
    modalTitle: {
        fontWeight: '600',
        color: '#1E40AF', 
        fontSize: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8, 
    },
    printButton: {
        backgroundColor: '#059669', 
        paddingHorizontal: 12, 
        paddingVertical: 4, 
        borderRadius: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    closeButton: {
        color: '#4B5563', 
        padding: 4,
    },
    contentArea: {
        flex: 1,
        position: 'relative',
    },
    scrollView: {
        flex: 1, 
    },
    scrollViewContent: {
        padding: 8, 
        alignItems: 'center', 
    },
    receiptContainer: {
        backgroundColor: '#FFFFFF',
        padding: 24, 
        borderWidth: 1,
        borderStyle: 'dotted', 
        borderColor: '#000000',
        width: '100%',
        maxWidth: 800, 
        fontFamily: 'System', 
        fontSize: 14,
    },
    header: {
        marginBottom: 16,
        paddingBottom: 16, 
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        alignItems: 'center',
        textAlign: 'center',
    },
    logo: {
        width: 80,
        height: 80, 
        marginBottom: 8, 
        alignSelf: 'center',
    },
    ulbNameText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    },
    descriptionText: {
        marginTop: 12,
        fontWeight: '600',
    },
    descriptionTextBorder: {
        paddingHorizontal: 24,
        paddingTop: 4,
        paddingBottom: 4,
        borderWidth: 2,
        borderColor: '#000000',
        textAlign: 'center',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16, 
        justifyContent: 'space-between',
    },
    detailColumn: {
        width: '50%',
        paddingRight: 8,
        minWidth: 200,
    },
    detailItem: {
        marginBottom: 2,
        fontSize: 14,
    },
    bold: {
        fontWeight: 'bold',
        color: '#000000',
    },
    receivedDetails: {
        marginBottom: 16,
    },
    underlineDotted: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderStyle: 'dotted',
    },
    table: {
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    tableHeaderSub: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    tableCellHeader: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
    },
    tableCellSubHeader: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#000000',
        textAlign: 'center',
        fontSize: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    tableRowTotal: {
        flexDirection: 'row',
        borderBottomWidth: 0,
    },
    tableCell: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#000000',
        fontSize: 12,
        textAlign: 'center',
    },
    tableCellTotal: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#000000',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: '#F3F4F6',
    },
    colSpan1: { flex: 1, minWidth: 50 }, 
    colSpan4: { flex: 4, flexDirection: 'row', minWidth: 200 },
    colSpan5: { flex: 5, minWidth: 150 },
    colSpan6: { flex: 6, minWidth: 80 },
    colSpan10: { flex: 10, minWidth: 300 },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 24,
    },
    footerDetails: {
        color: '#374151',
        fontSize: 12,
        alignItems: 'flex-end',
        textAlign: 'right',
    },
    footerText: {
        fontSize: 12,
        color: '#374151',
    },
    linkText: {
        color: '#2563EB', 
        textDecorationLine: 'underline',
    },
    footerNote: {
        marginTop: 16, 
        color: '#6B7280', 
        fontSize: 10, 
        textAlign: 'center',
        fontStyle: 'italic',
    },
    frozenContent: {
        opacity: 0.5, // Applied directly to receiptContainer
    },
    emptyState: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        color: '#6B7280',
        fontSize: 16,
    }
});