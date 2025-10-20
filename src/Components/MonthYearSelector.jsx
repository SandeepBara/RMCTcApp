import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import MonthYearPicker from 'react-native-month-year-picker';

const MonthYearSelector = () => {
    const [selectedDate, setSelectedDate] = useState(null); 
    const [showPicker, setShowPicker] = useState(false);
    const initialDate = selectedDate || new Date(); 
    const onDateChange = (event, date) => {
        setShowPicker(false); 

        if (event === 'dateSet' || Platform.OS === 'ios') {
            setSelectedDate(date);
        }
    };
    const formatDate = (date) => {
        if (!date) return "Select Month/Year";
        
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };
    const handleClear = () => {
        setSelectedDate(null);
    };

    return (
        <View style={styles.container}>
            {/* Display Area and Open Picker Button */}
            <TouchableOpacity 
                onPress={() => setShowPicker(true)} 
                style={styles.displayButton}
            >
                <Text style={styles.displayText}>
                    {formatDate(selectedDate)}
                </Text>
            </TouchableOpacity>

            {/* Clear Button (Visible only if a date is selected) */}
            {selectedDate && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear Date</Text>
                </TouchableOpacity>
            )}

            {/* MonthYearPicker Modal/View */}
            {showPicker && (
                <MonthYearPicker
                    onChange={onDateChange}
                    value={initialDate}
                    minimumDate={new Date(2000, 0)} // Example minimum date
                    maximumDate={new Date(2050, 11)} // Example maximum date
                    locale="en"
                />
            )}
        </View>
    );
};

export default MonthYearSelector;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    displayButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: 250,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    displayText: {
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#dc3545',
        borderRadius: 5,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});