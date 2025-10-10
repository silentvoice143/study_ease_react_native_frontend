import { View, Text, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../../theme/colors';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useNetworkStatus } from '../../hooks/use-network';

const SplashScreen = ({ navigation }: any) => {
  const animationRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStatus();

  useEffect(() => {
    animationRef?.current?.play();

    setTimeout(() => {
      setLoading(false);
      if (!isConnected) {
        navigation.replace('MainTabs', {
          screen: 'Offline', // the tab name
        });
      } else {
        navigation.replace('MainTabs', {
          screen: 'Home', // the tab name
        });
      }
    }, 2000);
  }, [isConnected, navigation]);
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <StatusBar
        backgroundColor={COLORS.voilet.light}
        barStyle="dark-content"
      />
      <LottieView
        ref={animationRef}
        source={require('../../assets/animation/Scene-1.json')}
        autoPlay
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        loop={true}
        // onAnimationFinish={() => {
        //   navigation.replace('Home');
        // }}
      />
    </View>
  );
};

export default SplashScreen;
