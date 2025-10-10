import React from 'react';
import {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Ad Unit IDs
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-5415975767472598/1154066155';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-5415975767472598~1060812799';

// Ad Creation Functions
export const createRewardedAd = () => {
  return RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: [
      'education',
      'learning',
      'study',
      'quiz',
      'exam',
      'mock test',
      'school',
      'college',
      'student',
      'teacher',
      'online courses',
      'e-learning',
      'books',
      'flashcards',
      'notes',
      'motivation',
      'productivity',
      'career',
      'knowledge',
      'general knowledge',
      'games',
      'apps',
      'entertainment',
      'movie',
    ],
  });
};

export const createInterstitialAd = () => {
  return InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: [
      'education',
      'learning',
      'study',
      'quiz',
      'exam',
      'mock test',
      'school',
      'college',
      'student',
      'teacher',
      'online courses',
      'e-learning',
      'books',
      'flashcards',
      'notes',
      'motivation',
      'productivity',
      'career',
      'knowledge',
      'general knowledge',
      'games',
      'apps',
      'entertainment',
    ],
  });
};

// Types
type Reward = { type: string; amount: number };

interface RewardedAdConfig {
  adName: string;
  adInstance: RewardedAd;
  setAdInstance: React.Dispatch<React.SetStateAction<RewardedAd>>;
  isAdLoaded: boolean;
  setAdLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  onRewardEarned: (reward: Reward) => void;
  onSkip?: () => void;
  onAdShown?: () => void;
  onAdDismissed?: () => void;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelay?: number;
}

interface InterstitialAdConfig {
  adName: string;
  adInstance: InterstitialAd;
  setAdInstance: React.Dispatch<React.SetStateAction<InterstitialAd>>;
  isAdLoaded: boolean;
  setAdLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  onSkip?: () => void;
  onAdShown?: () => void;
  onAdDismissed?: () => void;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// Utility: Wait/delay function
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced Rewarded Ad with intelligent retry logic
 */
export const loadAndShowRewardedAdWithRetry = async ({
  adName,
  adInstance,
  setAdInstance,
  isAdLoaded,
  setAdLoaded,
  setLoader,
  onRewardEarned,
  onSkip,
  onAdShown,
  onAdDismissed,
  timeoutMs = 15000, // 15 seconds default
  maxRetries = 5,
  retryDelay = 2000, // 2 seconds between retries
}: RewardedAdConfig) => {
  setLoader(true);

  // If already loaded, show immediately
  if (isAdLoaded) {
    console.log(`[${adName}] ✅ Already loaded, showing now`);
    try {
      adInstance.show();
      onAdShown?.();

      // Listen for ad dismissal
      const unsubscribeDismissed = adInstance.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log(`[${adName}] Ad dismissed by user`);
          setAdLoaded(false);
          onAdDismissed?.();
          unsubscribeDismissed();
        },
      );
    } catch (error) {
      console.error(`[${adName}] ❌ Error showing loaded ad:`, error);
      setAdLoaded(false);
    }
    setLoader(false);
    return;
  }

  // Retry loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[${adName}] 🔄 Attempt ${attempt}/${maxRetries}`);

    const newAd = createRewardedAd();
    setAdInstance(newAd);

    let unsubscribeLoaded: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let unsubscribeReward: (() => void) | undefined;
    let unsubscribeDismissed: (() => void) | undefined;

    try {
      // Load ad with timeout
      await Promise.race([
        new Promise<void>((resolve, reject) => {
          unsubscribeLoaded = newAd.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
              console.log(`[${adName}] ✅ Ad loaded successfully`);
              setAdLoaded(true);
              resolve();
            },
          );

          unsubscribeError = newAd.addAdEventListener(
            AdEventType.ERROR,
            error => {
              console.log(
                `[${adName}] ❌ Load error:`,
                error?.message || error,
              );
              reject(error);
            },
          );

          unsubscribeReward = newAd.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
              console.log(`[${adName}] 🎁 Reward earned:`, reward);
              onRewardEarned(reward);
            },
          );

          unsubscribeDismissed = newAd.addAdEventListener(
            AdEventType.CLOSED,
            () => {
              console.log(`[${adName}] Ad dismissed`);
              setAdLoaded(false);
              onAdDismissed?.();
            },
          );

          newAd.load();
        }),

        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeoutMs),
        ),
      ]);

      // Successfully loaded, now show
      console.log(`[${adName}] 📺 Showing ad`);
      newAd.show();
      onAdShown?.();

      setLoader(false);
      return; // Success, exit function
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error';
      console.warn(`[${adName}] ⚠️ Attempt ${attempt} failed: ${errorMsg}`);

      // Clean up listeners
      unsubscribeLoaded?.();
      unsubscribeError?.();
      unsubscribeReward?.();
      unsubscribeDismissed?.();

      // If this was the last attempt
      if (attempt >= maxRetries) {
        console.error(`[${adName}] ❌ Max retries reached, giving up`);
        onSkip?.();
        setLoader(false);
        return;
      }

      // Wait before next retry (with exponential backoff)
      const delay = retryDelay * Math.pow(1.5, attempt - 1);
      console.log(
        `[${adName}] ⏳ Waiting ${Math.round(delay)}ms before retry...`,
      );
      await wait(delay);
    }
  }

  setLoader(false);
};

/**
 * Enhanced Interstitial Ad with intelligent retry logic
 */
export const loadAndShowInterstitialAdWithRetry = async ({
  adName,
  adInstance,
  setAdInstance,
  isAdLoaded,
  setAdLoaded,
  setLoader,
  onSkip,
  onAdShown,
  onAdDismissed,
  timeoutMs = 15000, // 15 seconds default
  maxRetries = 5,
  retryDelay = 2000, // 2 seconds between retries
}: InterstitialAdConfig) => {
  setLoader(true);

  // If already loaded, show immediately
  if (isAdLoaded) {
    console.log(`[${adName}] ✅ Already loaded, showing now`);
    try {
      adInstance.show();
      onAdShown?.();

      // Listen for ad dismissal
      const unsubscribeDismissed = adInstance.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log(`[${adName}] Ad dismissed by user`);
          setAdLoaded(false);
          onAdDismissed?.();
          unsubscribeDismissed();
        },
      );
    } catch (error) {
      console.error(`[${adName}] ❌ Error showing loaded ad:`, error);
      setAdLoaded(false);
    }
    setLoader(false);
    return;
  }

  // Retry loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[${adName}] 🔄 Attempt ${attempt}/${maxRetries}`);

    const newAd = createInterstitialAd();
    setAdInstance(newAd);

    let unsubscribeLoaded: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let unsubscribeDismissed: (() => void) | undefined;

    try {
      // Load ad with timeout
      await Promise.race([
        new Promise<void>((resolve, reject) => {
          unsubscribeLoaded = newAd.addAdEventListener(
            AdEventType.LOADED,
            () => {
              console.log(`[${adName}] ✅ Ad loaded successfully`);
              setAdLoaded(true);
              resolve();
            },
          );

          unsubscribeError = newAd.addAdEventListener(
            AdEventType.ERROR,
            error => {
              console.log(
                `[${adName}] ❌ Load error:`,
                error?.message || error,
              );
              reject(error);
            },
          );

          unsubscribeDismissed = newAd.addAdEventListener(
            AdEventType.CLOSED,
            () => {
              console.log(`[${adName}] Ad dismissed`);
              setAdLoaded(false);
              onAdDismissed?.();
            },
          );

          newAd.load();
        }),

        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeoutMs),
        ),
      ]);

      // Successfully loaded, now show
      console.log(`[${adName}] 📺 Showing ad`);
      newAd.show();
      onAdShown?.();

      setLoader(false);
      return; // Success, exit function
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error';
      console.warn(`[${adName}] ⚠️ Attempt ${attempt} failed: ${errorMsg}`);

      // Clean up listeners
      unsubscribeLoaded?.();
      unsubscribeError?.();
      unsubscribeDismissed?.();

      // If this was the last attempt
      if (attempt >= maxRetries) {
        console.error(`[${adName}] ❌ Max retries reached, giving up`);
        onSkip?.();
        setLoader(false);
        return;
      }

      // Wait before next retry (with exponential backoff)
      const delay = retryDelay * Math.pow(1.5, attempt - 1);
      console.log(
        `[${adName}] ⏳ Waiting ${Math.round(delay)}ms before retry...`,
      );
      await wait(delay);
    }
  }

  setLoader(false);
};

/**
 * Preload ad for better performance
 */
export const preloadRewardedAd = (
  setAdInstance: React.Dispatch<React.SetStateAction<RewardedAd>>,
  setAdLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  onRewardEarned?: (reward: Reward) => void,
) => {
  const ad = createRewardedAd();

  const unsubscribeLoaded = ad.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      console.log('🎬 Rewarded ad preloaded');
      setAdLoaded(true);
      unsubscribeLoaded();
    },
  );

  if (onRewardEarned) {
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward =>
      onRewardEarned(reward),
    );
  }

  ad.load();
  setAdInstance(ad);
};

/**
 * Preload interstitial ad for better performance
 */
export const preloadInterstitialAd = (
  setAdInstance: React.Dispatch<React.SetStateAction<InterstitialAd>>,
  setAdLoaded: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const ad = createInterstitialAd();

  const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
    console.log('🎬 Interstitial ad preloaded');
    setAdLoaded(true);
    unsubscribeLoaded();
  });

  ad.load();
  setAdInstance(ad);
};
