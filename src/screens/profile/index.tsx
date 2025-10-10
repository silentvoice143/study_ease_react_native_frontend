import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import ArrowLeft from '../../assets/icons/arrow-left-icon';
import { COLORS } from '../../theme/colors';
import { scale, verticalScale } from '../../utils/sizer';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const PublicProfile = () => {
  const navigation = useNavigation<any>();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const FeatureCard = ({ icon, title, description, color, delay = 0 }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.featureCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[color + '20', color + '05']}
          style={styles.featureGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
          </View>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const BenefitItem = ({ text, index }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 800 + index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.benefitItem,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.checkIcon}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.benefitText}>{text}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#7C3AED" barStyle="light-content" />

      <TouchableOpacity
        onPress={() => {
          navigation.replace('MainTabs', {
            screen: 'Home',
          });
        }}
        style={styles.backButton}
      >
        <ArrowLeft size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#7C3AED', '#8B5CF6', '#A78BFA']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[styles.heroContent, { transform: [{ scale: scaleAnim }] }]}
          >
            <View style={styles.rocketContainer}>
              <Text style={styles.rocketEmoji}>🚀</Text>
            </View>
            <Text style={styles.heroTitle}>
              Exciting Updates{'\n'}Coming Soon!
            </Text>
            <Text style={styles.heroSubtitle}>
              We're building amazing features to enhance your learning
              experience
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's Coming Next</Text>
          <Text style={styles.sectionSubtitle}>
            Get ready for these incredible features
          </Text>

          <FeatureCard
            icon="🔔"
            title="Real-Time Notifications"
            description="Instant updates on exam schedules, results, and important announcements. Never miss a thing!"
            color="#3B82F6"
            delay={0}
          />

          <FeatureCard
            icon="💬"
            title="Q&A Community"
            description="Ask questions, share knowledge, and help fellow students. A collaborative learning platform just for you."
            color="#10B981"
            delay={150}
          />

          <FeatureCard
            icon="👥"
            title="Public Group Chat"
            description="Connect with classmates in real-time. Discuss topics, share resources, and build your network."
            color="#F59E0B"
            delay={300}
          />

          <FeatureCard
            icon="🔐"
            title="Secure Authentication"
            description="Your data is protected with industry-standard security. Study with peace of mind."
            color="#EF4444"
            delay={450}
          />
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why You'll Love It</Text>

          <BenefitItem text="100% Free - No hidden costs ever" index={0} />
          <BenefitItem text="Student-focused features" index={1} />
          <BenefitItem text="Easy to use interface" index={2} />
          <BenefitItem text="Community-driven learning" index={3} />
          <BenefitItem text="24/7 access from anywhere" index={4} />
          <BenefitItem text="Regular updates and improvements" index={5} />
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#7C3AED', '#8B5CF6']}
            style={styles.ctaCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaTitle}>Stay Tuned!</Text>
            <Text style={styles.ctaDescription}>
              We're working hard to bring these features to you. Keep using the
              app and watch for updates.
            </Text>
            <View style={styles.ctaBadge}>
              <Text style={styles.ctaBadgeText}>Next Release: V2.0</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Have suggestions? We'd love to hear from you!
          </Text>
          <Text style={styles.footerSubtext}>
            Your feedback helps us build better features
          </Text>
        </View>

        <View style={styles.bottomSpace} />
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
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(16),
    left: scale(20),
    zIndex: 99,
    height: scale(48),
    width: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  heroSection: {
    paddingTop: verticalScale(80),
    paddingBottom: verticalScale(60),
    paddingHorizontal: scale(24),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  rocketContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  rocketEmoji: {
    fontSize: 50,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.voilet.lighter,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureGradient: {
    padding: 20,
    position: 'relative',
    borderRadius: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  featureContent: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  benefitsSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
  },
  ctaCard: {
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerNote: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});

export default PublicProfile;
