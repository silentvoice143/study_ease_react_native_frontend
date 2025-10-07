import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

const StreamScreen = ({ navigation, route }: any) => {
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

  return (
    <PageWithHeader>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: scale(20),
            marginBottom: verticalScale(48),
          }}
        >
          <SearchBox
            style={{
              borderRadius: moderateScale(28),
              paddingHorizontal: scale(16),
              borderColor: COLORS.voilet.lighter,
            }}
            height={verticalScale(48)}
          />
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Streams Section */}

          <View
            style={{
              paddingHorizontal: scale(20),
              paddingBottom: verticalScale(100),
              gap: verticalScale(16),
            }}
          >
            {data?.streams?.map((item, idx) => (
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
            ))}
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
    // backgroundColor: 'red',
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
