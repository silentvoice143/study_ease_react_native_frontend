import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import DownloadIcon from '../../assets/icons/download-icon';
import { COLORS } from '../../theme/colors';

type CardProps = {
  text: string;
  subtext?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onClickButton?: (event: GestureResponderEvent) => void;
};

export default function Card({
  text,
  subtext,
  onPress,
  onClickButton,
}: CardProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPress = (event: GestureResponderEvent) => {
    if (onClickButton) {
      onClickButton(event);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.96}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Gradient accent line */}
        <View style={styles.accentLine} />

        {/* Subtle background pattern */}
        <View style={styles.backgroundPattern}>
          <View style={styles.patternCircle1} />
          <View style={styles.patternCircle2} />
        </View>

        <View style={styles.cardInner}>
          {/* Elegant document icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <View style={styles.documentIcon}>
                <View style={styles.iconLine1} />
                <View style={styles.iconLine2} />
                <View style={styles.iconLine3} />
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.textContent}>
              <Text style={styles.title} numberOfLines={2}>
                {text}
              </Text>
              {subtext ? (
                <View style={styles.subtextContainer}>
                  <Text style={styles.subtext} numberOfLines={1}>
                    {subtext}
                  </Text>
                </View>
              ) : null}
            </View>

            {onClickButton && (
              <Animated.View
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={handleButtonPress}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  activeOpacity={0.92}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.iconWrapper}>
                      <DownloadIcon />
                    </View>
                    <Text style={styles.buttonText}>Download</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: verticalScale(14),
    paddingHorizontal: scale(2),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    position: 'relative',
    overflow: 'hidden',
    shadowColor: COLORS.voilet.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.voilet.light,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.voilet.dark,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    opacity: 0.03,
  },
  patternCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
  },
  patternCircle2: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#818CF8',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(18),
    paddingTop: verticalScale(21),
  },
  iconContainer: {
    marginRight: scale(16),
  },
  iconBackground: {
    width: scale(52),
    height: scale(52),
    borderRadius: moderateScale(14),
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
  },
  documentIcon: {
    width: scale(26),
    height: scale(26),
    justifyContent: 'center',
  },
  iconLine1: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#6366F1',
    borderRadius: 1.5,
    marginBottom: 4,
  },
  iconLine2: {
    width: '75%',
    height: 2.5,
    backgroundColor: '#818CF8',
    borderRadius: 1.5,
    marginBottom: 4,
  },
  iconLine3: {
    width: '55%',
    height: 2.5,
    backgroundColor: '#A5B4FC',
    borderRadius: 1.5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: scale(12),
  },
  title: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: scaleFont(22),
    letterSpacing: 0.2,
  },
  subtextContainer: {
    marginTop: verticalScale(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtext: {
    fontSize: scaleFont(13),
    color: '#64748B',
    lineHeight: scaleFont(18),
    fontWeight: '400',
    flex: 1,
  },
  downloadButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    backgroundColor: COLORS.voilet.light,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: scale(7),
    width: scale(16),
    height: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
