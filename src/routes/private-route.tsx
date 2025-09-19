import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';

import { useAppSelector } from '../hooks/use-redux';
import SplashScreen from '../screens/splash';

const Stack = createNativeStackNavigator();

export default function PrivateRoutes() {
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
