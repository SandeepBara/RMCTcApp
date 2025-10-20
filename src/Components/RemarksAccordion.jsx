import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const formatTimeAMPM = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const getShortRole = (roleCode) => (roleCode ? roleCode.substring(0, 3) : 'NA');

// Placeholder for common color definitions
const Colors = {
    blue900: '#1e3a8a',
    blue800: '#1e40af',
    gray100: '#f3f4f6',
    gray800: '#1f2937',
    gray600: '#4b5563',
    gray500: '#6b7280',
    gray900: '#111827',
    green600: '#059669',
    yellow600: '#ca8a04',
    red600: '#dc2626',
    blue400: '#60a5fa',
    white: '#ffffff',
};

const RemarksAccordion = ({ color, title = 'Level Remarks', remarks = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actionStyleMap = {
        forward: Colors.green600,
        backward: Colors.yellow600,
        'back to citizen': Colors.red600,
    };

    const toTitleCase = (str) =>
        str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );

    const renderHeader = () => {
        return (
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={[
                    styles.header,
                    { backgroundColor: color || Colors.blue900 },
                    isOpen ? styles.headerOpen : styles.headerClosed,
                ]}
                activeOpacity={0.8}
            >
                <Text style={styles.headerText}>{title}</Text>
                <Feather 
                    name={isOpen ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={Colors.white} 
                />
            </TouchableOpacity>
        );
    };

    const renderRemarkTimeline = () => {
        if (!remarks || remarks.length === 0) {
            return (
                <Text style={styles.noRemarksText}>
                    No remarks available
                </Text>
            );
        }

        return (
            <View style={styles.timelineContainer}>
                {remarks.map((remark, idx) => {
                    const action = remark.action?.toLowerCase();
                    const actionColor = actionStyleMap[action] || Colors.gray600;

                    return (
                        <View key={idx} style={styles.timelineItem}>
                            {/* Circle indicator */}
                            <View
                                style={[styles.circleIndicator, { backgroundColor: Colors.blue800 }]}
                                accessible={true}
                                accessibilityLabel={remark.roleCode || 'NA'}
                            >
                                <Text style={styles.circleText}>
                                    {getShortRole(remark.roleCode)}
                                </Text>
                            </View>

                            {/* Remark Box */}
                            <View style={styles.remarkBox}>
                                <Text style={styles.remarkMessage}>
                                    {remark.message}
                                </Text>

                                <View style={styles.detailsRow}>
                                    {/* Date/Time and Action */}
                                    {remark.receivingDate && (
                                        <Text style={styles.detailText}>
                                            {formatTimeAMPM(remark.receivingDate) || '-'} • {new Date(remark?.receivingDate).toLocaleDateString() || '-'} 
                                            <Text style={styles.receivingText}> (Receiving)</Text>
                                        </Text>
                                    )}
                                    
                                    {/* Action Text */}
                                    {remark?.action && (
                                        <Text style={[styles.detailText, { color: actionColor }]}>
                                            ({toTitleCase(remark.action)})
                                        </Text>
                                    )}
                                </View>

                                {remark.userName && (
                                    <Text style={styles.userNameText}>
                                        {remark.userName}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderHeader()}

            {/* Body */}
            {isOpen && (
                <View style={styles.body}>
                    {renderRemarkTimeline()}
                </View>
            )}
        </View>
    );
};

export default RemarksAccordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        overflow: 'hidden', // Ensures shadow and border work nicely
        borderWidth: 1,
        borderColor: Colors.blue800,
        marginVertical: 8,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    // --- Header Styles ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        height: 45, // Fixed height for consistent look
    },
    headerOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderRadius: 10, // Overwritten by specific borderRadius settings if needed
    },
    headerClosed: {
        borderRadius: 10,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 16,
        color: Colors.white,
    },

    // --- Body & Timeline Styles ---
    body: {
        backgroundColor: Colors.gray100,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    noRemarksText: {
        color: Colors.gray500,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
    },
    timelineContainer: {
        marginLeft: 10,
        paddingLeft: 10, // Space for the vertical line
        borderLeftWidth: 2,
        borderLeftColor: Colors.blue800,
    },
    timelineItem: {
        position: 'relative',
        marginBottom: 20,
        marginLeft: 15, // Space to push the remark box away from the vertical line
    },
    
    // --- Circle Indicator Styles (replaces absolute positioning with margin in React Native) ---
    circleIndicator: {
        position: 'absolute',
        top: 0,
        left: -27, // Adjust this value to center the circle on the vertical line
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // makes it circular
        width: 35,
        height: 35,
        zIndex: 10, // Ensure it's on top of the border
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    circleText: {
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: 10,
    },

    // --- Remark Box Styles ---
    remarkBox: {
        backgroundColor: Colors.white,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        padding: 12,
        borderRadius: 8,
    },
    remarkMessage: {
        marginBottom: 5,
        color: Colors.gray800,
        fontSize: 14,
    },
    detailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        color: Colors.gray600,
        fontSize: 12,
    },
    detailText: {
        color: Colors.gray600,
        fontSize: 12,
    },
    receivingText: {
        color: Colors.blue400,
    },
    userNameText: {
        marginTop: 5,
        fontWeight: '600',
        color: Colors.gray900,
        fontSize: 14,
    },
});
