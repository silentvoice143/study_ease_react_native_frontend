import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import SearchBox from '../../components/common/input';
import { COLORS } from '../../theme/colors';
import Card from '../../components/common/card';
import { fetchStreams } from '../../apis/stream';
import { useQuery } from '@tanstack/react-query';
import { streams } from '../../apis/query-keys';
import Banner from '../../components/ads/benner';
import { banner_set1 } from '../../components/ads/ads-units';
import { getRandomAdUnit } from '../../utils/get-random-ads-unit';

// Banner Ad Component - Replace with your actual ad component
const BannerAd = ({ onClose }: any) => {
  return (
    <View style={[{ backgroundColor: COLORS.surface.background }]}>
      <Banner
        adUnitId={getRandomAdUnit(banner_set1)}
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

const SemesterScreen = ({ navigation, route }: any) => {
  const [showTopBanner, setShowTopBanner] = React.useState(true);
  const { streamId = null } = route.params ?? {};
  console.log('Stream ID in SubjectScreen:', streamId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: streams(streamId),
    queryFn: () => fetchStreams(streamId),
    staleTime: 1000 * 60 * 5,
    enabled: !!streamId,
  });

  console.log('Streams Data ', isLoading, isError, error, data);

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {showTopBanner && (
          <BannerAd
            onClose={() => {
              setShowTopBanner(false);
            }}
          />
        )}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: scale(20),
              paddingBottom: verticalScale(100),
              gap: verticalScale(16),
            }}
          >
            {/* Top Banner Ad - Shows after header */}

            {/* Loading/Error States */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading semesters...</Text>
              </View>
            )}
            {isError && <Text>Error: {String(error)}</Text>}

            {/* Semester Cards */}
            {data?.totalSemesters &&
              Array.from({ length: data.totalSemesters }).map((item, idx) => (
                <React.Fragment key={`semester-${idx + 1}`}>
                  <Card
                    text={`Sem - ${idx + 1}`}
                    subtext="PYQ + Notes"
                    onPress={() =>
                      navigation.navigate('StreamsTab', {
                        screen: 'Subject',
                        params: { streamId: streamId, semester: idx + 1 },
                      })
                    }
                  />

                  {/* Mid-content Banner Ad - Shows after every 4 semesters */}
                  {(idx + 1) % 4 === 0 && idx !== data.totalSemesters - 1 && (
                    <View style={styles.inFeedAdWrapper}>
                      <BannerAd onClose={null} />
                    </View>
                  )}
                </React.Fragment>
              ))}

            {/* Bottom Banner Ad - Shows at the end of content */}
            {data?.totalSemesters && data.totalSemesters > 0 && (
              <View style={styles.inFeedAdWrapper}>
                <BannerAd onClose={null} />
              </View>
            )}
          </View>
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
  scrollView: {
    flex: 1,
  },
  // Banner Ad Styles
  bannerAdContainer: {
    width: '100%',
    height: verticalScale(50),
    backgroundColor: COLORS.surface.white,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  adPlaceholderText: {
    color: '#999',
    fontSize: scaleFont(12),
    fontWeight: '400',
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
  notificationsSection: {
    padding: 20,
    height: '50%',
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
  //Banner
  bannerAdContainer: {
    backgroundColor: COLORS.surface.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
    position: 'relative',
  },
  bannerAdContent: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  adLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  adDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  adButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  adButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
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
    backgroundColor: COLORS.surface.white,
  },
  bottomSpacing: {
    height: 20,
  },
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surface.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default SemesterScreen;
