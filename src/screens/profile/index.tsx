import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import ArrowLeft from '../../assets/icons/arrow-left-icon';
import { COLORS } from '../../theme/colors';
import { scale, verticalScale } from '../../utils/sizer';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PublicProfile = () => {
  const navigation = useNavigation<any>();
  // Random name pools
  const firstNames = [
    'Alex',
    'Jordan',
    'Taylor',
    'Morgan',
    'Casey',
    'Riley',
    'Avery',
    'Quinn',
    'Cameron',
    'Sage',
    'River',
    'Phoenix',
    'Skylar',
    'Rowan',
    'Finley',
    'Emerson',
    'Luna',
    'Nova',
    'Aria',
    'Zoe',
    'Maya',
    'Kai',
    'Leo',
    'Max',
    'Sam',
    'Drew',
    'Blake',
    'Jamie',
    'Reese',
    'Parker',
    'Hayden',
    'Peyton',
    'Eden',
    'Ash',
  ];

  const lastNames = [
    'Chen',
    'Rodriguez',
    'Johnson',
    'Williams',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
    'Taylor',
    'Anderson',
    'Thomas',
    'Jackson',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Garcia',
    'Martinez',
    'Robinson',
    'Clark',
    'Lewis',
    'Lee',
    'Walker',
    'Stone',
    'Brooks',
    'Reed',
    'Cooper',
    'Bell',
    'Murphy',
    'Rivera',
    'Cook',
  ];

  const generateRandomProfile = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      initials: `${firstName[0]}${lastName[0]}`,
      posts: Math.floor(Math.random() * 500) + 50,
      followers: Math.floor(Math.random() * 5000) + 200,
      following: Math.floor(Math.random() * 1000) + 100,
    };
  };

  const [profile, setProfile] = useState(() => generateRandomProfile());

  // Generate random colors for avatar
  const avatarColors = useMemo(() => {
    const colors = [
      '#8B5CF6',
      '#F59E0B',
      '#10B981',
      '#3B82F6',
      '#EF4444',
      '#8B5A2B',
      '#6366F1',
      '#EC4899',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, [profile]);

  const regenerateProfile = () => {
    setProfile(generateRandomProfile());
  };

  const MenuItem = ({ title, showDot = true }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>{title}</Text>
      {showDot && <View style={styles.purpleDot} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E9D5FF" barStyle="dark-content" />
      <TouchableOpacity
        onPress={() => {
          navigation.replace('MainTabs', {
            screen: 'Home', // the tab name
          });
        }}
        style={{
          position: 'absolute',
          top: verticalScale(16),
          left: scale(20),
          zIndex: 99,
          height: scale(48),
          width: scale(48),
          borderRadius: scale(32),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.surface.white,
        }}
      >
        <ArrowLeft size={20} />
      </TouchableOpacity>
      {/* Header with gradient background */}

      <View style={styles.header}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarColors }]}>
            <Text style={styles.initials}>{profile.initials}</Text>
          </View>
        </View>

        {/* Profile Name */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.fullName}</Text>
          <TouchableOpacity onPress={regenerateProfile}>
            <Text style={styles.generateButton}>Generate New Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Menu */}
        <View style={styles.menuContainer}>
          <MenuItem title="Stream" />
          <MenuItem title="About" />
          <MenuItem title="Photos" />
          <MenuItem title="Posts" />
          <MenuItem title="Friends" />
          <MenuItem title="Settings" />
        </View>

        {/* Profile Stats */}
        {/* <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile.followers.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile.following.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E9D5FF',
    paddingTop: verticalScale(60),
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  initials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  generateButton: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  purpleDot: {
    width: 12,
    height: 12,
    backgroundColor: '#C4B5FD',
    borderRadius: 6,
  },
  statsContainer: {
    backgroundColor: '#F9FAFB',
    marginTop: 32,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 80,
  },
});

export default PublicProfile;
