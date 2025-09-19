import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import Home from '../screens/home';
import StreamScreen from '../screens/stream';
import NoteViewScreen from '../screens/noteview';
import PublicProfile from '../screens/profile';

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Stream" component={StreamScreen} />
      <Stack.Screen name="Noteview" component={NoteViewScreen} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
}
