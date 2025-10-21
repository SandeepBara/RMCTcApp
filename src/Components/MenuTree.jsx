import  { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getUserDetails } from '../utils/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from '../Constants/css';

const { width } = Dimensions.get('window');

// function to calculate number of columns dynamically
const getNumColumns = () => {
  if (width >= 900) return 4; // tablet big screen
  if (width >= 600) return 3; // medium devices
  return 2; // default mobile
};

const MenuTree = () => {
  const [menuStack, setMenuStack] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuTree = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails && userDetails?.menuTree) {
          setMenuStack([userDetails?.menuTree]);
        }
      } catch (err) {
        console.log('Error fetching menu:', err);
      }
    };
    fetchMenuTree();
  }, []);

  const getIconName = iconName => {
    const glyphs = Icon.getRawGlyphMap?.() || Icon.glyphMap;
    return glyphs && glyphs[iconName] ? iconName : 'dashboard';
  };

  const currentMenu = menuStack[menuStack.length - 1] || [];

  const handlePress = (item) => {console.log("item=>",item);
    if (item.children?.length) {
      setMenuStack([...menuStack, item.children]);
    } else {
      navigation.navigate(item.url); // use screen name
    }
  };

  const goBack = () => {
    if (menuStack.length > 1) {
      setMenuStack(menuStack.slice(0, -1));
    } else {
      navigation.goBack();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
      <View style={styles.iconContainer}>
        <Icon name={getIconName(item.icon)} size={40} style={styles.icon} />
      </View>
      <Text style={styles.boxText}>{item.name}</Text>

      {item.children?.length ? (
        <Icon
          name="chevron-right"
          size={24}
          color="#666"
          style={{ marginTop: 8 }}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={styles.safeArea}>
      {/* Header */}
      <View style={styles.cardHeader}>
        {menuStack.length > 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#090748ff" />
            <Text style={styles.cardText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.cardText}>Menu <Icon name="home" size={24} color="#666" /></Text>
        )}
      </View>

      {/* FlatList with no ScrollView wrapping */}
      <FlatList
        data={currentMenu}
        keyExtractor={(item, index) =>
          item?.id ? `${item.id}-${index}` : `${item.name}-${index}`
        }
        renderItem={renderItem}
        numColumns={getNumColumns()}
        contentContainerStyle={styles.scrollContainer}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        // if needed for nested navigation screens
        nestedScrollEnabled={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No menu items found
          </Text>
        }
      />
    </SafeAreaProvider>
  );
};

export default MenuTree;

