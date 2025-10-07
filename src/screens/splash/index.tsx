import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../../theme/colors';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = ({ navigation }) => {
  const animationRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    animationRef?.current?.play();

    setTimeout(() => {
      setLoading(false),
        navigation.replace('MainTabs', {
          screen: 'Home', // the tab name
        });
    }, 2000);
  }, []);
  return (
    <View style={{ flex: 1, width: '100%' }}>
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
