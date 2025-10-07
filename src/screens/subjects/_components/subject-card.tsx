import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../../utils/sizer';
import { COLORS } from '../../../theme/colors';
import DownloadIcon from '../../../assets/icons/download-icon';

type CardProps = {
  text: string;
  subtext?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onClickButton?: (event: GestureResponderEvent) => void;
};

export default function SubjectCard({
  text,
  subtext,
  onPress,
  onClickButton,
}: CardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{text}</Text>
        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: verticalScale(10),
        }}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Notes</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>PYQ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.voilet.lighter,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(24),
    paddingVertical: scale(24),
    backgroundColor: '#fff',

    justifyContent: 'space-between',

    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: scale(10),
  },
  title: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
  },
  subtext: {
    fontSize: scaleFont(13),
    color: '#777',
    marginTop: verticalScale(2),
  },
  button: {
    backgroundColor: COLORS.voilet.dark,
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
  },
  buttonText: {
    fontSize: scaleFont(14),
    fontWeight: '500',
    color: COLORS.surface.white,
  },
});
