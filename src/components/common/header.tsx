import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';
import MenuIcon from '../../assets/icons/menu-icon';
import NotificationIcon from '../../assets/icons/notification-icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import ArrowLeft from '../../assets/icons/arrow-left-icon';
import { Fonts } from '../../theme/fonts';

const Header = ({
  headerTitle,
  navigateBack,
}: {
  headerTitle?: string;
  navigateBack?: string;
}) => {
  const navigation = useNavigation<any>();
  const routes = navigation.getState()?.routes ?? [];
  const index = navigation.getState()?.index ?? 0;

  const canShowBack = index > 0;
  const path = useRoute();

  const hearderVariantPath = ['Home'];

  return (
    <View
      style={{
        height: verticalScale(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: verticalScale(20),
        marginTop: verticalScale(20),
        // backgroundColor: 'red',
      }}
    >
      {/* Left section */}
      {canShowBack && path.name !== 'Home' && path.name !== 'Search' && (
        <TouchableOpacity
          onPress={() => {
            if (canShowBack) {
              if (navigateBack) {
                navigation.navigate(navigateBack);
              } else {
                navigation.goBack();
              }
            } else {
              // open drawer or do something else
            }
          }}
          style={{
            height: verticalScale(48),
            width: verticalScale(48),
            borderRadius: verticalScale(32),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.surface.white,
          }}
        >
          <ArrowLeft size={20} />
        </TouchableOpacity>
      )}

      {(path.name === 'Home' ||
        path.name === 'Search' ||
        path.name === 'Stream') && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PublicProfile');
          }}
          style={{
            height: verticalScale(48),
            width: verticalScale(48),
            borderRadius: verticalScale(32),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.surface.white,
          }}
        >
          <MenuIcon size={20} color="#000" />
        </TouchableOpacity>
      )}

      {/* Center section */}
      {!hearderVariantPath.includes(path.name) && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.inter.medium,
              fontSize: scaleFont(16),
            }}
          >
            {headerTitle
              ? headerTitle.length > 10
                ? `${headerTitle.slice(0, 20)}...`
                : headerTitle
              : path.name}
          </Text>
        </View>
      )}

      {/* Right section */}
      {hearderVariantPath.includes(path.name) ? (
        <View
          style={{
            flexDirection: 'row',
            gap: scale(20),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={{
              height: verticalScale(48),
              width: verticalScale(48),
              borderRadius: verticalScale(32),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.surface.pink,
            }}
          >
            <View
              style={{
                width: verticalScale(8),
                height: verticalScale(8),
                borderRadius: verticalScale(4),
                backgroundColor: COLORS.surface.white,
                position: 'absolute',
                right: verticalScale(15),
                top: verticalScale(15),
              }}
            />
            <NotificationIcon size={20} stroke={4} />
          </TouchableOpacity>
        </View>
      ) : (
        // keep space if no right icons, so center text remains centered
        <View style={{ width: scale(48) }} />
      )}
    </View>
  );
};

export default Header;
