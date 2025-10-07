import { View, Text } from 'react-native';
import React from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import SearchBox from '../../components/common/input';
import { COLORS } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from '../../utils/sizer';

const SearchScreen = ({ navigation }: any) => {
  return (
    <PageWithHeader>
      <View
        style={{
          paddingHorizontal: scale(20),
          marginBottom: verticalScale(48),
        }}
      >
        <SearchBox
          style={{
            borderRadius: moderateScale(28),
            paddingHorizontal: scale(16),
            borderColor: COLORS.voilet.lighter,
          }}
          height={verticalScale(48)}
        />
      </View>
    </PageWithHeader>
  );
};

export default SearchScreen;
