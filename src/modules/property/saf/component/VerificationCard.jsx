import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MonthPicker from 'react-native-month-year-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

function VerificationCard({
  label,
  value,
  selfValue,
  levelVal,
  name,
  type = 'text',
  isCorrect = null,
  isRequired = true,
  error="",
  onChange = () => {},
  option = [],
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [status, setStatus] = useState(
    isCorrect === true ? 'Correct' : isCorrect === false ? 'Incorrect' : null
  );

  const correctIncorrect =
  option?.length > 0 && !option?.some((otp) => otp?.value == selfValue)
    ? ['Incorrect']
    : (selfValue!=null?['Correct', 'Incorrect']:["Incorrect"]);


  const handleVerificationChange = (selectedStatus) => {
    setStatus(selectedStatus);
    if (selectedStatus === 'Correct') {
      onChange(name, selfValue);
    } else {
      onChange(name, '');
    }
  };

  return (
    <View style={styles.card}>
      {/* Label */}
      <View style={styles.rowlabel}>
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Self Assessed */}
      <View style={styles.row}>
        <Text style={styles.value}>Self Assessed</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.value}> {levelVal || '-'}</Text>
      </View>

      {/* ✅ Show Correct/Incorrect only if isCorrect is not null */}
      <View
        style={[
          styles.radioGroup,
          isRequired && styles.radioGroupRequired,
          error && styles.errorBorder,
        ]}
      >
        {correctIncorrect.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.radioOption}
            onPress={() => handleVerificationChange(item)}
          >
            <View
              style={[
                styles.circle,
                status === item ? styles.filledCircle : null,
              ]}
            />
            <Text style={styles.radioLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* If Correct: Show Value */}
      {status === 'Correct' && (
        <View style={styles.staticValueContainer}>
          <Text style={styles.staticValue}>
            {option.length > 0
              ? option.find((otp) => otp.value == selfValue)?.label || value
              : value}
          </Text>
        </View>
      )}

      {/* If Incorrect + Date Picker */}
      {status === 'Incorrect' && (type === 'date' || type === 'yearMonth') && (
        <View style={styles.inputContainer}>
          <Text style={styles.staticValueLabel}>Select Date:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Touchable area to open picker */}
            <TouchableOpacity
              style={[styles.input, { flex: 1 }]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: value ? '#333' : '#aaa' }}>
                {value
                  ? new Date(value).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {/* ❌ Clear button — only show if date selected */}
            {value ? (
              <TouchableOpacity
                onPress={() => onChange(name, '')}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {showPicker &&
          (type === 'date' ? (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="calendar"
              maximumDate={new Date()} // no future date
              minimumDate={new Date(1900, 0)}
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) onChange(name, date.toISOString());
              }}
            />
          ) : (
            <MonthPicker
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) onChange(name, date.toISOString());
              }}
              value={value ? new Date(value) : new Date()}
              minimumDate={new Date(1900, 0)}
              maximumDate={new Date()} // restrict future
              locale="en"
            />
          ))}

        </View>
      )}

      {/* If Incorrect + Text Input */}
      {status === 'Incorrect' && (type === 'text'||type === 'number') && (
        <View style={styles.inputContainer}>
          <Text style={styles.staticValueLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            // onChangeText={(val) => onChange(name, val)}
            onChangeText={(val) => {
              if (type === 'number') {
                const numericValue = val.replace(/[^0-9]/g, '');
                onChange(name, numericValue);
              } else {
                onChange(name, val);
              }
            }}

            placeholder={`Enter ${label}`}
            keyboardType={type === 'number' ? 'numeric' : 'default'}
          />
        </View>
      )}

      {/* If Incorrect + Dropdown */}
      {status === 'Incorrect' && type === 'select' && (
        <Dropdown
          style={styles.dropdown}
          data={option}
          labelField="label"
          valueField="value"
          placeholder="Select"
          value={value}
          onChange={(item) => onChange(name, item.value)}
        />
      )}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>

      )}
    </View>
  );
}

export default VerificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(3),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: 'white',
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  radioGroupRequired: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8f9ff',
    marginHorizontal: responsiveWidth(2),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircle: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: responsiveWidth(2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  staticValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
  },
  staticValueLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    fontWeight: '500',
  },
  staticValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#007BFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    paddingHorizontal: responsiveWidth(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    backgroundColor: '#fff',
  },
  clearBtn: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: responsiveFontSize(2),
    color: '#ff4444',
    fontWeight: 'bold',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },

});
