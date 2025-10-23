import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
  View,
} from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../theme/colors';
import { verticalScale } from '../../utils/sizer';

type CustomProps = BottomTabBarButtonProps & {
  activeIcon: ImageSourcePropType;
  inActiveIcon: ImageSourcePropType;
};

export default function CustomTabButton({ ...props }: any) {
  const {
    activeIcon,
    inActiveIcon,
    onPress,
    'aria-selected': selected,
  } = props;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
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
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(48),
    width: verticalScale(48),
    borderRadius: verticalScale(24),
  },
  icon: {
    width: verticalScale(24),
    height: verticalScale(24),
    resizeMode: 'contain',
  },
  active: {
    tintColor: '#6c63ff',
  },
});
