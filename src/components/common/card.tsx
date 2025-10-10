import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';
import DownloadIcon from '../../assets/icons/download-icon';

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
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
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
        activeOpacity={0.95}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Book/Folder Icon Decoration */}
        <View style={styles.decorativeCorner}>
          <View style={styles.cornerTriangle} />
        </View>

        <View style={styles.cardInner}>
          {/* Document Icon */}
          <View style={styles.iconCircle}>
            <View style={styles.documentLines}>
              <View style={styles.docLine1} />
              <View style={styles.docLine2} />
              <View style={styles.docLine3} />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {text}
              </Text>
              {subtext ? (
                <View style={styles.subtextContainer}>
                  <View style={styles.dotSeparator} />
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
                  style={styles.buttonWrapper}
                  onPress={handleButtonPress}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  activeOpacity={0.9}
                >
                  <View style={styles.button}>
                    <View style={styles.downloadIconContainer}>
                      <DownloadIcon />
                    </View>
                    <Text style={styles.buttonText}>Download</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Notebook lines effect */}
        <View style={styles.notebookLines}>
          <View style={styles.notebookLine} />
          <View style={styles.notebookLine} />
          <View style={styles.notebookLine} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: verticalScale(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  decorativeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: scale(40),
    height: scale(40),
    overflow: 'hidden',
  },
  cornerTriangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: scale(40),
    borderTopWidth: scale(40),
    borderRightColor: 'transparent',
    borderTopColor: '#EEF2FF',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  iconCircle: {
    width: scale(48),
    height: scale(48),
    borderRadius: moderateScale(10),
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(14),
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  documentLines: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
  },
  docLine1: {
    width: '100%',
    height: 2,
    backgroundColor: '#6366F1',
    borderRadius: 1,
    marginBottom: 3,
  },
  docLine2: {
    width: '80%',
    height: 2,
    backgroundColor: '#818CF8',
    borderRadius: 1,
    marginBottom: 3,
  },
  docLine3: {
    width: '60%',
    height: 2,
    backgroundColor: '#A5B4FC',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: scale(12),
  },
  title: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: scaleFont(21),
    letterSpacing: 0.1,
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginRight: scale(6),
  },
  subtext: {
    fontSize: scaleFont(12),
    color: '#64748B',
    lineHeight: scaleFont(16),
    flex: 1,
  },
  buttonWrapper: {
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  downloadIconContainer: {
    marginRight: scale(6),
    width: scale(16),
    height: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  notebookLines: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(4),
    backgroundColor: '#F1F5F9',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(8),
  },
  notebookLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#CBD5E1',
  },
});
