import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import PageWithHeader from '../../components/layout/page-with-header';
import { COLORS } from '../../theme/colors';
import { notifications } from '../../apis/query-keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNotification } from '../../apis/notification';
import Banner from '../../components/ads/benner';

const { width, height } = Dimensions.get('window');

// Banner Ad Component
const BannerAd = ({ onClose }) => {
  return (
    <View style={styles.bannerAdContainer}>
      <Banner
        adUnitId={'ca-app-pub-5415975767472598/1623919576'}
        size="BANNER"
        maxRetries={20}
        retryDelay={20000}
        exponentialBackoff={true}
        showDebugInfo={true}
        onAdLoaded={() => console.log('Ad ready!')}
        onRetryAttempt={attempt => console.log(`Attempt ${attempt}`)}
      />
      {onClose && (
        <TouchableOpacity style={styles.closeAdButton} onPress={onClose}>
          <Text style={styles.closeAdText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NotificationScreen = ({ navigation }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [showTopBanner, setShowTopBanner] = useState(true);
  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications', limit],
    queryFn: ({ pageParam = 1 }) => fetchNotification(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages
      if (
        lastPage.hasMore ||
        (lastPage.totalPages && allPages.length < lastPage.totalPages)
      ) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  const formatDate = date => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getNoticeTypeColor = type => {
    const colors = {
      result: '#f59e0b',
      notice: '#10b981',
      security: '#ef4444',
      announcement: '#3b82f6',
      policy: '#8b5cf6',
    };
    return colors[type] || '#6b7280';
  };

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle scroll for infinite loading
  const handleScroll = useCallback(
    ({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 100; // Increased trigger distance

      // Check if scrolled near bottom
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // Flatten all pages into single array
  const allNotifications = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(p => p.notifications);
  }, [data?.pages]);
  const totalCount = React.useMemo(() => {
    return data?.pages?.[0]?.total || 0;
  }, [data?.pages]);

  console.log('Notifications Data:', allNotifications);

  if (isError) {
    return (
      <PageWithHeader>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load notifications</Text>
            <Text style={styles.errorSubtext}>{error?.message}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => window.location.reload()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {/* Top Banner Ad - Dismissible */}
        {showTopBanner && <BannerAd onClose={() => setShowTopBanner(false)} />}

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {totalCount > 0
                ? `${allNotifications.length} of ${totalCount} notifications loaded`
                : 'No notifications'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : (
            <>
              <View style={styles.notificationList}>
                {allNotifications.length > 0 ? (
                  allNotifications.map((notification, index) => {
                    const isExpanded = expandedId === notification.id;
                    const typeColor = getNoticeTypeColor(
                      notification.notice_type,
                    );

                    return (
                      <React.Fragment key={`${notification.id}-${index}`}>
                        <TouchableOpacity
                          style={styles.notificationCard}
                          onPress={() => toggleExpand(notification.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.cardHeader}>
                            <View style={styles.titleRow}>
                              <Text
                                style={styles.title}
                                numberOfLines={isExpanded ? 0 : 2}
                              >
                                {notification.title}
                              </Text>
                              <View
                                style={[
                                  styles.typeBadge,
                                  { backgroundColor: typeColor + '20' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.typeText,
                                    { color: typeColor },
                                  ]}
                                >
                                  {notification.notice_type || 'general'}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {notification.description && (
                            <Text
                              style={styles.description}
                              numberOfLines={isExpanded ? 0 : 2}
                            >
                              {notification.description}
                            </Text>
                          )}

                          <View style={styles.metadata}>
                            <View style={styles.metadataItem}>
                              <Text style={styles.metadataLabel}>
                                Start Date:
                              </Text>
                              <Text style={styles.metadataValue}>
                                {formatDate(notification.start_date)}
                              </Text>
                            </View>

                            {isExpanded && (
                              <>
                                <View style={styles.metadataItem}>
                                  <Text style={styles.metadataLabel}>
                                    Created:
                                  </Text>
                                  <Text style={styles.metadataValue}>
                                    {formatDate(notification.createdAt)}
                                  </Text>
                                </View>

                                {notification.attachment && (
                                  <View style={styles.metadataItem}>
                                    <Text style={styles.metadataLabel}>
                                      Attachment:
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => {
                                        navigation.navigate(
                                          'NotificationView',
                                          {
                                            headerTitle: notification.title,
                                            url: `https://www.vbu.ac.in/ftpwebapps/vbu/resources/vbu_web/${notification.notice_type}/${notification.attachment}`,
                                          },
                                        );
                                      }}
                                    >
                                      <Text style={styles.attachmentLink}>
                                        View File
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </>
                            )}
                          </View>

                          <Text style={styles.expandHint}>
                            {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                          </Text>
                        </TouchableOpacity>

                        {/* In-feed Banner Ad - Every 3 notifications */}
                        {(index + 1) % 3 === 0 &&
                          index !== allNotifications.length - 1 && (
                            <View style={styles.inFeedAdWrapper}>
                              <BannerAd onClose={null} />
                            </View>
                          )}

                        {/* Show loading indicator after every 10 items if fetching */}
                        {isFetchingNextPage &&
                          index === allNotifications.length - 1 && (
                            <View style={styles.bottomLoadingContainer}>
                              <ActivityIndicator size="small" color="#3b82f6" />
                              <Text style={styles.bottomLoadingText}>
                                Loading more...
                              </Text>
                            </View>
                          )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No notifications found</Text>
                  </View>
                )}
              </View>

              {/* End of list indicator */}
              {!hasNextPage && allNotifications.length > 0 && (
                <View style={styles.endOfListContainer}>
                  <View style={styles.endOfListLine} />
                  <Text style={styles.endOfListText}>
                    You've reached the end
                  </Text>
                  <View style={styles.endOfListLine} />
                </View>
              )}
            </>
          )}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </PageWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  notificationList: {
    padding: 16,
    backgroundColor: COLORS.surface.white,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  metadata: {
    gap: 8,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 13,
    color: '#111827',
  },
  attachmentLink: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  expandHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: height * 0.5,
    backgroundColor: COLORS.surface.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  bottomLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  bottomLoadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  // End of List
  endOfListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  endOfListLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  endOfListText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Load More Button (Optional)
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  loadMoreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Banner Ad Styles
  bannerAdContainer: {},

  closeAdButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeAdText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '300',
    lineHeight: 20,
  },
  inFeedAdWrapper: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default NotificationScreen;
