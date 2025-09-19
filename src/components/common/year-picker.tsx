import React, { useMemo, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

type YearPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (year: number) => void;
  startYear?: number;
  endYear?: number;
  initialYear?: number | null;
  title?: string;
  accentColor?: string;
  isDarkMode?: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

export default function YearPickerModal({
  visible,
  onClose,
  onSelect,
  startYear,
  endYear,
  initialYear = null,
  title = 'Select Year',
  accentColor = '#007AFF',
  isDarkMode = false,
}: YearPickerModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const now = new Date();
  const defaultEnd = endYear ?? now.getFullYear();
  const defaultStart = startYear ?? 1950;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = defaultEnd; y >= defaultStart; y--) {
      arr.push(y);
    }
    return arr;
  }, [defaultStart, defaultEnd]);

  const theme = {
    background: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    surface: isDarkMode ? '#2C2C2E' : '#F8F9FA',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#8E8E93' : '#6B7280',
    border: isDarkMode ? '#38383A' : '#E5E7EB',
    backdrop: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
    accent: accentColor,
    accentLight: `${accentColor}20`,
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  const handleYearSelect = (year: number) => {
    // Add haptic feedback if available
    onSelect(year);
    onClose();
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const selected = initialYear === item;
    const isCurrentYear = item === now.getFullYear();

    return (
      <TouchableOpacity
        style={[
          styles.yearRow,
          { borderBottomColor: theme.border },
          selected && [
            styles.selectedRow,
            { backgroundColor: theme.accentLight },
          ],
        ]}
        onPress={() => handleYearSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.yearContent}>
          <Text
            style={[
              styles.yearText,
              { color: theme.text },
              selected && [styles.selectedText, { color: theme.accent }],
            ]}
          >
            {item}
          </Text>
          {isCurrentYear && !selected && (
            <View
              style={[
                styles.currentIndicator,
                { backgroundColor: theme.accent },
              ]}
            />
          )}
          {selected && (
            <View style={[styles.checkmark, { backgroundColor: theme.accent }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getInitialScrollIndex = () => {
    if (!initialYear) return 0;
    const index = years.findIndex(y => y === initialYear);
    return Math.max(0, index - 2); // Show selected year with some context
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="transparent" translucent />

      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: theme.backdrop, opacity: opacityAnim },
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text
                style={[styles.closeButtonText, { color: theme.textSecondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

            <View style={styles.placeholder} />
          </View>

          {/* Separator */}
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          {/* Year List */}
          <View style={styles.listContainer}>
            <FlatList
              data={years}
              keyExtractor={y => String(y)}
              renderItem={renderItem}
              style={styles.list}
              initialScrollIndex={getInitialScrollIndex()}
              getItemLayout={(_, index) => ({
                length: 56,
                offset: 56 * index,
                index,
              })}
              showsVerticalScrollIndicator={false}
              bounces={true}
              decelerationRate="fast"
              contentContainerStyle={styles.listContent}
            />

            {/* Gradient overlays for better visual hierarchy */}
            <View
              style={[
                styles.topGradient,
                { backgroundColor: theme.background },
              ]}
            />
            <View
              style={[
                styles.bottomGradient,
                { backgroundColor: theme.background },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  container: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding for iPhone X+
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
    minWidth: 60,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    minWidth: 60,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
  listContainer: {
    position: 'relative',
    height: 280,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  yearRow: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  yearContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearText: {
    fontSize: 17,
    fontWeight: '400',
  },
  selectedRow: {
    borderBottomWidth: 0,
  },
  selectedText: {
    fontWeight: '600',
  },
  currentIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    opacity: 0.9,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    opacity: 0.9,
    zIndex: 1,
  },
});
