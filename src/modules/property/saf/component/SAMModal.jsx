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
    Dimensions,
} from "react-native";
import axios from "axios";
// Ensure you have installed this: npm install react-native-vector-icons
import Feather from 'react-native-vector-icons/Feather';
import {memoReceiptApi,FRONTEND_URL} from "../../../../api/endpoint";
import Colors from "../../../../Constants/Colors";
import { formatLocalDate } from "../../../../utils/common";
import QRCodeComponent from "../../../../Components/QRCodeComponent";

const hostInfo = FRONTEND_URL;

// ===============================================
// --- SAMModal Component ---
// ===============================================

function SAMModal({ id, onClose, lag = "EN" }) {
    const [isFrozen, setIsFrozen] = useState(false);
    const [receiptData, setReceiptData] = useState({});
    const [qurCode, setQurCode] = useState(null);
    const [isHindi, setIsHindi] = useState(false);
    const printRef = useRef(null); 

    useEffect(() => {
        // This ensures the initial language state is set based on 'lag' prop
        setIsHindi(lag !== "EN");
    }, [lag]);

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    useEffect(() => {
        const host = hostInfo;
        setQurCode(
            <QRCodeComponent
                value={host + "/saf/sam-memo/" + id + "/" + (isHindi ? "HN" : "EN")}
                size={90}
            />
        );
    }, [id, isHindi]);

    const fetchData = async () => {
        if (!id) return;
        setIsFrozen(true);
        try {
            const response = await axios.post(memoReceiptApi, { id });
            
            // Mock Data Structure
            const mockResponse = {
                data: {
                    status: true,
                    data: {
                        memoNo: "SAM-2024-001234",
                        createdAt: new Date().toISOString(),
                        effective: "2024-25",
                        ownerName: "Jhon Doe",
                        propAddress: "123 Main Street, Ward 5, Ranchi. This is a very long address to test wrapping and ensure no cut-off.",
                        oldHoldingNo: "123A",
                        newHoldingNo: "050110000000001",
                        wardNo: "5",
                        newWardNo: "5",
                        arv: "12000",
                        holdingTax: "180",
                        waterTax: "15",
                        latrineTax: "10",
                        rwhTax: "90", // 50% of holdingTax (180*0.5)
                        educationCessTax: "5",
                        healthCessTax: "5",
                        totalTax: "305", // Sum of all taxes
                        ulbDtl: {
                            logoImg: "https://via.placeholder.com/50/007BFF/FFFFFF?text=ULB",
                            ulbName: "Ranchi Municipal Corporation",
                            hindiUlbName: "राँची नगर निगम",
                            ulbUrl: "https://www.ranchimunicipal.com",
                            tollFreeNo: "1800-123-4567"
                        }
                    }
                }
            };
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500)); 

            if (response?.data?.status) {
                setReceiptData(response.data.data || {});
            } else {
                Alert.alert("Error", "Could not fetch receipt data from API.");
            }
        } catch (error) {
            console.error("Error fetching receipt:", error);
            Alert.alert("Error", "Could not fetch receipt data.");
        } finally {
            setIsFrozen(false);
        }
    };
    
    // Check if data is loaded
    const isDataLoaded = Object.keys(receiptData).length > 0;

    const ReceiptContent = (
        <View ref={printRef} style={styles.receiptWrapper}>
            <View style={styles.receiptContainer}>
                {/* Header */}
                <View style={styles.receiptHeader}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={{ uri: receiptData?.ulbDtl?.logoImg }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.heading1}>
                            {isHindi ? receiptData?.ulbDtl?.hindiUlbName : receiptData?.ulbDtl?.ulbName}
                        </Text>
                    </View>
                    <Text style={styles.heading2}>
                        {isHindi
                            ? "झारखण्ड नगरपालिका अधिनियम -2011 की धरा 152 (3) के अंतर्गत स्वनिर्धारित किये गए संपत्ति कर की सूचना |"
                            : "Notice of property tax customized under section 152(3) of Jharkhand Municipal Act-2011"}
                    </Text>
                </View>

                {/* Details */}
                <View style={styles.details}>
                    <Text style={styles.detailText}>
                        {isHindi ? "मेमो सं०" : "Memo No."}: <Text style={styles.bold}>{receiptData?.memoNo}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        {isHindi ? "दिनांक" : "Date"}: <Text style={styles.bold}>{formatLocalDate(receiptData?.createdAt)}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        {isHindi ? "प्रभावी" : "Effective"}: <Text style={styles.bold}>{receiptData?.effective}</Text>
                    </Text>
                </View>

                <View style={styles.paragraphContainer}>
                    <Text style={styles.paragraphText}>
                        {isHindi ? "श्री /श्रीमती /सुश्री" : "Mr/Mrs/Ms"}: <Text style={styles.bold}>{receiptData?.ownerName}</Text>
                    </Text>
                    <Text style={styles.paragraphText}>
                        {isHindi ? "पता" : "Address"}: <Text style={styles.bold}>{receiptData?.propAddress}</Text>
                    </Text>
                    <Text style={[styles.paragraphText, { marginTop: 4 }]}>
                        <Text>
                            {/* REMOVED &nbsp;&nbsp;&nbsp; WHICH WAS PUSHING TEXT OFF-SCREEN TO THE RIGHT */}
                            {isHindi ? "एतद् द्वारा आपको सूचित किया जाता है कि आपके" : "You are hereby informed that"}{" "}
                            {receiptData?.oldHoldingNo && (
                                <>
                                    {isHindi ? "पुराना गृह सं०" : "Old Holding Number"} - <Text style={styles.bold}>{receiptData?.oldHoldingNo}</Text>
                                </>
                            )}{" "}
                            {isHindi ? "नया गृह सं०" : "your New Holding Number"} - <Text style={styles.bold}>{receiptData?.newHoldingNo}</Text>{" "}
                            {isHindi ? "पुराना वार्ड सं०" : "in Ward No"} - <Text style={styles.bold}>{receiptData?.wardNo}</Text>,
                            {isHindi ? "नया वार्ड सं०" : "New Ward No"} - <Text style={styles.bold}>{receiptData?.newWardNo}</Text>{" "}
                            {isHindi
                                ? "हुआ है , आपके स्व० निर्धारण घोषणा पत्र के आधार पर वार्षिक किराया मूल्य"
                                : "has been done, on the basis of your self-assessment declaration form. The annual rental price has been fixed at Rs"}{" "}
                            <Text style={styles.bold}>{receiptData?.arv || 0}/-</Text>{" "}
                            {isHindi
                                ? "निर्धारित किया गया है |"
                                : "based on your self-assessment declaration."}
                        </Text>
                    </Text>
                    <Text style={styles.paragraphText}>
                        {isHindi
                            ? "इसके अनुसार प्रति तिमाही कर निम्न प्रकार होगा |"
                            : "Accordingly the tax per quarter will be as follows."}
                    </Text>
                </View>

                {/* Tax Table (Simplified RN version) */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.headerText, { flex: 0.5, textAlign: 'center' }]}>{isHindi ? "क्रम स०" : "SL. No."}</Text>
                        <Text style={[styles.tableCell, styles.headerText, { flex: 2 }]}>{isHindi ? "ब्यौरे" : "Particulars"}</Text>
                        <Text style={[styles.tableCell, styles.headerText, { flex: 1, textAlign: 'right' }]}>{isHindi ? "राशि (in Rs.)" : "Amount (in Rs.)"}</Text>
                    </View>
                    {[
                        { title: isHindi ? "गृह कर" : "House Tax", value: receiptData?.holdingTax },
                        { title: isHindi ? "जल कर" : "Water Tax", value: receiptData?.waterTax },
                        { title: isHindi ? "शौचालय कर" : "Latrine Tax", value: receiptData?.latrineTax },
                        { title: isHindi ? "वर्षा जल संचयन जुर्माना" : "RWH Penalty", value: receiptData?.rwhTax },
                        { title: isHindi ? "शिक्षा उपकर" : "Education Cess", value: receiptData?.educationCessTax },
                        { title: isHindi ? "स्वास्थ्य उपकर" : "Health Cess", value: receiptData?.healthCessTax },
                    ].map((row, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>{index + 1}.</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{row.title}</Text>
                            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{row.value || 0}</Text>
                        </View>
                    ))}
                    <View style={[styles.tableRow, styles.tableTotalRow]}>
                        <Text style={[styles.tableCell, styles.bold, { flex: 2.5, textAlign: 'right', borderRightWidth: 0 }]}>
                            {isHindi ? "कुल राशि (प्रति तिमाही )" : "Total Amount (per quarter)"}
                        </Text>
                        <Text style={[styles.tableCell, styles.bold, { flex: 1, textAlign: 'right' }]}>
                            {receiptData?.totalTax || 0}
                        </Text>
                    </View>
                </View>

                {/* Signature Box */}
                <View style={styles.signatureRow}>
                    <View style={styles.qrCodeContainer}>
                        {qurCode}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.signatureBox}></View>
                        <Text style={styles.signatureText}>
                            {isHindi ? "आवेदक द्वारा हस्ताक्षर किए जाने के लिए" : "To be signed by the Applicant"}
                        </Text>
                    </View>
                </View>

                {/* Note Section */}
                <View style={styles.noteSection}>
                    <Text style={styles.noteTitle}>
                        {isHindi ? "नोट" : "Note"}:-
                    </Text>
                    <View style={styles.listContainer}>
                        {[
                            isHindi
                                ? `कर निर्धारण की सूची, राँची नगर निगम के वेबसाइट ${receiptData?.ulbDtl?.ulbName} पर प्रदर्शित है | : ${receiptData?.ulbDtl?.ulbUrl} OR Call us at ${receiptData?.ulbDtl?.tollFreeNo}`
                                : `The tax assessment list is displayed on the website of ${receiptData?.ulbDtl?.ulbName}. For Details Please Visit : ${receiptData?.ulbDtl?.ulbUrl} OR Call us at ${receiptData?.ulbDtl?.tollFreeNo}`,
                            isHindi
                                ? "नियमावली कंडिका 11.4 के अलोक में वर्षा जल संरक्षण कि व्यवस्था नहीं होने के कारण अतिरिक्त गृह कर लगाया जो संपत्ति कर का 50% होगा | हिदायत दी जाती है कि , वर्षा जल संरक्षण संरचना लगा कर निगम को सूचित करे तथा अतिरिक्त गृह कर से राहत पाये|"
                                : "In the light of manual 11.4, additional house tax will be levied which will be 50% of the property tax due to lack of arrangement of rainwater harvesting. It is advised to inform the corporation by installing rainwater conservation structure and get relief from additional house tax.",
                            isHindi
                                ? "प्रत्येक वित्तीय वर्ष में संपत्ति कर का भुगतान त्रैमासिक देय होगा |"
                                : "Property tax will be paid quartely in each financial year.",
                            isHindi
                                ? "यदि किसी वर्ष के लिए संपूर्ण घृति कर का भुगतान वित्तीय वर्ष के 30 जून के पूर्व कर दिया जाता है , तो करदाता को 5% कि रियायत दी जाएगी |"
                                : "If the entire hourly tax for a year is paid before 30 June of the financial year, a rebate of 5% will be given to the taxpayer.",
                            isHindi
                                ? "किसी देय घृति को निद्रिष्टि समयावधि (प्रत्येक तिमाही ) के अंदर या उसके पूर्व नहीं चुकाया जाता है , तो 1% प्रतिमाह कि दर से साधारण ब्याज देय होगा |"
                                : "Simple Interest will be payable at the rate of 1% per month if any payable are not not paid within or before the specified time period (every quarter).",
                            isHindi
                                ? "यह कर निर्धारण आपके स्व -निर्धारण एवं की गयी घोषणा के आधार पर कि जा रही है,इस स्व -निर्धारण -सह-घोषणा पत्र कि स्थानीय जांच तथा समय निगम करा सकती है एवं तथ्य गलत पाये जाने पर नियमावली कंडिका 13.2 के अनुसार निर्धारित शास्ति (Fine) एवं अंतर राशि देय होगा |"
                                : "This tax assessment is being done on the basis of your self-determination and declaration made, this self-assessment-cum-declaration can be conducted by the local corporation in due course of time and if the facts are found to be incorrect, the penalty prescribed in accordance with manual Condica 13.2 (Fine) and difference amount will be payable.",
                            isHindi
                                ? `${receiptData?.ulbDtl?.hindiUlbName} द्वारा संग्रहित इस संपत्ति कर इन इमारतों / ढांचों को कोई कानूनी हैसियत प्रदान नहीं करता है और / या न ही अपने मालिकों / दखलकार को कानूनी अधिकार प्रदान करता है |`
                                : `The property is collected by ${receiptData?.ulbDtl?.ulbName} does not confer any legal status on these buildings and / or its owners / occupiers Confers any legal right to.`,
                            isHindi
                                ? `अगर आपने नए होल्डिंग न० का आखरी अंक 5/6/7/8 है तो यह विशिष्ट संरचनाओं कि श्रेणी के अंतर्गत माना जायेगा |`
                                : `If the last digit of your new holding number is 5/6/7/8, then it will be considered under the category of specific structures.`,
                        ].map((text, i) => (
                            <View key={i} style={styles.listItem}>
                                <Text style={styles.listItemBullet}>{i + 1}.</Text>
                                <Text style={styles.listItemText}>{text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerNote}>
                    {isHindi
                        ? `नोट :- यह एक कंप्यूटर जनित रसीद है। इस रसीद के लिए भौतिक हस्ताक्षर की आवश्यकता नहीं है।`
                        : `NOTE: This is a computer-generated receipt. This receipt does not require physical signature.`}
                </Text>
            </View>
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
                    {/* Control Bar (Always visible) */}
                    <View style={styles.controlBar}>
                        <Text style={styles.title}>SAM Receipt</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                onPress={() => setIsHindi(!isHindi)}
                                style={[styles.langButton, { backgroundColor: Colors.green }]}
                                disabled={isFrozen}
                            >
                                <Text style={styles.buttonText}>{isHindi ? "English" : "Hindi"}</Text>
                            </TouchableOpacity>
                            
                            {onClose && (
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                    disabled={isFrozen}
                                >
                                    <Feather name="x" size={24} color={Colors.darkGray} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Receipt Content (Scrollable) */}
                    <View style={styles.contentArea}>
                        {isDataLoaded ? (
                            <ScrollView 
                                contentContainerStyle={styles.scrollViewContent}
                            >
                                {/* Using the standard View for content, no need for redundant frozenOverlay wrapper here */}
                                <ScrollView 
                                    horizontal // Explicitly enable horizontal scrolling
                                    contentContainerStyle={styles.scrollViewContent}
                                    directionalLockEnabled={true} 
                                    nestedScrollEnabled={true} 
                                    scrollsToTop={false}
                                >
                                    {ReceiptContent}
                                </ScrollView>
                            </ScrollView>
                        ) : (
                            !isFrozen && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No receipt data available.</Text>
                                    <Text style={styles.emptyTextSmall}>Check ID and API status.</Text>
                                </View>
                            )
                        )}

                        {/* Processing Overlay (Overlaps everything in contentArea when loading) */}
                        {isFrozen && (
                            <View style={styles.processingOverlay}>
                                <ActivityIndicator size="large" color={Colors.blue} />
                                <Text style={styles.processingText}>Fetching Data...</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default SAMModal;

// ===============================================
// --- Stylesheet ---
// ===============================================

const styles = StyleSheet.create({
    // --- Modal & Control Bar Styles (CORRECTED/ADDED) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 251, 251, 0.96)', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: '100%',
        maxWidth: 700, // Slightly reduced max width for better mobile preview
        height: '90%', 
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    controlBar: { // ADDED
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        backgroundColor:Colors.background,
    },
    title: { // ADDED
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    buttonGroup: { // ADDED
        flexDirection: 'row',
        alignItems: 'center',
    },
    langButton: { // ADDED
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: { // ADDED
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8, // Made padding consistent for touchable area
    },

    contentArea: { // ADDED
        flex: 1,
        position: 'relative',
        backgroundColor: Colors.lightGray,
    },
    scrollViewContent: { // ADDED
        padding: 10,
        alignItems: 'center',
    },
    
    // Processing Overlays (ADDED/CORRECTED)
    processingOverlay: { // ADDED
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    processingText: { // ADDED
        marginTop: 10,
        fontSize: 16,
        color: Colors.blue,
    },
    emptyState: { // ADDED
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: '100%',
    },
    emptyText: { // ADDED
        fontSize: 18,
        color: Colors.grayText,
        fontWeight: '600',
    },
    emptyTextSmall: { // ADDED
        fontSize: 14,
        color: Colors.grayText,
        marginTop: 5,
    },

    // --- Receipt Content Styles ---
    receiptWrapper: {
        width: '100%',
        maxWidth: 600, // Receipt fixed width for consistent look
        marginVertical: 10,
    },
    receiptContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15, // FIX: Added horizontal padding to prevent text cutoff
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    receiptHeader: { // RENAMED FROM `header` to avoid conflict
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25, // For circular logo effect
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    heading1: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.black,
        flex: 1,
        flexWrap: 'wrap',
    },
    heading2: {
        fontSize: 10,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: 5,
        fontStyle: 'italic',
    },
    
    // Details Section
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 5,
    },
    detailText: {
        fontSize: 10,
        color: Colors.darkGray,
    },
    bold: {
        fontWeight: 'bold',
        color: Colors.black,
    },
    
    // Paragraph Section
    paragraphContainer: {
        marginBottom: 10,
    },
    paragraphText: {
        fontSize: 10,
        lineHeight: 14,
        color: Colors.darkGray,
        marginBottom: 2,
        textAlign: 'justify', // Added for better text flow
    },

    // Table Styles
    table: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGray,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: Colors.black,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    tableCell: {
        paddingVertical: 6,
        paddingHorizontal: 5,
        fontSize: 10,
        color: Colors.darkGray,
        borderRightWidth: 1,
        borderRightColor: Colors.borderColor,
    },
    tableTotalRow: {
        backgroundColor: Colors.lightGray,
        borderBottomWidth: 0,
    },
    
    // Signature/QR Code
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    qrCodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    signatureBox: {
        width: 150,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: Colors.black,
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 9,
        color: Colors.grayText,
        textAlign: 'center',
    },

    // Note Section
    noteSection: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    noteTitle: {
        fontWeight: 'bold',
        fontSize: 10,
        color: Colors.black,
        marginBottom: 5,
    },
    listContainer: {
        // No horizontal padding needed here as it's handled by receiptContainer padding
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 3,
        // No horizontal padding needed on the row itself
    },
    listItemBullet: {
        fontSize: 10,
        marginRight: 5,
        color: Colors.darkGray,
        // Aligns the bullet to the start of the line
    },
    listItemText: {
        flex: 1, // FIX: Ensures text wraps within the available space
        fontSize: 10,
        lineHeight: 14,
        color: Colors.grayText,
        textAlign: 'justify', // Added for better text flow
    },
    
    // Footer
    footerNote: {
        fontSize: 10,
        color: Colors.red,
        textAlign: 'center',
        paddingTop: 8,
        fontStyle: 'italic',
        fontWeight: '500',
    },

});