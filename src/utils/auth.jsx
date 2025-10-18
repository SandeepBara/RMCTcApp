import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

export const setAuthToken = async (token, userDetails) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  } catch (error) {
    console.error('Error saving auth data', error);
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userDetails');
  } catch (error) {
    console.error('Error removing auth data', error);
  }
};

export const getToken = async () => {
  return JSON.parse(await AsyncStorage.getItem('token'));
};

export const getUserDetails = async () => {
  const details = await AsyncStorage.getItem('userDetails');
  return details ? JSON.parse(details) : null;
};

export const getLoginType = async () => {
  const details = await getUserDetails();
  return details?.loginType;
};

export function useAuthToken() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const t = await getToken();
        setToken(t);
      } catch (error) {
        console.log('Token error:', error);
      }
    };
    fetchToken();
  }, []);

  return token;
}

export function useAuthUser(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const t = await getUserDetails();
        setUser(t);
      } catch (error) {
        console.log('getUserDetails error:', error);
      }
    };
    fetchToken();
  }, []);

  return user;
}

