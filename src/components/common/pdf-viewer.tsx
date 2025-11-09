import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Pdf, { Source } from 'react-native-pdf';
import { verticalScale } from '../../utils/sizer';
import Slider from '@react-native-community/slider';
import { COLORS } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type PDFViewerProps = {
  source: Source;
  style?: object;
  page?: number;
  enablePaging?: boolean;
  enableRTL?: boolean;
  enableAnnotations?: boolean;
  onLoadComplete?: (
    numberOfPages: number,
    filePath?: string,
    dimensions?: { width: number; height: number },
  ) => void;
  onPageChanged?: (page: number, numberOfPages: number) => void;
  onError?: (error: Error) => void;
  onPressLink?: (uri: string) => void;
};

// Simple slider icon component
const SliderIcon = ({ size = 24, color = '#0066cc' }) => (
  <View style={[styles.sliderIcon, { width: size, height: size }]}>
    <View
      style={[styles.sliderLine, { backgroundColor: color, width: size * 0.7 }]}
    />
    <View style={[styles.sliderThumb, { backgroundColor: color }]} />
  </View>
);

const PDFViewer: React.FC<PDFViewerProps> = ({
  source,
  page = 1,
  style = {},
  enablePaging = true,
  enableRTL = false,
  enableAnnotations = false,
  onLoadComplete,
  onPageChanged,
  onError,
  onPressLink,
}) => {
  const pdfRef = useRef<Pdf>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(page);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [pagetoJump, setPagetoJump] = useState(1);
  const [showSlider, setShowSlider] = useState(false);

  // Animation for slider appearance
  const sliderOpacity = useRef(new Animated.Value(0)).current;
  const sliderTranslateY = useRef(new Animated.Value(50)).current;

  const handleLoadComplete = useCallback(
    (
      numberOfPages: number,
      filePath?: string,
      dimensions?: { width: number; height: number },
    ) => {
      console.log('pdf loaded completely');
      setLoading(false);
      setTotalPages(numberOfPages);
      setError(null);
      console.log(`PDF loaded: ${numberOfPages} pages`);

      if (onLoadComplete) {
        onLoadComplete(numberOfPages, filePath, dimensions);
      }
    },
    [onLoadComplete],
  );

  const handlePageChanged = useCallback(
    (page: number, numberOfPages: number) => {
      console.log(`Page changed to: ${page}`);

      setCurrentPage(page);
      setTotalPages(numberOfPages);

      // Only update slider value if user is not actively sliding
      if (!isSliderActive) {
        setSliderValue(page);
      }

      if (loading) {
        setLoading(false);
      }

      if (onPageChanged) {
        onPageChanged(page, numberOfPages);
      }
    },
    [loading, isSliderActive, onPageChanged],
  );

  const handleError = useCallback(
    (err: any) => {
      setLoading(false);
      setError(err.message || 'Failed to load PDF');
      console.error('PDF Error:', err);

      if (onError) {
        onError(err);
      } else {
        Alert.alert('PDF Error', err.message || 'Failed to load PDF');
      }
    },
    [onError],
  );

  const handlePressLink = useCallback(
    (uri: string) => {
      console.log('Link pressed:', uri);

      if (onPressLink) {
        onPressLink(uri);
      } else {
        Alert.alert('Link', `Opening: ${uri}`);
      }
    },
    [onPressLink],
  );

  const handleSliderValueChange = useCallback((value: number) => {
    const pageNumber = Math.round(value);
    setSliderValue(pageNumber);
  }, []);

  const handleSliderStart = useCallback(() => {
    setIsSliderActive(true);
  }, []);

  const handleSliderComplete = useCallback((value: number) => {
    const pageNumber = Math.round(value);
    console.log(`Slider complete: jumping to page ${pageNumber}`);
    hideSliderAfterDelay();
    // Use a small delay to ensure smooth transition
    setTimeout(() => {
      setIsSliderActive(false);
      setCurrentPage(pageNumber);
      setSliderValue(pageNumber);
      setPagetoJump(pageNumber);

      // Navigate to the selected page
      if (pdfRef.current) {
        pdfRef.current.setPage(pageNumber);
      }
    }, 100);
  }, []);

  const hideSliderAfterDelay = useCallback(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(sliderOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sliderTranslateY, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSlider(false));
    }, 5000);
  }, []);

  const toggleSlider = useCallback(() => {
    const newShowSlider = !showSlider;
    setShowSlider(newShowSlider);

    if (newShowSlider) {
      // Show slider with animation
      Animated.parallel([
        Animated.timing(sliderOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sliderTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide slider with animation
      Animated.parallel([
        Animated.timing(sliderOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sliderTranslateY, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSlider, sliderOpacity, sliderTranslateY]);

  const retryLoad = useCallback(() => {
    setError(null);
    setLoading(true);
    setCurrentPage(page);
    setSliderValue(page);
  }, [page]);

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>Error loading PDF</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}

      <Pdf
        ref={pdfRef}
        source={source}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChanged}
        onError={handleError}
        onPressLink={handlePressLink}
        style={styles.pdf}
        enablePaging={enablePaging}
        enableRTL={enableRTL}
        trustAllCerts={false}
        spacing={10}
        minScale={1.0}
        maxScale={3.0}
        scale={1.0}
        horizontal={false}
        page={pagetoJump}
        onScaleChanged={scale => {
          console.log('Scale changed:', scale);
        }}
      />

      {/* Slider Toggle Button */}
      {totalPages > 0 && !loading && (
        <TouchableOpacity
          style={styles.sliderToggleButton}
          onPress={toggleSlider}
          activeOpacity={0.7}
        >
          <SliderIcon size={24} color={showSlider ? '#0066cc' : '#666'} />
        </TouchableOpacity>
      )}

      {/* Animated Slider Container */}
      {totalPages > 0 && !loading && showSlider && (
        <Animated.View
          style={[
            styles.sliderContainer,
            {
              opacity: sliderOpacity,
              transform: [{ translateY: sliderTranslateY }],
            },
          ]}
        >
          <Text style={styles.sliderLabel}>
            {Math.round(sliderValue)}/{totalPages}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={totalPages}
            step={1}
            value={sliderValue}
            minimumTrackTintColor="#0066cc"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#0066cc"
            onValueChange={handleSliderValueChange}
            onSlidingStart={handleSliderStart}
            onSlidingComplete={handleSliderComplete}
          />
        </Animated.View>
      )}

      {/* Page Indicator - only show when slider is hidden */}
      {totalPages > 0 && !loading && !showSlider && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.background,
    position: 'relative',
    paddingBottom: verticalScale(70),
  },
  pdf: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 20,
    left: 80, // Leave space for toggle button
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface.background,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slider: {
    flex: 1,
    height: 30,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 50,
    textAlign: 'center',
  },
  sliderToggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.voilet.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Custom slider icon styles
  sliderIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sliderLine: {
    height: 3,
    borderRadius: 1.5,
  },
  sliderThumb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    right: 2,
  },
});

export default PDFViewer;
