import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import PublicRoutes from './public-route';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export default function AppNavigator() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized');
      });
  }, []);

  return (
    <NavigationContainer>
      <PublicRoutes />
    </NavigationContainer>
  );
}
