import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { verticalScale } from '../../utils/sizer';
import { COLORS } from '../../theme/colors';

type BannerSize =
  | 'BANNER'
  | 'FULL_BANNER'
  | 'LARGE_BANNER'
  | 'MEDIUM_RECTANGLE'
  | 'ADAPTIVE_BANNER';

type BannerProps = {
  adUnitId?: string;
  size?: BannerSize;
  style?: object;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  showDebugInfo?: boolean;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  onRetryAttempt?: (attempt: number) => void;
  hideOnNoFill?: boolean; // Hide component if no ads available
};

const Banner: React.FC<BannerProps> = ({
  adUnitId,
  size = 'BANNER',
  style,
  enableRetry = true,
  maxRetries = 10,
  retryDelay = 5000, // Increased default to 5 seconds for no-fill errors
  exponentialBackoff = true,
  showDebugInfo = false,
  onAdLoaded,
  onAdFailedToLoad,
  onRetryAttempt,
  hideOnNoFill = false,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [shouldHide, setShouldHide] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Use test ID in dev mode, otherwise use provided ad unit ID
  const unitId = __DEV__ ? TestIds.BANNER : adUnitId;

  // Map size string to BannerAdSize
  const getBannerSize = useCallback(() => {
    switch (size) {
      case 'BANNER':
        return BannerAdSize.BANNER;
      case 'FULL_BANNER':
        return BannerAdSize.FULL_BANNER;
      case 'LARGE_BANNER':
        return BannerAdSize.LARGE_BANNER;
      case 'MEDIUM_RECTANGLE':
        return BannerAdSize.MEDIUM_RECTANGLE;
      case 'ADAPTIVE_BANNER':
        return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
      default:
        return BannerAdSize.BANNER;
    }
  }, [size]);

  // Calculate retry delay with optional exponential backoff
  const getRetryDelay = useCallback(
    (attempt: number) => {
      if (exponentialBackoff) {
        // For no-fill errors, use longer delays
        const baseDelay =
          errorCode === 'error-code-no-fill' ? 10000 : retryDelay;
        return Math.min(baseDelay * Math.pow(1.5, attempt), 120000); // Max 2 minutes
      }
      return errorCode === 'error-code-no-fill' ? 10000 : retryDelay;
    },
    [retryDelay, exponentialBackoff, errorCode],
  );

  // Handle ad load success
  const handleAdLoaded = useCallback(() => {
    if (!mountedRef.current) return;

    console.log('✅ Banner ad loaded successfully');
    setAdLoaded(true);
    setAdFailed(false);
    setIsRetrying(false);
    setRetryCount(0);
    setErrorCode(null);
    setShouldHide(false);

    onAdLoaded?.();
  }, [onAdLoaded]);

  // Handle ad load failure
  const handleAdFailedToLoad = useCallback(
    (error: any) => {
      if (!mountedRef.current) return;

      const code = error?.code || 'unknown';
      const message = error?.message || 'Unknown error';

      console.log('❌ Banner ad failed to load:', code, message);

      setAdFailed(true);
      setAdLoaded(false);
      setErrorCode(code);

      // Check if it's a no-fill error
      if (code === 'error-code-no-fill') {
        console.log(
          '⚠️ No ad inventory available (no-fill). Will retry with longer delay...',
        );
      }

      onAdFailedToLoad?.(error);
    },
    [onAdFailedToLoad],
  );

  // Retry logic
  useEffect(() => {
    if (!mountedRef.current) return;

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Check if we should retry
    if (adFailed && enableRetry && retryCount < maxRetries) {
      const delay = getRetryDelay(retryCount);
      setIsRetrying(true);

      const errorMsg =
        errorCode === 'error-code-no-fill'
          ? '(no ad inventory)'
          : `(${errorCode})`;

      console.log(
        `🔄 Retrying banner ad ${errorMsg} (${
          retryCount + 1
        }/${maxRetries}) in ${Math.round(delay / 1000)}s...`,
      );

      onRetryAttempt?.(retryCount + 1);

      retryTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;

        setAdFailed(false);
        setAdLoaded(false);
        setIsRetrying(false);
        setRetryCount(prev => prev + 1);
      }, delay);
    } else if (adFailed && retryCount >= maxRetries) {
      console.log('⚠️ Max retry attempts reached');
      setIsRetrying(false);

      // Hide component if no-fill and hideOnNoFill is true
      if (errorCode === 'error-code-no-fill' && hideOnNoFill) {
        console.log('ℹ️ Hiding banner ad component (no inventory)');
        setShouldHide(true);
      }
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [
    adFailed,
    enableRetry,
    retryCount,
    maxRetries,
    getRetryDelay,
    onRetryAttempt,
    errorCode,
    hideOnNoFill,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Don't render if should hide
  if (shouldHide) {
    return null;
  }

  // Show loading indicator or retry status
  const showLoader = !adLoaded && !adFailed;
  const showRetryStatus = isRetrying && enableRetry;
  console.log(adLoaded, '----loaded ads');

  return (
    <View style={[styles.container, style]}>
      {showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#888" />
          {showDebugInfo && <Text style={styles.debugText}>Loading ad...</Text>}
        </View>
      )}

      {!shouldHide && unitId && (
        <View style={{ height: showLoader ? 0 : +getBannerSize() }}>
          <BannerAd
            key={`banner-${retryCount}`}
            unitId={unitId}
            size={getBannerSize()}
            onAdLoaded={handleAdLoaded}
            onAdFailedToLoad={handleAdFailedToLoad}
          />
        </View>
      )}

      {showRetryStatus && showDebugInfo && (
        <View style={styles.retryContainer}>
          <ActivityIndicator size="small" color="#ff9800" />
          <Text style={styles.retryText}>
            {errorCode === 'error-code-no-fill' ? 'No ads' : 'Retry'}{' '}
            {retryCount}/{maxRetries}
          </Text>
        </View>
      )}

      {adFailed && retryCount >= maxRetries && showDebugInfo && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {errorCode === 'error-code-no-fill'
              ? 'No ads available at the moment'
              : 'Unable to load ad'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(4),
    height: 60,
    backgroundColor: COLORS.surface.white,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  retryText: {
    fontSize: 10,
    color: '#ff9800',
    marginLeft: 5,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    textAlign: 'center',
  },
});
