// components/CustomTabButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  GestureResponderEvent,
  ImageSourcePropType,
  View,
} from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../theme/colors';
import { moderateScale } from '../../utils/sizer';

type CustomProps = BottomTabBarButtonProps & {
  /** icons can be require(...) or { uri: string } */
  activeIcon: ImageSourcePropType;
  inActiveIcon: ImageSourcePropType;
};

export default function CustomTabButton({ ...props }: any) {
  const {
    activeIcon,
    inActiveIcon,
    onPress,
    accessibilityState,
    'aria-selected': selected,
  } = props;
  console.log(props);

  return (
    <View
      style={{
        height: moderateScale(48),
        width: moderateScale(60),
        borderRadius: moderateScale(24),
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        // onLongPress={handleLongPress}
        style={styles.container}
      >
        <Image
          source={selected ? activeIcon : inActiveIcon}
          style={[styles.icon, selected && styles.active]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  active: {
    // optional highlight when focused
    tintColor: '#6c63ff',
  },
});
