import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NotificationItem from './_components/notification-item';
import PageWithHeader from '../../components/layout/page-with-header';
import { scale, verticalScale } from '../../utils/sizer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchStreams } from '../../apis/stream';
import { Stream } from '../../utils/types';
import { notifications } from '../../apis/query-keys';
import { fetchNotification } from '../../apis/notification';
import { COLORS } from '../../theme/colors';
import Banner from '../../components/ads/benner';
import NetInfo from '@react-native-community/netinfo';
import { Toast } from 'toastify-react-native';
import { Fonts } from '../../theme/fonts';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NOTIFICATION_BOX_HEIGHT = SCREEN_HEIGHT * 0.4;

const Home = ({ navigation }: any) => {
  const notificationScrollRef = useRef(null);
  const autoScrollTimerRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const limit = 10;
  const {
    data,
    isLoading: isStreamLoading,
    isError,
    error,
  } = useQuery<Stream[]>({
    queryKey: ['streams'],
    queryFn: () => fetchStreams(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch notifications with infinite scroll
  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: notifications(1, limit),
    queryFn: ({ pageParam = 1 }) => fetchNotification(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;

      // Stop fetching if next page exceeds 4
      if (nextPage > 4) return undefined;

      // Otherwise, only fetch if API says more pages exist
      if (
        lastPage.hasMore ||
        (lastPage.totalPages && nextPage <= lastPage.totalPages)
      ) {
        return nextPage;
      }

      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Flatten all notifications
  const allNotifications =
    notificationsData?.pages?.flatMap(page => page.notifications) || [];

  // Auto-scroll logic
  useEffect(() => {
    if (
      !autoScrollEnabled ||
      isUserScrolling ||
      allNotifications.length === 0
    ) {
      return;
    }

    const startAutoScroll = () => {
      autoScrollTimerRef.current = setInterval(() => {
        if (notificationScrollRef.current && !isUserScrolling) {
          const maxScrollOffset = allNotifications.length * 80;
          const newOffset = scrollPositionRef.current + 1;

          if (newOffset >= maxScrollOffset - NOTIFICATION_BOX_HEIGHT) {
            scrollPositionRef.current = 0;
            notificationScrollRef.current.scrollTo({ y: 0, animated: false });
          } else {
            scrollPositionRef.current = newOffset;
            notificationScrollRef.current.scrollTo({
              y: newOffset,
              animated: false,
            });
          }
        }
      }, 50);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScrollEnabled, isUserScrolling, allNotifications.length]);

  // Handle user touch start
  const handleScrollBeginDrag = () => {
    setIsUserScrolling(true);
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
  };

  // Handle user touch end
  const handleScrollEndDrag = () => {
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  // Handle scroll for infinite loading
  const handleNotificationScroll = event => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    scrollPositionRef.current = contentOffset.y;

    const paddingToBottom = 100;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Handle notification press
  const handleNotificationPress = (notification, index) => {
    const currentPage = Math.floor(index / limit) + 1;
    navigation.navigate('Notifications', {
      page: currentPage,
      notificationId: notification.id,
    });
  };

  useEffect(() => {
    // ✅ Listen to internet connection
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable === false) {
        Toast.info('No internet access');
        navigation?.naviigate('Offline');
      }
    });

    return () => unsubscribe();
  }, []);

  const StreamCard = ({ stream }: any) => (
    <TouchableOpacity
      style={styles.streamCard}
      onPress={() => {
        navigation.navigate('StreamsTab', {
          screen: 'Semester',
          params: { streamId: stream?.id ?? '' },
        });
      }}
    >
      <Text style={styles.streamCode}>{stream?.name ?? ''}</Text>
      <Text style={styles.streamSubtitle}>
        Total Sem - {stream?.totalSemesters}
      </Text>
    </TouchableOpacity>
  );

  const LoadingStreamCard = () => (
    <View style={styles.streamCard}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonSubtitle} />
    </View>
  );

  // Check if screen is wide enough for 2 ads
  const showTwoAds = SCREEN_WIDTH > 650;

  return (
    <PageWithHeader>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Streams Section */}
        <View style={{ paddingHorizontal: scale(16) }}>
          <LinearGradient
            colors={[
              COLORS.voilet.dark,
              COLORS.surface.pink,
              COLORS.voilet.dark,
            ]}
            style={styles.streamsSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.streamsTitle}>Explore Streams</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.streamsContainer}
              contentContainerStyle={styles.streamsContent}
              nestedScrollEnabled={true}
            >
              {isStreamLoading || data?.streams.length === 0 ? (
                <>
                  <LoadingStreamCard />
                  <LoadingStreamCard />
                  <LoadingStreamCard />
                </>
              ) : (
                data?.streams.map((stream, index) => (
                  <StreamCard key={index} stream={stream} />
                ))
              )}
            </ScrollView>
          </LinearGradient>
        </View>

        {/* Advertisements Section */}
        <View style={styles.advertisementsSection}>
          <View style={styles.adsRow}>
            <View
              style={[styles.adWrapper, !showTwoAds && styles.adWrapperFull]}
            >
              <Banner
                adUnitId="ca-app-pub-5415975767472598/3219555351"
                size="BANNER"
                maxRetries={20}
                retryDelay={2000}
                exponentialBackoff={true}
                showDebugInfo={true}
                onAdLoaded={() => console.log('Ad 1 ready!')}
                onRetryAttempt={attempt =>
                  console.log(`Ad 1 Attempt ${attempt}`)
                }
              />
            </View>

            {showTwoAds && (
              <View style={styles.adWrapper}>
                <Banner
                  adUnitId="ca-app-pub-5415975767472598/3219555351"
                  size="BANNER"
                  maxRetries={20}
                  retryDelay={2000}
                  exponentialBackoff={true}
                  showDebugInfo={true}
                  onAdLoaded={() => console.log('Ad 2 ready!')}
                  onRetryAttempt={attempt =>
                    console.log(`Ad 2 Attempt ${attempt}`)
                  }
                />
              </View>
            )}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          <View style={styles.notificationHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text
                style={[
                  styles.viewAllText,
                  { fontFamily: Fonts.inter.medium, lineHeight: 16 },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.notificationBox,
              { height: NOTIFICATION_BOX_HEIGHT },
            ]}
          >
            {isNotificationsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text style={styles.loadingText}>Loading notifications...</Text>
              </View>
            ) : allNotifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText]}>
                  No notifications available
                </Text>
              </View>
            ) : (
              <ScrollView
                ref={notificationScrollRef}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
                onMomentumScrollEnd={handleScrollEndDrag}
                onScroll={handleNotificationScroll}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
              >
                {allNotifications.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.id}-${index}`}
                    onPress={() => handleNotificationPress(item, index)}
                    activeOpacity={0.7}
                  >
                    <NotificationItem text={item.title || item.description} />
                  </TouchableOpacity>
                ))}
                {isFetchingNextPage && (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#8b5cf6" />
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </PageWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.white,
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  headerTitle: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '400',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  profileCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#ff69b4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  streamsSection: {
    borderRadius: 15,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(36),
  },
  streamsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  streamsContainer: {
    flexDirection: 'row',
  },
  streamsContent: {
    paddingRight: 20,
  },
  streamCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: verticalScale(16),
    minWidth: scale(100),
    alignItems: 'center',
    marginRight: 15,
  },
  streamCode: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  streamSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  skeletonTitle: {
    width: 60,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: 70,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  notificationsSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  advertisementsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  adsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  adWrapper: {
    flex: 1,
    minWidth: 300,
    maxWidth: '48%',
    alignItems: 'center',
  },
  adWrapperFull: {
    maxWidth: '100%',
  },
  adPlaceholder: {
    backgroundColor: '#ddd',
    height: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  adText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomButton: {
    backgroundColor: '#444',
    height: 50,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllButton: {
    paddingHorizontal: verticalScale(12),
    paddingVertical: verticalScale(6),
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationBox: {
    backgroundColor: COLORS.surface.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  autoScrollControl: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignSelf: 'center',
  },
});

export default Home;
