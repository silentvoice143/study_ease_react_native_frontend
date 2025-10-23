import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import SearchBox from '../../components/common/input';
import { COLORS } from '../../theme/colors';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchSubject } from '../../apis/subject';
import { subjects } from '../../apis/query-keys';
import SubjectCard from './_components/subject-card';
import { Toast } from 'toastify-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

type Subject = {
  id: number;
  name: string;
};

export type StreamsTabParamList = {
  'Notes & PYQ': {
    subjectId: number;
    initialTab: string;
  };
  Noteview: {
    url: string;
    headerTitle: string;
  };
};

export type RootStackParamList = {
  Home: undefined;
  Subject: { streamId: string | number; semester: string | number };
  StreamsTab: NavigatorScreenParams<StreamsTabParamList>;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Subject'>;

const SubjectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { streamId, semester } = route.params ?? { streamId: '', semester: 0 };
  const [searchQuery, setSearchQuery] = useState<string>('');

  console.log('Stream ID in SubjectScreen:', streamId);

  const queryOptions: UseQueryOptions<Subject[], Error> = {
    queryKey: subjects(streamId, semester),
    queryFn: () => fetchSubject(streamId, semester),
    staleTime: 1000 * 60 * 5,
    enabled: !!streamId && +semester > 0,
    onError: (err: Error) => Toast.error(err.message),
  } as UseQueryOptions<Subject[], Error>;

  const { data, isLoading, isError, error } = useQuery(queryOptions);

  console.log('Subjects Data:', isLoading, isError, error, data);

  // Filter subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((subject: Subject) =>
      subject.name.toLowerCase().includes(query),
    );
  }, [data, searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.voilet.dark} />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load subjects</Text>
          <Text style={styles.errorSubText}>
            {error?.message || 'Please try again later'}
          </Text>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No subjects available</Text>
          <Text style={styles.emptySubText}>
            Subjects will appear here once added
          </Text>
        </View>
      );
    }

    if (filteredSubjects.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No subjects found</Text>
          <Text style={styles.emptySubText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          paddingHorizontal: scale(20),
          paddingBottom: verticalScale(100),
          gap: verticalScale(16),
        }}
      >
        {filteredSubjects.map((item: Subject) => (
          <SubjectCard
            key={item.id}
            text={item.name}
            subtext="Select the subject and download notes and pyqs"
            onPress={() => {
              navigation.navigate('StreamsTab', {
                screen: 'Notes & PYQ',
                params: {
                  subjectId: +item.id,
                  initialTab: 'notes',
                },
              });
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <PageWithHeader>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: scale(20),
            marginBottom: verticalScale(20),
          }}
        >
          <SearchBox
            placeholder="Search for subjects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              borderRadius: moderateScale(28),
              paddingHorizontal: scale(16),
              borderColor: COLORS.voilet.lighter,
            }}
            height={verticalScale(40)}
          />
        </View>

        {/* Results count */}
        {!isLoading && data && data.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {searchQuery.trim()
                ? `${filteredSubjects.length} of ${data.length} subjects`
                : `${data.length} subjects available`}
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(20),
    minHeight: verticalScale(300),
  },
  loadingText: {
    fontSize: scaleFont(14),
    color: '#666',
    marginTop: verticalScale(12),
  },
  emptyText: {
    fontSize: scaleFont(16),
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  emptySubText: {
    fontSize: scaleFont(13),
    color: '#BBB',
    textAlign: 'center',
  },
  errorText: {
    fontSize: scaleFont(16),
    color: '#E74C3C',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  errorSubText: {
    fontSize: scaleFont(13),
    color: '#999',
    textAlign: 'center',
  },
  resultsContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(12),
  },
  resultsText: {
    fontSize: scaleFont(13),
    color: '#666',
    fontWeight: '500',
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

export default SubjectScreen;
