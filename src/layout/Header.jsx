import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../Constants/css';
import { showToast } from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
const Header = ({ navigation }) => {
    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.openDrawer ? navigation.openDrawer() : null}>
                    <Icon name="menu" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Search clicked')}>
                    <Icon name="search" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;

