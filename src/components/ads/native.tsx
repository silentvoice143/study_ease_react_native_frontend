import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
} from 'react-native';
import NativeAdView, {
  CallToActionView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  ImageView,
  IconView,
  StarRatingView,
  StoreView,
  PriceView,
} from 'react-native-google-mobile-ads';
import { TestIds } from 'react-native-google-mobile-ads';

type NativeAdLayout = 'small' | 'medium' | 'large' | 'custom';

type NativeAdProps = {
  adUnitId?: string;
  layout?: NativeAdLayout;
  style?: ViewStyle;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  showDebugInfo?: boolean;
  mediaAspectRatio?: 'square' | 'landscape' | 'portrait' | 'any';
  adChoicesPlacement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  customLayout?: React.ReactNode;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
  onAdClicked?: () => void;
  onRetryAttempt?: (attempt: number) => void;
};

const NativeAd: React.FC<NativeAdProps> = ({
  adUnitId,
  layout = 'medium',
  style,
  enableRetry = true,
  maxRetries = 10,
  retryDelay = 3000,
  exponentialBackoff = true,
  showDebugInfo = false,
  mediaAspectRatio = 'landscape',
  adChoicesPlacement = 'topRight',
  customLayout,
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdClosed,
  onAdClicked,
  onRetryAttempt,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const nativeAdViewRef = useRef(null);

  // Use test ID in dev mode
  const unitId = __DEV__ ? TestIds.NATIVE : adUnitId;

  // Calculate retry delay with optional exponential backoff
  const getRetryDelay = useCallback(
    (attempt: number) => {
      if (exponentialBackoff) {
        return Math.min(retryDelay * Math.pow(2, attempt), 60000);
      }
      return retryDelay;
    },
    [retryDelay, exponentialBackoff],
  );

  // Handle ad load success
  const handleAdLoaded = useCallback(() => {
    if (!mountedRef.current) return;

    console.log('✅ Native ad loaded successfully');
    setAdLoaded(true);
    setAdFailed(false);
    setIsRetrying(false);
    setRetryCount(0);

    onAdLoaded?.();
  }, [onAdLoaded]);

  // Handle ad load failure
  const handleAdFailedToLoad = useCallback(
    (error: any) => {
      if (!mountedRef.current) return;

      console.log('❌ Native ad failed to load:', error);
      setAdFailed(true);
      setAdLoaded(false);

      onAdFailedToLoad?.(error);
    },
    [onAdFailedToLoad],
  );

  // Handle ad opened
  const handleAdOpened = useCallback(() => {
    console.log('📱 Native ad opened');
    onAdOpened?.();
  }, [onAdOpened]);

  // Handle ad closed
  const handleAdClosed = useCallback(() => {
    console.log('❌ Native ad closed');
    onAdClosed?.();
  }, [onAdClosed]);

  // Handle ad clicked
  const handleAdClicked = useCallback(() => {
    console.log('👆 Native ad clicked');
    onAdClicked?.();
  }, [onAdClicked]);

  // Retry logic
  useEffect(() => {
    if (!mountedRef.current) return;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (adFailed && enableRetry && retryCount < maxRetries) {
      const delay = getRetryDelay(retryCount);
      setIsRetrying(true);

      console.log(
        `🔄 Retrying native ad (${
          retryCount + 1
        }/${maxRetries}) in ${delay}ms...`,
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
      console.log('⚠️ Max retry attempts reached for native ad');
      setIsRetrying(false);
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

  // Render small layout
  const renderSmallLayout = () => (
    <View style={styles.smallContainer}>
      <View style={styles.smallContent}>
        <IconView style={styles.smallIcon} />
        <View style={styles.smallTextContainer}>
          <HeadlineView style={styles.smallHeadline} />
          <TaglineView style={styles.smallTagline} numberOfLines={1} />
        </View>
      </View>
      <CallToActionView
        style={styles.smallCta}
        textStyle={styles.ctaText}
        allCaps
      />
    </View>
  );

  // Render medium layout
  const renderMediumLayout = () => (
    <View style={styles.mediumContainer}>
      <View style={styles.mediumHeader}>
        <IconView style={styles.mediumIcon} />
        <View style={styles.mediumHeaderText}>
          <HeadlineView style={styles.mediumHeadline} />
          <View style={styles.mediumMetadata}>
            <AdvertiserView style={styles.advertiser} />
            <StarRatingView starSize={12} style={styles.starRating} />
          </View>
        </View>
      </View>
      <ImageView style={styles.mediumImage} resizeMode="cover" />
      <TaglineView style={styles.mediumTagline} numberOfLines={2} />
      <View style={styles.mediumFooter}>
        <View style={styles.priceStoreContainer}>
          <StoreView style={styles.store} />
          <PriceView style={styles.price} />
        </View>
        <CallToActionView
          style={styles.mediumCta}
          textStyle={styles.ctaText}
          allCaps
        />
      </View>
    </View>
  );

  // Render large layout
  const renderLargeLayout = () => (
    <View style={styles.largeContainer}>
      <ImageView style={styles.largeImage} resizeMode="cover" />
      <View style={styles.largeContent}>
        <View style={styles.largeHeader}>
          <IconView style={styles.largeIcon} />
          <View style={styles.largeHeaderText}>
            <HeadlineView style={styles.largeHeadline} />
            <AdvertiserView style={styles.largeAdvertiser} />
          </View>
        </View>
        <TaglineView style={styles.largeTagline} numberOfLines={3} />
        <View style={styles.largeMetadata}>
          <StarRatingView starSize={14} style={styles.largeStarRating} />
          <StoreView style={styles.largeStore} />
          <PriceView style={styles.largePrice} />
        </View>
        <CallToActionView
          style={styles.largeCta}
          textStyle={styles.largeCtaText}
          allCaps
        />
      </View>
    </View>
  );

  // Get layout based on prop
  const getLayout = () => {
    if (customLayout) return customLayout;

    switch (layout) {
      case 'small':
        return renderSmallLayout();
      case 'medium':
        return renderMediumLayout();
      case 'large':
        return renderLargeLayout();
      default:
        return renderMediumLayout();
    }
  };

  const showLoader = !adLoaded && !adFailed;
  const showRetryStatus = isRetrying && enableRetry;

  return (
    <View style={[styles.container, style]}>
      {showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#888" />
          {showDebugInfo && (
            <Text style={styles.debugText}>Loading native ad...</Text>
          )}
        </View>
      )}

      {showRetryStatus && showDebugInfo && (
        <View style={styles.retryContainer}>
          <ActivityIndicator size="small" color="#ff9800" />
          <Text style={styles.retryText}>
            Retry {retryCount}/{maxRetries}
          </Text>
        </View>
      )}

      {!adFailed && unitId && (
        <NativeAdView
          ref={nativeAdViewRef}
          key={`native-ad-${retryCount}`}
          adUnitID={unitId}
          style={styles.nativeAdView}
          adChoicesPlacement={adChoicesPlacement}
          mediaAspectRatio={mediaAspectRatio}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          onAdOpened={handleAdOpened}
          onAdClosed={handleAdClosed}
          onAdClicked={handleAdClicked}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        >
          {getLayout()}
        </NativeAdView>
      )}

      {adFailed && retryCount >= maxRetries && showDebugInfo && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load native ad</Text>
        </View>
      )}
    </View>
  );
};

export default NativeAd;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minHeight: 100,
  },
  retryContainer: {
    position: 'absolute',
    top: 10,
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
    padding: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    textAlign: 'center',
  },
  nativeAdView: {
    width: '100%',
  },

  // Small Layout Styles
  smallContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  smallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  smallTextContainer: {
    flex: 1,
  },
  smallHeadline: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  smallTagline: {
    fontSize: 11,
    color: '#666',
  },
  smallCta: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },

  // Medium Layout Styles
  mediumContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediumHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  mediumIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  mediumHeaderText: {
    flex: 1,
  },
  mediumHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mediumMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advertiser: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  starRating: {
    marginTop: 2,
  },
  mediumImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  mediumTagline: {
    fontSize: 13,
    color: '#555',
    padding: 12,
    lineHeight: 18,
  },
  mediumFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceStoreContainer: {
    flex: 1,
  },
  store: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  mediumCta: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Large Layout Styles
  largeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  largeImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  largeContent: {
    padding: 16,
  },
  largeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  largeIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  largeHeaderText: {
    flex: 1,
  },
  largeHeadline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeAdvertiser: {
    fontSize: 13,
    color: '#666',
  },
  largeTagline: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  largeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  largeStarRating: {
    marginRight: 12,
  },
  largeStore: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  largePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  largeCta: {
    backgroundColor: '#FF5722',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  largeCtaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
