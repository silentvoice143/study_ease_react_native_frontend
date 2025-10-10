import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
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
import NativeAd from '../../components/ads/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const NOTIFICATION_BOX_HEIGHT = SCREEN_HEIGHT * 0.3;

const Home = ({ navigation }: any) => {
  const flatListRef = useRef(null);
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
    // getNextPageParam: (lastPage, allPages) => {
    //   if (
    //     lastPage.hasMore ||
    //     (lastPage.totalPages && allPages.length < lastPage.totalPages)
    //   ) {
    //     return allPages.length + 1;
    //   }
    //   return undefined;
    // },
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

  console.log(notificationsData, '------notificationsData');
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
        if (flatListRef.current && !isUserScrolling) {
          const maxScrollOffset = allNotifications.length * 80; // Approximate item height
          const newOffset = scrollPositionRef.current + 1;

          if (newOffset >= maxScrollOffset - NOTIFICATION_BOX_HEIGHT) {
            // Reset to top when reaching end
            scrollPositionRef.current = 0;
            flatListRef.current.scrollToOffset({ offset: 0, animated: false });
          } else {
            scrollPositionRef.current = newOffset;
            flatListRef.current.scrollToOffset({
              offset: newOffset,
              animated: false,
            });
          }
        }
      }, 50); // Adjust speed here (lower = faster)
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
    // Re-enable auto-scroll after 2 seconds of inactivity
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  // Handle scroll for infinite loading
  const handleScroll = event => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    scrollPositionRef.current = contentOffset.y;

    // Check if near bottom for infinite scroll
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

  // Render notification item
  const renderNotificationItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item, index)}
      activeOpacity={0.7}
    >
      <NotificationItem text={item.title || item.description} />
    </TouchableOpacity>
  );

  // Render footer
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#8b5cf6" />
      </View>
    );
  };

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

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {/* Streams Section */}
        <View style={{ paddingHorizontal: scale(16) }}>
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
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
            >
              {isStreamLoading ? (
                // Show 3 loading skeleton cards
                <>
                  <LoadingStreamCard />
                  <LoadingStreamCard />
                  <LoadingStreamCard />
                </>
              ) : (
                // Show actual stream data
                data?.streams.map((stream, index) => (
                  <StreamCard key={index} stream={stream} />
                ))
              )}
            </ScrollView>
          </LinearGradient>
        </View>

        {/* Notifications Section */}

        <View
          style={[
            styles.notificationsSection,
            { height: NOTIFICATION_BOX_HEIGHT + 80 },
          ]}
        >
          <View style={styles.notificationHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.notificationBox,
              {
                height: NOTIFICATION_BOX_HEIGHT,
              },
            ]}
          >
            {isNotificationsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text style={styles.loadingText}>Loading notifications...</Text>
              </View>
            ) : allNotifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No notifications available</Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={allNotifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
                onMomentumScrollEnd={handleScrollEndDrag}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ListFooterComponent={renderFooter}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </View>
        </View>

        {/* Advertisements Section */}
        <View style={styles.advertisementsSection}>
          {/* <Text style={styles.sectionTitle}>Advertisements</Text>
          <View style={styles.adPlaceholder}>
            <Text style={styles.adText}>ADS</Text>
          </View> */}
          <Banner
            adUnitId="ca-app-pub-5415975767472598/3219555351"
            size="BANNER"
            maxRetries={20}
            retryDelay={2000}
            exponentialBackoff={true}
            showDebugInfo={true}
            onAdLoaded={() => console.log('Ad ready!')}
            onRetryAttempt={attempt => console.log(`Attempt ${attempt}`)}
          />
        </View>
      </View>
    </PageWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.white,
  },
  scrollView: {
    flex: 1,
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
    padding: 15,
    minWidth: 100,
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
  // Skeleton loading styles
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
    height: '45%',
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },

  advertisementsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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

  //notification styles

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationBox: {
    backgroundColor: '#ffffff',
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
