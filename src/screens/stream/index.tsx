import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useMemo, useState } from 'react';
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
import { useDebounce } from '../../hooks/use-debounce';
import BannerAd from '../../components/common/bannerAds';

const StreamScreen = ({ navigation, route }: any) => {
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { stream } = route.params ?? '';
  const {
    data,
    isLoading: streamLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['streams'],
    queryFn: () => fetchStreams(''),
    staleTime: 1000 * 60 * 5,
  });

  console.log(
    'Streams Data in StreamScreen:',
    streamLoading,
    isError,
    error,
    data,
  );

  const streamData = useMemo(() => {
    if (!data?.streams) return [];
    if (!debouncedSearch) return data.streams;
    return data.streams.filter((stream: any) =>
      stream.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [data?.streams, debouncedSearch]);

  return (
    <PageWithHeader>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: scale(20),
            marginBottom: verticalScale(12),
          }}
        >
          <SearchBox
            style={{
              borderRadius: verticalScale(28),
              paddingHorizontal: verticalScale(16),
              borderColor: COLORS.voilet.lighter,
            }}
            height={verticalScale(40)}
            onChangeText={text => setSearchQuery(text as string)}
          />
        </View>
        {showTopBanner && (
          <BannerAd
            onClose={() => {
              setShowTopBanner(false);
            }}
          />
        )}

        {streamLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.gray.light} />
            <Text style={styles.loaderText}>Loading streams...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load streams</Text>
            <Text style={styles.errorSubtext}>{error?.message}</Text>
          </View>
        ) : (
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
              {streamData?.length > 0 ? (
                streamData.map((item, idx) => (
                  <Card
                    key={item.id}
                    text={item.name}
                    subtext="PYQ + Notes"
                    onPress={() => {
                      navigation.navigate('StreamsTab', {
                        screen: 'Semester',
                        params: { streamId: item.id ?? '' },
                      });
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {debouncedSearch
                      ? 'No streams found matching your search'
                      : 'No streams available'}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
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
    paddingTop: verticalScale(10),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(16),
  },
  loaderText: {
    fontSize: scaleFont(14),
    color: COLORS.gray.light,
    marginTop: verticalScale(8),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  errorText: {
    fontSize: scaleFont(16),
    color: '#ff4444',
    fontWeight: '600',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: scaleFont(12),
    color: '#999',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
  emptyText: {
    fontSize: scaleFont(14),
    color: '#999',
    textAlign: 'center',
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
});

export default StreamScreen;
