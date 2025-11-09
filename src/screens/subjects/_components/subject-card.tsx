import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../../utils/sizer';
import { COLORS } from '../../../theme/colors';

type CardProps = {
  text: string;
  subtext?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onClickButton?: (event: GestureResponderEvent) => void;
};

export default function SubjectCard({
  text,
  subtext,
  onPress,
  onClickButton,
}: CardProps) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#F8F7FF', '#FAFBFF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Accent Line */}
        <View style={styles.accentLine} />

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {text}
            </Text>
            {subtext ? (
              <Text style={styles.subtext} numberOfLines={1}>
                {subtext}
              </Text>
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.primaryButton}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>📝</Text>
              </View>
              <Text style={styles.primaryButtonText}>Notes</Text>
            </View>

            <View style={styles.secondaryButton}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>📄</Text>
              </View>
              <Text style={styles.secondaryButtonText}>PYQ</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: verticalScale(6),
  },
  card: {
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(4),
    backgroundColor: COLORS.voilet.dark,
    borderTopLeftRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
  },
  content: {
    flex: 1,
  },
  textContainer: {
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: scaleFont(17),
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 0.3,
    lineHeight: scaleFont(24),
  },
  subtext: {
    fontSize: scaleFont(13),
    color: '#6B7280',
    marginTop: verticalScale(4),
    fontWeight: '400',
    lineHeight: scaleFont(18),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.voilet.dark,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    shadowColor: COLORS.voilet.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonIconContainer: {
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: scaleFont(14),
  },
  primaryButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: COLORS.surface.white,
    letterSpacing: 0.2,
  },
  secondaryButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 0.2,
  },
});
