import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';
import DownloadIcon from '../../assets/icons/download-icon';

type NoteCardProps = {
  title: string;
  year?: string;
  fileExists: boolean;
  isDownloading: boolean;
  showingAds: boolean;
  progress: number;
  onPress: () => void;
  onDownload: () => void;
  onDelete: () => void;
};

export default function NoteCard({
  title,
  year,
  fileExists,
  isDownloading,
  showingAds,
  progress,
  onPress,
  onDownload,
  onDelete,
}: NoteCardProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [actionScale] = useState(new Animated.Value(1));

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

  const handleActionPressIn = () => {
    Animated.spring(actionScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleActionPressOut = () => {
    Animated.spring(actionScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
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
        {/* Accent gradient */}
        <View style={styles.accentBar} />

        {/* Background decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={styles.decorCircle} />
        </View>

        <View style={styles.cardContent}>
          {/* Icon container */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <View style={styles.documentIcon}>
                <View style={styles.docFold} />
                <View style={styles.docBody}>
                  <View style={styles.docLine} />
                  <View style={styles.docLine} />
                  <View style={styles.docLineShort} />
                </View>
              </View>
            </View>
          </View>

          {/* Content section */}
          <View style={styles.contentSection}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            <View style={styles.metaContainer}>
              {year && (
                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>{year}</Text>
                </View>
              )}
              {fileExists && (
                <View style={styles.downloadedBadge}>
                  <View style={styles.downloadedDot} />
                  <Text style={styles.downloadedText}>Downloaded</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action section */}
          <View style={styles.actionSection}>
            {isDownloading || (showingAds && isDownloading) ? (
              <View style={styles.loadingContainer}>
                <View style={styles.progressCircle}>
                  <ActivityIndicator size="small" color="#6366F1" />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            ) : fileExists ? (
              <Animated.View
                style={{
                  transform: [{ scale: actionScale }],
                }}
              >
                <TouchableOpacity
                  onPress={onDelete}
                  onPressIn={handleActionPressIn}
                  onPressOut={handleActionPressOut}
                  style={styles.deleteButton}
                  activeOpacity={0.9}
                >
                  <View style={styles.deleteIconContainer}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View
                style={{
                  transform: [{ scale: actionScale }],
                }}
              >
                <TouchableOpacity
                  onPress={onDownload}
                  onPressIn={handleActionPressIn}
                  onPressOut={handleActionPressOut}
                  style={styles.downloadButton}
                  activeOpacity={0.9}
                >
                  <View style={styles.downloadIconContainer}>
                    <DownloadIcon color={COLORS.surface.white} />
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
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(2),
  },
  card: {
    backgroundColor: COLORS.surface.white,
    borderRadius: moderateScale(16),
    position: 'relative',
    overflow: 'hidden',
    shadowColor: COLORS.voilet.light,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.voilet.lighter,
  },
  //   accentBar: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     height: 3,
  //     backgroundColor: COLORS.voilet.dark,
  //   },
  backgroundDecoration: {
    position: 'absolute',
    top: -30,
    right: -30,
    opacity: 0.04,
  },
  decorCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.voilet.dark,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    paddingTop: verticalScale(19),
  },
  iconSection: {
    marginRight: scale(14),
  },
  iconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: moderateScale(12),
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
  },
  documentIcon: {
    width: scale(28),
    height: scale(32),
    position: 'relative',
  },
  docFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: '#C7D2FE',
  },
  docBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
    padding: scale(5),
    justifyContent: 'center',
  },
  docLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    marginBottom: 3,
  },
  docLineShort: {
    width: '60%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  contentSection: {
    flex: 1,
    marginRight: scale(10),
  },
  title: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: scaleFont(21),
    letterSpacing: 0.2,
    marginBottom: verticalScale(8),
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  yearBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearText: {
    fontSize: scaleFont(12),
    fontWeight: '500',
    color: '#475569',
    letterSpacing: 0.3,
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  downloadedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: scale(5),
  },
  downloadedText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
    color: '#059669',
    letterSpacing: 0.3,
  },
  actionSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(56),
  },
  progressCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(4),
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
  },
  progressText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
    color: '#6366F1',
    letterSpacing: 0.2,
  },
  downloadButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(12),
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadIconContainer: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(12),
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  deleteIconContainer: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: scaleFont(18),
  },
});
