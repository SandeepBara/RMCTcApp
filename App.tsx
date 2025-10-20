import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

// Screen Imports
import LoginScreen from "./src/pages/LoginScreen";
import DashBoard from "./src/pages/DashBoard";
import SafInbox from "./src/modules/property/saf/Inbox";
import SurveyPage from "./src/modules/property/saf/SurveyPage"
import SearchSaf from "./src/modules/property/saf/SearchSaf";
import SafDetails from "./src/modules/property/saf/SafDetails";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <AlertNotificationRoot>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{ 
              headerShown: false 
            }}
          >
            {/* Login Screen */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            {/* Dashboard Screen */}
            <Stack.Screen
              name="DashBoard"
              component={DashBoard}
            />
            
            {/* Property */}
            <Stack.Screen
              name="FieldVarification" 
              component={SafInbox}
            />
            <Stack.Screen
              name="SurveyPage" 
              component={SurveyPage}
            />
            <Stack.Screen
              name="SearchAssesment" 
              component={SearchSaf}
            />
            <Stack.Screen
              name="SafDueDetails" 
              component={SafDetails}
            />

          </Stack.Navigator>
        </NavigationContainer>
        <Toast /> 
      </AlertNotificationRoot>
    </GestureHandlerRootView>
  );
}

export default App;