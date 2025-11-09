import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import BannerAd from '../../components/common/bannerAds';
import { LinearGradient } from 'react-native-linear-gradient';

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
  const [showTopBanner, setShowTopBanner] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const queryOptions: UseQueryOptions<Subject[], Error> = {
    queryKey: subjects(streamId, semester),
    queryFn: () => fetchSubject(streamId, semester),
    staleTime: 1000 * 60 * 5,
    enabled: !!streamId && +semester > 0,
    onError: (err: Error) => Toast.error(err.message),
  } as UseQueryOptions<Subject[], Error>;

  const { data, isLoading, isError, error } = useQuery(queryOptions);

  useEffect(() => {
    if (data && data.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [data]);

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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.voilet.dark} />
            <Text style={styles.loadingText}>Fetching your subjects...</Text>
            <Text style={styles.loadingSubText}>This won't take long</Text>
          </View>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>Oops! Something went wrong</Text>
            <Text style={styles.errorSubText}>
              {error?.message || 'Unable to load subjects. Please try again.'}
            </Text>
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No subjects yet</Text>
            <Text style={styles.emptySubText}>
              Subjects will appear here once they're added to your curriculum
            </Text>
          </View>
        </View>
      );
    }

    if (filteredSubjects.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No matches found</Text>
            <Text style={styles.emptySubText}>
              Try using different keywords in your search
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Animated.View
        style={{
          paddingHorizontal: scale(20),
          paddingBottom: verticalScale(100),
          gap: verticalScale(12),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {filteredSubjects.map((item: Subject, index: number) => (
          <Animated.View
            key={item.id}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 50 + index * 10],
                  }),
                },
              ],
            }}
          >
            <SubjectCard
              text={item.name}
              subtext="Tap to access notes, PYQs & study materials"
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
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={[COLORS.voilet.dark, COLORS.voilet.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Semester {semester}</Text>
            <Text style={styles.headerSubtitle}>
              Choose a subject to continue
            </Text>
          </View>
        </LinearGradient>

        {/* Banner Ad */}
        {showTopBanner && (
          <View style={styles.bannerContainer}>
            <BannerAd />
          </View>
        )}

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <SearchBox
            placeholder="Search subjects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            height={verticalScale(48)}
            style={{ paddingHorizontal: scale(14) }}
          />
        </View>

        {/* Content Section */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
    backgroundColor: COLORS.surface.white,
  },
  headerGradient: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  headerContent: {
    gap: verticalScale(4),
  },
  headerTitle: {
    fontSize: scaleFont(28),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: scaleFont(14),
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '400',
  },
  bannerContainer: {
    marginTop: verticalScale(12),
  },
  searchContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  // searchBox: {
  //   borderRadius: moderateScale(16),
  //   paddingHorizontal: scale(16),
  //   borderColor: '#E8EAED',
  //   backgroundColor: '#FFFFFF',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 8,
  //   elevation: 2,
  // },
  statsBar: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(20),
  },
  statNumber: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: COLORS.voilet.dark,
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: scaleFont(12),
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: verticalScale(32),
    backgroundColor: '#E8EAED',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(32),
    minHeight: verticalScale(300),
  },
  loadingContainer: {
    alignItems: 'center',
    gap: verticalScale(12),
  },
  loadingText: {
    fontSize: scaleFont(16),
    color: '#333',
    fontWeight: '600',
    marginTop: verticalScale(8),
  },
  loadingSubText: {
    fontSize: scaleFont(13),
    color: '#999',
  },
  errorContainer: {
    alignItems: 'center',
    gap: verticalScale(12),
    backgroundColor: '#FFFFFF',
    padding: scale(24),
    borderRadius: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorIcon: {
    fontSize: scaleFont(48),
    marginBottom: verticalScale(8),
  },
  errorText: {
    fontSize: scaleFont(18),
    color: '#E74C3C',
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: scaleFont(20),
  },
  retryButton: {
    backgroundColor: COLORS.voilet.dark,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(24),
    marginTop: verticalScale(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    gap: verticalScale(12),
    backgroundColor: '#FFFFFF',
    padding: scale(32),
    borderRadius: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: scaleFont(64),
    marginBottom: verticalScale(8),
  },
  emptyText: {
    fontSize: scaleFont(18),
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: scaleFont(14),
    color: '#999',
    textAlign: 'center',
    lineHeight: scaleFont(20),
    maxWidth: scale(240),
  },
});

export default SubjectScreen;
