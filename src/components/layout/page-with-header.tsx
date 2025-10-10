import { View, Text, StyleSheet, Keyboard, StatusBar } from 'react-native';
import React from 'react';
import Header from '../common/header';
import { scale, verticalScale } from '../../utils/sizer';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../theme/colors';
import { useRoute } from '@react-navigation/native';

const PageWithHeader = ({
  children,
  headerTitle,
  from,
}: {
  children: React.ReactNode;
  headerTitle?: string;
  from?: string;
}) => {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const path = useRoute();
  const hideNavforPath = ['Noteview'];

  React.useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface.background }}>
      <StatusBar
        backgroundColor={COLORS.voilet.light}
        barStyle="dark-content"
      />
      <LinearGradient colors={[COLORS.voilet.light, COLORS.surface.background]}>
        <Header headerTitle={headerTitle} navigateBack={from ?? ''} />
      </LinearGradient>

      <View style={{ flex: 1, paddingTop: verticalScale(12) }}>{children}</View>
      {/* {!keyboardVisible && !hideNavforPath.includes(path.name) && (
        <View
          style={{
            height: verticalScale(64),
            borderRadius: scale(32),
            backgroundColor: COLORS.gray.dark,
            width: '80%',
            position: 'absolute',
            bottom: verticalScale(20),
            alignSelf: 'center',
          }}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default PageWithHeader;
