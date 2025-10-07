import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, AppStateStatus, AppState } from 'react-native';

import PublicRoutes from './public-route';
import PrivateRoutes from './private-route';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux';
import BottomTabs from '../components/layout/bottom-nav';

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <PublicRoutes />
      {/* <BottomTabs /> */}
      {/* <MyTabs /> */}
    </NavigationContainer>
  );
}
