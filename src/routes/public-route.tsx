import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import Home from '../screens/home';
import StreamScreen from '../screens/stream';
import NoteViewScreen from '../screens/noteview';
import PublicProfile from '../screens/profile';
import BottomTabs from '../components/layout/bottom-nav';
import NotificationScreen from '../screens/notification';

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
      {/* Screens WITH tabs */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />
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
