// components/HeaderNavigation.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../utils/toast';
import styles from '../Constants/css';
import { useAuthToken } from '../utils/auth';
import axios from 'axios';
import { logoutApi } from '../api/endpoint';
const HeaderNavigation = ({ title, showBack = true, customBackAction }) => {
  const navigation = useNavigation();
  const [showConfirm, setShowConfirm] = useState(false);
  const token = useAuthToken();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      navigation.goBack();
    }
  };

  const handleHome = () => {
    navigation.navigate('DashBoard'); // Adjust this to your home screen name
  };


  const handleLogout = async () => {
    try {
      const response = await axios.post(logoutApi,{},{headers:{ Authorization: `Bearer ${token}`}});
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userDetails');

      showToast('success', 'Logged out successfully!');

      navigation.navigate('Login');
    } catch (error) {
      showToast('error', 'Logout failed!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Conditional rendering for back button */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.navButtonPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={handleHome} style={styles.navButton}>
        <Text style={styles.navText}>🏠</Text>
      </TouchableOpacity>
      {/* Logout button */}
      <TouchableOpacity
        style={[styles.button,{backgroundColor:"#ec3636ff",color:"#fff"}]}
        onPress={() => setShowConfirm(true)}
      >
        <Text style={[{color:"#fff"}]}>Logout</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderNavigation;


