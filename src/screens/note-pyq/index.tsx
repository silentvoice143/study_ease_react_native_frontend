import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import {
  scale,
  verticalScale,
  scaleFont,
  moderateScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';
import DownloadIcon from '../../assets/icons/download-icon';
import { Toast } from 'toastify-react-native';
import { useQuery } from '@tanstack/react-query';
import { notes, pyq } from '../../apis/query-keys';
import { fetchSubjectNotes, fetchSubjectPYQ } from '../../apis/subject';
import { useAppDispatch } from '../../hooks/use-redux';
import { useFileDownloader } from '../../hooks/use-download';
import RNFS from 'react-native-fs';
import { removeOfflineFile } from '../../store/slices/offline-slice';
import Banner from '../../components/ads/benner';
import {
  createRewardedAd,
  loadAndShowInterstitialAdWithRetry,
} from '../../components/ads/rewarded';
import { InterstitialAd } from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';

const NotesPYQScreen = ({ navigation, route }: any) => {
  const { subjectId, initialTab } = route.params ?? {};
  const [activeTab, setActiveTab] = useState(initialTab || 'notes');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [fileExistence, setFileExistence] = useState<Record<string, boolean>>(
    {},
  );
  const [showingAds, setShowingAds] = useState(false);

  //---------ads control------------
  const [downloadAd, setDownloadAd] = useState<InterstitialAd>(() =>
    createRewardedAd(),
  );
  const [downloadAdLoaded, setDownloadAdLoaded] = useState(false);
  const [isDownloadAdLoading, setIsDownloadAdLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { downloadFile, progress, status } = useFileDownloader();

  useFocusEffect(
    useCallback(() => {
      const ad = createRewardedAd(); // Always create fresh instance
      setDownloadAd(ad);
    }, [dispatch, navigation]),
  );

  const {
    data: notesData,
    isLoading: isNotesLoading,
    isError: isNotesError,
    error: notesError,
  } = useQuery({
    queryKey: notes(subjectId),
    queryFn: () => fetchSubjectNotes(subjectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!subjectId,
  });

  const {
    data: pyqData,
    isLoading: isPYQLoading,
    isError: isPYQError,
    error: pyqError,
  } = useQuery({
    queryKey: pyq(subjectId),
    queryFn: () => fetchSubjectPYQ(subjectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!subjectId,
  });

  const isLoading = activeTab === 'notes' ? isNotesLoading : isPYQLoading;
  const isError = activeTab === 'notes' ? isNotesError : isPYQError;
  const error = activeTab === 'notes' ? notesError : pyqError;
  const data = activeTab === 'notes' ? notesData : pyqData?.data;

  // Check file existence for all items
  useEffect(() => {
    const checkAllFiles = async () => {
      if (!data || data.length === 0) return;

      const existenceMap: Record<string, boolean> = {};

      await Promise.all(
        data.map(async (item: any) => {
          const fileName = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
          const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
          const exists = await RNFS.exists(localPath);
          existenceMap[item.id] = exists;
        }),
      );

      setFileExistence(existenceMap);
    };

    checkAllFiles();
  }, [data, activeTab]);

  const showAdsAndDownload = async (item: any) => {
    try {
      setShowingAds(true);
      await loadAndShowInterstitialAdWithRetry({
        adName: 'Download',
        adInstance: downloadAd,
        setAdInstance: setDownloadAd,
        isAdLoaded: downloadAdLoaded,
        setAdLoaded: setDownloadAdLoaded,
        setLoader: setIsDownloadAdLoading,
        maxRetries: 5,
        onSkip: () => {
          handleDownloadFile(item);
          setDownloadAdLoaded(false);
        },
        onAdShown: () => {
          setShowingAds(false);
          setDownloadAdLoaded(false);
        },
        onAdDismissed() {
          handleDownloadFile(item);
        },
      });
    } catch (err) {
    } finally {
      setShowingAds(false);
    }
  };

  const handleDownloadFile = async (item: any) => {
    setDownloadingId(item.id);
    await downloadFile(item, activeTab);

    // Update file existence after download
    const fileName = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const exists = await RNFS.exists(localPath);
    setFileExistence(prev => ({ ...prev, [item.id]: exists }));
    setDownloadingId(null);
  };

  const handleDeleteFile = async (item: any) => {
    try {
      const fileName = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.unlink(localPath);
      Toast.success(`Deleted "${item.title}" successfully!`);

      // Update Redux store
      dispatch(removeOfflineFile(item.id));

      // Update file existence
      setFileExistence(prev => ({ ...prev, [item.id]: false }));
    } catch (err: any) {
      console.error('Delete error:', err);
      Toast.error('Failed to delete file');
    }
  };

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

  const renderItem = ({ item, index }: any) => {
    const isDownloading = downloadingId === item.id && status === 'downloading';
    const fileExists = fileExistence[item.id];

    return (
      <React.Fragment>
        <TouchableOpacity
          style={styles.itemCard}
          onPress={() => {
            console.log('navigating to note screen', item.fileUrl);
            navigation.navigate('StreamsTab', {
              screen: 'Noteview',
              params: { url: item.fileUrl || 'abc', headerTitle: item.title },
            });
          }}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.itemMeta}>
              <Text style={styles.metaText}>{item.year}</Text>
              {fileExists && (
                <View style={styles.downloadedBadge}>
                  <Text style={styles.downloadedText}>Downloaded</Text>
                </View>
              )}
            </View>
          </View>

          {isDownloading || showingAds ? (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="small" color={COLORS.voilet.dark} />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          ) : fileExists ? (
            <TouchableOpacity
              onPress={() => handleDeleteFile(item)}
              style={[styles.downloadButton, styles.deleteButton]}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => showAdsAndDownload(item)}
              style={styles.downloadButton}
            >
              <DownloadIcon />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {(index + 1) % 3 === 0 && index !== notesData.length - 1 && (
          <View style={styles.inFeedAdWrapper}>
            <BannerAd onClose={null} />
          </View>
        )}
      </React.Fragment>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.voilet.dark} />
          <Text style={styles.loadingText}>
            Loading {activeTab === 'notes' ? 'notes' : 'questions'}...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Failed to load {activeTab === 'notes' ? 'notes' : 'questions'}
          </Text>
          <Text style={styles.errorSubText}>
            {error?.message || 'Please try again later'}
          </Text>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            No {activeTab === 'notes' ? 'notes' : 'PYQs'} available yet
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {/* Tab Header */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'notes' && styles.activeTabText,
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'pyq' && styles.activeTab]}
            onPress={() => setActiveTab('pyq')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'pyq' && styles.activeTabText,
              ]}
            >
              Previous Year Questions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </PageWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.voilet.dark,
  },
  tabText: {
    fontSize: scaleFont(15),
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: COLORS.voilet.dark,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: scale(16),
    gap: verticalScale(12),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
    marginRight: scale(12),
  },
  itemTitle: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(6),
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  metaText: {
    fontSize: scaleFont(12),
    color: COLORS.gray.light,
  },
  downloadedBadge: {
    backgroundColor: COLORS.voilet.lighter,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(4),
  },
  downloadedText: {
    fontSize: scaleFont(10),
    color: COLORS.voilet.dark,
    fontWeight: '600',
  },
  downloadButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.voilet.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  deleteIcon: {
    fontSize: scaleFont(18),
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(40),
    width: scale(40),
    height: scale(40),
  },
  progressText: {
    fontSize: scaleFont(10),
    color: COLORS.voilet.dark,
    fontWeight: '600',
    marginTop: verticalScale(4),
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(20),
  },
  loadingText: {
    fontSize: scaleFont(14),
    color: '#666',
    marginTop: verticalScale(12),
  },
  emptyText: {
    fontSize: scaleFont(15),
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: scaleFont(15),
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

export default NotesPYQScreen;
