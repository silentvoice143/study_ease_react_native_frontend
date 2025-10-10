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
    // mobileAds()
    //   .setRequestConfiguration({
    //     maxAdContentRating: MaxAdContentRating.PG,
    //     tagForChildDirectedTreatment: false,
    //     tagForUnderAgeOfConsent: false,
    //     testDeviceIdentifiers: ['EMULATOR'], // <- important
    //   })
    //   .then(() => console.log('AdMob configuration set'));
  }, []);

  return (
    <NavigationContainer>
      <PublicRoutes />
      {/* <BottomTabs /> */}
      {/* <MyTabs /> */}
    </NavigationContainer>
  );
}
