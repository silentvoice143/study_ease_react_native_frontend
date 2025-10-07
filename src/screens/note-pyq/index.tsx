import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
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

const NotesPYQScreen = ({ navigation, route }: any) => {
  const { subjectId, initialTab } = route.params ?? {};
  const [activeTab, setActiveTab] = useState(initialTab || 'notes');

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
  const data = activeTab === 'notes' ? notesData : pyqData.data;

  const handleDownload = (item: any) => {
    console.log('Downloading:', item.title);
    Toast.success('Download started!');
  };

  console.log(notesData, pyqData, '-------data');

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => {
        console.log('navigating to note screen');
        navigation.navigate('StreamsTab', {
          screen: 'Noteview',
          params: { url: item.url || 'abc' },
        });
      }}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemMeta}>
          {/* <Text style={styles.metaDot}>•</Text> */}
          <Text style={styles.metaText}>{item.year}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDownload(item)}
        style={styles.downloadButton}
      >
        <DownloadIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
    gap: scale(6),
  },
  metaText: {
    fontSize: scaleFont(12),
    color: COLORS.gray.light,
  },
  metaDot: {
    fontSize: scaleFont(12),
    color: '#999',
  },
  downloadButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.voilet.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    fontSize: scaleFont(18),
    color: COLORS.voilet.dark,
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
});

export default NotesPYQScreen;
