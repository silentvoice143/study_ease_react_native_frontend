import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import PublicProfile from '../screens/profile';
import BottomTabs from '../components/layout/bottom-nav';
import NotificationScreen from '../screens/notification';
import NotificationViewScreen from '../screens/notificationview';

const Stack = createNativeStackNavigator();

export default function PublicRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none', // disables animation
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen
        name="NotificationView"
        component={NotificationViewScreen}
      />
      {/* Screens WITH tabs */}
      <Stack.Screen
        options={{
          animation: 'slide_from_left', // built-in animations
        }}
        name="MainTabs"
        component={BottomTabs}
      />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfile}
        options={{
          animation: 'slide_from_right', // built-in animations
        }}
      />
    </Stack.Navigator>
  );
}
