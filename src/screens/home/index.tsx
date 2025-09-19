// import { View, Text, StyleSheet } from 'react-native';
// import React from 'react';
// import { COLORS } from '../../theme/colors';
// import PageWithHeader from '../../components/layout/page-with-header';
// import Header from '../../components/common/header';
// import { GlowCircle } from '../../components/common/glow-circle';

// const Home = () => {
//   return (
//     // <PageWithHeader>
//     <View style={style.container}>
//       <Header />
//       <GlowCircle size={150} colors={['#ffffff', '#e0d4ff']} />
//       <Text>Home</Text>
//     </View>
//     // </PageWithHeader>
//   );
// };

// export default Home;

// const style = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.surface.white,
//   },
// });

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NotificationItem from './_components/notification-item';
import Header from '../../components/common/header';
import PageWithHeader from '../../components/layout/page-with-header';
import { scale, verticalScale } from '../../utils/sizer';

const Home = ({ navigation }) => {
  const streams = [
    { code: 'BCA', subtitle: 'PYQ+Notes' },
    { code: 'BBA', subtitle: 'PYQ+Notes' },
    { code: 'MBA', subtitle: 'PYQ+Notes' },
    { code: 'MCA', subtitle: 'PYQ+Notes' },
    { code: 'B.Tech', subtitle: 'PYQ+Notes' },
  ];

  const notifications = [
    'Sem III exam will be on 22-09-2025',
    'Sem III exam will be on 22-09-2025 all students should retrieve their admin roll before.',
    'Sem III exam will be on 22-09-2025',
  ];

  const StreamCard = ({ stream }) => (
    <TouchableOpacity
      style={styles.streamCard}
      onPress={() => {
        navigation.navigate('Noteview');
      }}
    >
      <Text style={styles.streamCode}>{stream.code}</Text>
      <Text style={styles.streamSubtitle}>{stream.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <PageWithHeader>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Streams Section */}
          <View style={{ paddingHorizontal: scale(16) }}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.streamsSection}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.streamsTitle}>Explore Streams</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.streamsContainer}
                contentContainerStyle={styles.streamsContent}
              >
                {streams.map((stream, index) => (
                  <StreamCard key={index} stream={stream} />
                ))}
              </ScrollView>
            </LinearGradient>
          </View>

          {/* Notifications Section */}
          <View style={styles.notificationsSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {notifications.map((notification, index) => (
              <NotificationItem key={index} text={notification} />
            ))}
          </View>

          {/* Advertisements Section */}
          {/* <View style={styles.advertisementsSection}>
            <Text style={styles.sectionTitle}>Advertisements</Text>
            <View style={styles.adPlaceholder}>
              <Text style={styles.adText}>ADS</Text>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </PageWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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

export default Home;
