import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../theme/colors';

export const GlowCircle = ({ size = 100, colors = ['#ffffff', '#e0e0ff'] }) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.2, y: 0.2 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.glow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    opacity: 0.4,
    shadowColor: COLORS.voilet.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 100,
    elevation: 10, // for Android shadow
  },
});
