import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PageWithHeader from '../../components/layout/page-with-header';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'System Maintenance Scheduled',
    description:
      'Our systems will undergo routine maintenance on the scheduled date. Services may be temporarily unavailable.',
    start_date: new Date('2025-10-15'),
    attachment: 'https://example.com/maintenance-schedule.pdf',
    created: 1728288000000,
    notice_type: 'maintenance',
    createdAt: new Date('2025-10-01T10:00:00Z'),
    updatedAt: new Date('2025-10-01T10:00:00Z'),
  },
  {
    id: 2,
    title: 'New Feature Release',
    description:
      "We're excited to announce new features including dark mode support and enhanced notifications.",
    start_date: new Date('2025-10-08'),
    attachment: null,
    created: 1728374400000,
    notice_type: 'feature',
    createdAt: new Date('2025-10-02T14:30:00Z'),
    updatedAt: new Date('2025-10-02T14:30:00Z'),
  },
  {
    id: 3,
    title: 'Security Update Available',
    description:
      'A critical security update is now available. Please update your application at your earliest convenience.',
    start_date: new Date('2025-10-07'),
    attachment: 'https://example.com/security-bulletin.pdf',
    created: 1728460800000,
    notice_type: 'security',
    createdAt: new Date('2025-10-03T09:15:00Z'),
    updatedAt: new Date('2025-10-05T11:20:00Z'),
  },
  {
    id: 4,
    title: 'Holiday Notice',
    description:
      'Our support team will have limited availability during the upcoming holiday season.',
    start_date: new Date('2025-12-24'),
    attachment: null,
    created: 1728547200000,
    notice_type: 'announcement',
    createdAt: new Date('2025-10-04T16:45:00Z'),
    updatedAt: new Date('2025-10-04T16:45:00Z'),
  },
  {
    id: 5,
    title: 'Policy Update',
    description:
      'Our terms of service and privacy policy have been updated. Please review the changes.',
    start_date: new Date('2025-10-10'),
    attachment: 'https://example.com/policy-changes.pdf',
    created: 1728633600000,
    notice_type: 'policy',
    createdAt: new Date('2025-10-05T08:00:00Z'),
    updatedAt: new Date('2025-10-05T08:00:00Z'),
  },
];

// Banner Ad Component
const BannerAd = ({ onClose }) => {
  return (
    <View style={styles.bannerAdContainer}>
      <View style={styles.bannerAdContent}>
        <View style={styles.adTextContainer}>
          <Text style={styles.adLabel}>Ad</Text>
          <Text style={styles.adTitle}>Premium Features Available</Text>
          <Text style={styles.adDescription}>
            Upgrade to remove ads and unlock exclusive features
          </Text>
        </View>
        <TouchableOpacity style={styles.adButton}>
          <Text style={styles.adButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
      {onClose && (
        <TouchableOpacity style={styles.closeAdButton} onPress={onClose}>
          <Text style={styles.closeAdText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NotificationScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [showTopBanner, setShowTopBanner] = useState(true);

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
      maintenance: '#f59e0b',
      feature: '#10b981',
      security: '#ef4444',
      announcement: '#3b82f6',
      policy: '#8b5cf6',
    };
    return colors[type] || '#6b7280';
  };

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageWithHeader>
      <View style={styles.container}>
        {/* Top Banner Ad - Dismissible */}
        {showTopBanner && <BannerAd onClose={() => setShowTopBanner(false)} />}

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {mockNotifications.length} notifications
            </Text>
          </View>

          <View style={styles.notificationList}>
            {mockNotifications.map((notification, index) => {
              const isExpanded = expandedId === notification.id;
              const typeColor = getNoticeTypeColor(notification.notice_type);

              return (
                <React.Fragment key={notification.id}>
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
                          <Text style={[styles.typeText, { color: typeColor }]}>
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
                        <Text style={styles.metadataLabel}>Start Date:</Text>
                        <Text style={styles.metadataValue}>
                          {formatDate(notification.start_date)}
                        </Text>
                      </View>

                      {isExpanded && (
                        <>
                          <View style={styles.metadataItem}>
                            <Text style={styles.metadataLabel}>Created:</Text>
                            <Text style={styles.metadataValue}>
                              {formatDate(notification.createdAt)}
                            </Text>
                          </View>

                          {notification.attachment && (
                            <View style={styles.metadataItem}>
                              <Text style={styles.metadataLabel}>
                                Attachment:
                              </Text>
                              <TouchableOpacity onPress={() => {}}>
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
                    index !== mockNotifications.length - 1 && (
                      <View style={styles.inFeedAdWrapper}>
                        <BannerAd onClose={null} />
                      </View>
                    )}
                </React.Fragment>
              );
            })}
          </View>

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
    backgroundColor: '#f3f4f6',
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
  // Banner Ad Styles
  bannerAdContainer: {
    backgroundColor: '#f0f9ff',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default NotificationScreen;
