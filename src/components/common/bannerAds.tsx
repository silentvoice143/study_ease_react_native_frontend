import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Banner from '../ads/benner'; // assuming your custom Banner component
import { banner_set2 } from '../ads/ads-units';
import { getRandomAdUnit } from '../../utils/get-random-ads-unit';

const BannerAd = ({ onClose }: { onClose?: () => void }) => {
  const [showClose, setShowClose] = useState(false);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    // Countdown timer for close button
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setShowClose(true);
    }
  }, [timer]);

  return (
    <View style={{}}>
      <Banner
        adUnitId={getRandomAdUnit(banner_set2)}
        size="BANNER"
        maxRetries={20}
        retryDelay={2000}
        exponentialBackoff={true}
        showDebugInfo={true}
        onAdLoaded={() => console.log('Ad ready!')}
        onRetryAttempt={attempt => console.log(`Attempt ${attempt}`)}
      />

      {showClose && onClose ? (
        <TouchableOpacity style={styles.closeAdButton} onPress={onClose}>
          <Text style={styles.closeAdText}>×</Text>
        </TouchableOpacity>
      ) : // <Text style={styles.timerText}>Close available in {timer}s</Text>
      null}
    </View>
  );
};

export default BannerAd;

const styles = StyleSheet.create({
  closeAdButton: {
    position: 'absolute',
    top: 6,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeAdText: {
    fontSize: 22,
    color: '#64748b',
    fontWeight: '300',
    lineHeight: 16,
  },
  timerText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});
