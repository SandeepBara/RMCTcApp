import React, { useCallback, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../../../Constants/Colors';
import {formatLocalDate} from "../../../../utils/common";
import GeoTagModal from "./GeoTagModal";

// NOTE: I am keeping 'onClose' and 'handleSubmitPreview' functions,
// as they are necessary for the button actions in the modal footer.
function VerificationPreviewModal({
    onSuccess=()=>{}, 
    onClose=()=>{},
    masterData={},
    newWardList=[],
    apartMentList=[], 
    safData={},
    verificationData={},
    extraFloor=[], 
}) {
    const [isGeoTagModal,setIsGeoTagModal] = useState(false);
    console.log("masterData",masterData);
    const getLabelById = useCallback((id, list, key = 'wardNo') => {
        if (!id || !list) return 'N/A';
        return list.find(item => String(item?.id) === String(id))?.[key] || 'N/A';
    }, []);


    const verifiedPropertyLabel = verificationData?.propTypeMstrId;
    const safFloors = safData?.floor || []; 
    const verifiedFloors = verificationData?.floor || []; 
    const extraFloorsArray = Array.isArray(extraFloor) ? extraFloor : [];
    const {
        mobileTower, towerArea, installationDate,
        hoarding, hoardingArea, hoardingInstallationDate,
        petrolPump, pumpArea, pumpInstallationDate,
        rainHarvesting, completionDate,
        remarks, 
    } = verificationData || {};


    const isNotVacantLand = verifiedPropertyLabel!= 4;

    const capturerImag = async(newGeoTagData)=>{
        console.log(newGeoTagData);
    }



    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Preview Details</Text>
                    
                    <ScrollView style={styles.modalContent}>
                        {/* Property Details Table */}
                        <View style={styles.tableContainer}>
                            <Text style={styles.tableTitle}>Property Details</Text>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Field</Text>
                                    <Text style={styles.tableHeaderText}>Current Value</Text>
                                    <Text style={styles.tableHeaderText}>Verified Value</Text>
                                </View>

                                {/* Ward No */}
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellLabel}>Ward No</Text>
                                    <Text style={styles.tableCell}>{safData?.wardNo || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>
                                        {getLabelById(verificationData?.wardMstrId, masterData?.wardList, 'wardNo')}
                                    </Text>
                                </View>

                                {/* New Ward No */}
                                <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                    <Text style={styles.tableCellLabel}>New Ward No</Text>
                                    <Text style={styles.tableCell}>{safData?.newWardNo || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>
                                        {getLabelById(verificationData?.newWardMstrId, newWardList, 'wardNo')}
                                    </Text>
                                </View>

                                {/* Zone */}
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellLabel}>Zone</Text>
                                    <Text style={styles.tableCell}>{safData?.zone || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>
                                        {getLabelById(verificationData?.zoneMstrId, masterData?.zoneType, 'zone')}
                                    </Text>
                                </View>

                                {/* Property Type */}
                                <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                    <Text style={styles.tableCellLabel}>Property Type</Text>
                                    <Text style={styles.tableCell}>{safData?.propertyType || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{getLabelById(verificationData?.propTypeMstrId, masterData?.propertyType, 'propertyType')}</Text>
                                </View>
                                
                                {verifiedPropertyLabel == 3 && (
                                    <>                                     
                                        <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                            <Text style={styles.tableCellLabel}>Apartment Name</Text>
                                            <Text style={styles.tableCell}>{safData?.apartmentName || 'N/A'}</Text>
                                            <Text style={styles.tableCell}>{verificationData?.apartmentName || ' '}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCellLabel}>Flat Registry Date</Text>
                                            <Text style={styles.tableCell}>{safData?.flatRegistryDate || 'N/A'}</Text>
                                            <Text style={styles.tableCell}>{verificationData?.flatRegistryDate || ' '}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Dynamic Floor Details, Extra Floors & Remarks */}
                        {isNotVacantLand && (
                            <>
                                
                                {verifiedFloors.map((floor, index) => {
                                    const safFloor = safFloors[index] || {}; 
                                    const floorPrefix = floor.floorName || `Floor ${index + 1}`;
                                    const getMstrLabel = (list,id,label) => getLabelById(id, list, label); 

                                    return (
                                        <View key={index} style={styles.tableContainer}>
                                            <Text style={styles.tableTitle}>{floorPrefix} Details</Text>
                                            <View style={styles.table}>
                                                <View style={styles.tableHeader}>
                                                    <Text style={styles.tableHeaderText}>Field</Text>
                                                    <Text style={styles.tableHeaderText}>Current Value</Text>
                                                    <Text style={styles.tableHeaderText}>Verified Value</Text>
                                                </View>
                                                
                                                {/* Floor Rows */}
                                                {[
                                                    { "label": 'Usage Type', "current": safFloor.usageType, "list":masterData?.usageType, "id": floor.usageTypeMasterId, field:"usageType" },
                                                    { "label": 'Occupancy Type', "current": safFloor.occupancyName, "list":masterData?.occupancyType, "id": floor.occupancyTypeMasterId, field:"occupancyName" },
                                                    { "label": 'Construction Type', "current": safFloor.constructionType, "list":masterData?.constructionType, "id": floor.constructionTypeMasterId, field:"constructionType" },
                                                    { "label": 'Built-up Area', "current": safFloor.builtupArea,  "id": floor.builtupArea,  },
                                                    { "label": 'Date From', "current": formatLocalDate(safFloor.dateFrom), "id": formatLocalDate(floor.dateFrom), },
                                                    { "label": 'Date Upto', "current": formatLocalDate(safFloor.dateUpto), "id": formatLocalDate(floor.dateUpto), },
                                                ].map((item, i) => (
                                                    <View key={i} style={[styles.tableRow, i % 2 !== 0 && styles.tableRowAlternate]}>
                                                        <Text style={styles.tableCellLabel}>{item.label}</Text>
                                                        <Text style={styles.tableCell}>{item.current || 'N/A'}</Text>
                                                        <Text style={styles.tableCell}>{item?.list ? getLabelById(item.id, item.list, item.field) : item?.id}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* Extra Floor Details Cards: Iterate over extraFloor prop */}
                                {extraFloorsArray.length > 0 && extraFloorsArray.map((floor, floorIndex) => (
                                    <View key={floorIndex} style={[styles.extraFloorContainer]}>
                                        <Text style={[styles.cardTitle,{backgroundColor:"red"}]}>Extra Floor {floorIndex + 1} Details</Text>
                                        
                                        {[
                                            { "label": 'Usage Type',  "list":masterData?.usageType, "id": floor.usageTypeMasterId, field:"usageType" },
                                            { "label": 'Occupancy Type', "list":masterData?.occupancyType, "id": floor.occupancyTypeMasterId, field:"occupancyName" },
                                            { "label": 'Construction Type', "list":masterData?.constructionType, "id": floor.constructionTypeMasterId, field:"constructionType" },
                                            { "label": 'Built-up Area', "id": floor.builtupArea,  },
                                            { "label": 'Date From',  "id": formatLocalDate(floor.dateFrom), },
                                            { "label": 'Date Upto',  "id": formatLocalDate(floor.dateUpto), },
                                            
                                        ].map((item, idx) => (
                                            <View key={idx} style={[styles.cardRow, idx % 2 !== 0 && styles.extraCardRowAlternate]}>
                                                <Text style={styles.tableCellLabel}>{item.label}</Text>
                                                <Text style={styles.tableCell}>{item?.list ? getLabelById(item.id, item.list, item.field) : item?.id}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}

                                {/* Remarks Section */}
                                {(remarks) && (
                                    <View style={styles.remarksContainer}>
                                        <Text style={styles.tableTitle}>Remarks</Text>
                                        <View style={styles.remarksBox}>
                                            <Text style={styles.remarksText}>
                                                {remarks || 'No remarks'}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

                        {/* Other Property Features Section (Simplified lookup from verificationData) */}
                        {isNotVacantLand && (
                            <View style={styles.tableContainer}>
                                <Text style={styles.tableTitle}>Other Property Features</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.tableHeaderText}>Field</Text>
                                        <Text style={styles.tableHeaderText}>Current Value</Text>
                                        <Text style={styles.tableHeaderText}>Verified Value</Text>
                                    </View>

                                    {/* Mobile Tower */}
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCellLabel}>Mobile Tower</Text>
                                        <Text style={styles.tableCell}>{safData?.isMobileTower ? "Yes":"No"}</Text>
                                        <Text style={styles.tableCell}>{verificationData?.isMobileTower ? "Yes":"No"}</Text>
                                    </View>
                                    {verificationData?.isMobileTower && (
                                        <>
                                            <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                                <Text style={styles.tableCellLabel}>Tower Area</Text>
                                                <Text style={styles.tableCell}>{safData?.towerArea || 'N/A'}</Text>
                                                <Text style={styles.tableCell}>{verificationData?.towerArea || 'N/A'}</Text>
                                            </View>
                                            <View style={styles.tableRow}>
                                                <Text style={styles.tableCellLabel}>Installation Date</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(safData?.towerInstallationDate)}</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(verificationData?.towerInstallationDate)}</Text>
                                            </View>
                                        </>
                                    )}

                                    {/* Hoarding */}
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCellLabel}>Hoarding</Text>
                                        <Text style={styles.tableCell}>{safData?.isHoardingBoard ? "Yes":"No"}</Text>
                                        <Text style={styles.tableCell}>{verificationData?.isHoardingBoard ? "Yes":"No"}</Text>
                                    </View>
                                    {verificationData?.isHoardingBoard && (
                                        <>
                                            <View style={styles.tableRow}>
                                                <Text style={styles.tableCellLabel}>Hoarding Area</Text>
                                                <Text style={styles.tableCell}>{safData?.hoardingArea || 'N/A'}</Text>
                                                <Text style={styles.tableCell}>{verificationData?.hoardingArea || 'N/A'}</Text>
                                            </View>
                                            <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                                <Text style={styles.tableCellLabel}>Installation Date</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(safData?.hoardingInstallationDate)}</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(verificationData?.hoardingInstallationDate)}</Text>
                                            </View>
                                        </>
                                    )}

                                    {/* Petrol Pump */}
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCellLabel}>Petrol Pump</Text>
                                        <Text style={styles.tableCell}>{safData?.isPetrolPump ? "Yes":"No"}</Text>
                                        <Text style={styles.tableCell}>{verificationData?.isPetrolPump ? "Yes":"No"}</Text>
                                    </View>
                                    {verificationData?.isPetrolPump && (
                                        <>
                                            <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                                <Text style={styles.tableCellLabel}>Pump Area</Text>
                                                <Text style={styles.tableCell}>{safData?.underGroundArea || 'N/A'}</Text>
                                                <Text style={styles.tableCell}>{verificationData?.underGroundArea || 'N/A'}</Text>
                                            </View>
                                            <View style={styles.tableRow}>
                                                <Text style={styles.tableCellLabel}>Installation Date</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(safData?.petrolPumpCompletionDate)}</Text>
                                                <Text style={styles.tableCell}>{formatLocalDate(verificationData?.petrolPumpCompletionDate)}</Text>
                                            </View>
                                        </>
                                    )}

                                    {/* Rainwater Harvesting */}
                                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                                        <Text style={styles.tableCellLabel}>Rainwater Harvesting</Text>
                                        <Text style={styles.tableCell}>{safData?.isWaterHarvesting ? "Yes":"No"}</Text>
                                        <Text style={styles.tableCell}>{verificationData?.isWaterHarvesting ? "Yes":"No"}</Text>
                                    </View>
                                    {verificationData?.isWaterHarvesting && (
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCellLabel}>Completion Date</Text>
                                            <Text style={styles.tableCell}>{formatLocalDate(safData?.waterHarvestingDate)}</Text>
                                            <Text style={styles.tableCell}>{formatLocalDate(verificationData?.waterHarvestingDate)}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={[styles.modalButton, styles.submitButton]}
                            onPress={handleSubmitPreview}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
            <>
                <TouchableOpacity
                    style={styles.getLocationButton}
                    onPress={() => setIsGeoTagModal(true)}
                >
                    <Text style={styles.getLocationButtonText}>
                    📍 Get Current Location
                    </Text>
                </TouchableOpacity>
                <Text style={styles.locationHelpText}>
                    * Location is required before capturing photos
                </Text>
            </>
            {isGeoTagModal &&(
                <GeoTagModal
                    isRwh={verificationData?.isWaterHarvesting}
                    onClose={()=>setIsGeoTagModal(false)} 
                    onChange={capturerImag}
                />
            )}
        </Modal>
    );
}

export default VerificationPreviewModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: responsiveWidth(90),
        maxHeight: responsiveHeight(90),
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: responsiveWidth(4),
        elevation: 10,
    },
    extraFloorContainer: {
        marginTop: responsiveHeight(2),
        padding: responsiveWidth(4),
        backgroundColor: 'rgba(226, 67, 67, 0.3)',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: responsiveHeight(2),
    },
    extraCardRowAlternate: {
        backgroundColor: 'rgba(126, 80, 80, 0.3)',
    },
    modalTitle: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: responsiveHeight(1.5),
        textAlign: 'center',
    },
    modalContent: {
        flexGrow: 1,
        paddingBottom: responsiveHeight(1),
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: responsiveHeight(1.5),
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: responsiveWidth(1),
    },
    closeButton: {
        backgroundColor: '#ccc',
    },
    closeButtonText: {
        color: '#333',
        fontWeight: '700',
        fontSize: responsiveFontSize(1.8),
    },
    submitButton: {
        backgroundColor: Colors.primary,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: responsiveFontSize(1.8),
    },
    
    // Table/Card Specific Styles
    tableContainer: {
        marginBottom: responsiveHeight(2),
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableTitle: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: '700',
        backgroundColor: Colors.borderColor,
        color: '#fff',
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
    },
    table: {
        width: '100%',
        backgroundColor: '#fff',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeaderText: {
        flex: 1,
        padding: responsiveWidth(2),
        fontWeight: 'bold',
        fontSize: responsiveFontSize(1.6),
        textAlign: 'center',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'stretch',
    },
    tableRowAlternate: {
        backgroundColor: '#fafafa',
    },
    tableCellLabel: {
        flex: 1,
        padding: responsiveWidth(2),
        fontWeight: '500',
        fontSize: responsiveFontSize(1.6),
        color: '#333',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        alignSelf: 'center',
        width: '33.33%', // Ensure columns are relatively equal
    },
    tableCell: {
        flex: 1,
        padding: responsiveWidth(2),
        fontSize: responsiveFontSize(1.6),
        color: '#666',
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        alignSelf: 'center',
        width: '33.33%', // Ensure columns are relatively equal
    },
    
    // Extra Floor Card Styles
    cardContainer: {
        marginBottom: responsiveHeight(2),
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    cardTitle: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: '700',
        backgroundColor: Colors.secondary,
        color: '#fff',
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: responsiveWidth(3),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cardRowAlternate: {
        backgroundColor: '#fafafa',
    },
    cardLabel: {
        fontSize: responsiveFontSize(1.6),
        fontWeight: '500',
        color: '#333',
        width: '45%',
    },
    cardValue: {
        fontSize: responsiveFontSize(1.6),
        color: Colors.primary,
        fontWeight: 'bold',
        width: '55%',
        textAlign: 'right',
    },

    // Remarks Styles
    remarksContainer: {
        marginBottom: responsiveHeight(2),
    },
    remarksBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: responsiveWidth(3),
        backgroundColor: '#fafafa',
    },
    remarksText: {
        fontSize: responsiveFontSize(1.6),
        color: '#666',
    },
});