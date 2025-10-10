import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageWithHeader from '../../components/layout/page-with-header';
import {
  scale,
  verticalScale,
  scaleFont,
  moderateScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';
import RNFS from 'react-native-fs';
import { Toast } from 'toastify-react-native';
import { useAppDispatch } from '../../hooks/use-redux';
import { removeOfflineFile } from '../../store/slices/offline-slice';

const OfflineFile = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'pyq'>('notes');
  const [filesWithSize, setFilesWithSize] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  // Get offline files from Redux store
  const offlineFiles = useSelector((state: any) => state.offline?.files || []);

  // Filter files based on active tab
  const filteredFiles = offlineFiles.filter(
    (file: any) => file.type === activeTab,
  );

  // Get file sizes and check existence
  useEffect(() => {
    const getFileSizes = async () => {
      const filesWithSizeData = await Promise.all(
        filteredFiles.map(async (file: any) => {
          try {
            const exists = await RNFS.exists(file.localPath);
            if (!exists) {
              return { ...file, size: 0, exists: false };
            }

            const stat = await RNFS.stat(file.localPath);
            const sizeInMB = (stat.size / (1024 * 1024)).toFixed(2);
            return { ...file, size: sizeInMB, exists: true };
          } catch (error) {
            console.error('Error getting file size:', error);
            return { ...file, size: 0, exists: false };
          }
        }),
      );

      // Filter out non-existent files and update state
      const existingFiles = filesWithSizeData.filter(file => file.exists);
      setFilesWithSize(existingFiles);

      // Remove non-existent files from Redux
      filesWithSizeData.forEach(file => {
        if (!file.exists) {
          dispatch(removeOfflineFile(file.id));
        }
      });
    };

    getFileSizes();
  }, [filteredFiles, activeTab]);

  const handleDeleteFile = async (file: any) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await RNFS.unlink(file.localPath);
              dispatch(removeOfflineFile(file.id));
              Toast.success(`Deleted "${file.title}" successfully!`);
            } catch (error) {
              console.error('Delete error:', error);
              Toast.error('Failed to delete file');
            }
          },
        },
      ],
    );
  };

  const handleOpenFile = (file: any) => {
    // Navigate to the file viewer
    navigation.navigate('StreamsTab', {
      screen: 'Noteview',
      params: {
        from: 'Offline',
        url: `file://${file.localPath}`,
        headerTitle: file.title,
        isOffline: true,
      },
    });
  };

  const getTotalSize = () => {
    const total = filesWithSize.reduce(
      (acc, file) => acc + parseFloat(file.size || 0),
      0,
    );
    return total.toFixed(2);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleOpenFile(item)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemMeta}>
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>📁 {item.size} MB</Text>
          </View>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleDeleteFile(item)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📥</Text>
      <Text style={styles.emptyTitle}>No Offline Files</Text>
      <Text style={styles.emptyText}>
        Download {activeTab === 'notes' ? 'notes' : 'PYQs'} to access them
        offline
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Downloads</Text>
      {filesWithSize.length > 0 && (
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>
            {filesWithSize.length} file{filesWithSize.length !== 1 ? 's' : ''} •{' '}
            {getTotalSize()} MB
          </Text>
        </View>
      )}
    </View>
  );

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
            {offlineFiles.filter((f: any) => f.type === 'notes').length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {offlineFiles.filter((f: any) => f.type === 'notes').length}
                </Text>
              </View>
            )}
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
              PYQ
            </Text>
            {offlineFiles.filter((f: any) => f.type === 'pyq').length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {offlineFiles.filter((f: any) => f.type === 'pyq').length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <FlatList
            data={filesWithSize}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={filesWithSize.length > 0 ? renderHeader : null}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
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
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    gap: scale(8),
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
  badge: {
    backgroundColor: COLORS.voilet.dark,
    borderRadius: moderateScale(10),
    minWidth: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(6),
  },
  badgeText: {
    color: '#fff',
    fontSize: scaleFont(11),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: verticalScale(8),
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: '700',
    color: '#333',
    marginBottom: verticalScale(8),
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageText: {
    fontSize: scaleFont(13),
    color: '#666',
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
    marginBottom: verticalScale(8),
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flexWrap: 'wrap',
  },
  sizeContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  sizeText: {
    fontSize: scaleFont(11),
    color: '#666',
    fontWeight: '500',
  },
  offlineBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  offlineText: {
    fontSize: scaleFont(11),
    color: '#2E7D32',
    fontWeight: '600',
  },
  deleteButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: scaleFont(18),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(80),
    paddingHorizontal: scale(40),
  },
  emptyIcon: {
    fontSize: scaleFont(48),
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: scaleFont(14),
    color: '#999',
    textAlign: 'center',
    lineHeight: scaleFont(20),
  },
});

export default OfflineFile;
