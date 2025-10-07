import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import { COLORS } from '../../theme/colors';

type SearchBoxProps = TextInputProps & {
  placeholder?: string;
  variant?: 'fullWidth' | 'fixedWidth';
  height?: number;
  width?: number; // only for fixedWidth
  minWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export default function SearchBox({
  placeholder = 'Search...',
  variant = 'fullWidth',
  height = 40,
  width: fixedWidth,
  minWidth,
  style,
  ...props
}: SearchBoxProps) {
  const boxStyle: any[] = [
    styles.input,
    {
      height: verticalScale(height),
      fontSize: scaleFont(14),
    },
  ];

  if (variant === 'fullWidth') {
    boxStyle.push({ width: '100%' });
  } else if (variant === 'fixedWidth') {
    if (fixedWidth) {
      boxStyle.push({ width: scale(fixedWidth) });
    }
    if (minWidth) {
      boxStyle.push({ minWidth: scale(minWidth) });
    }
  }

  if (style) {
    boxStyle.push(style);
  }

  return (
    <View>
      <TextInput placeholder={placeholder} style={boxStyle} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.voilet.light,
    borderRadius: scale(24),
    height: verticalScale(48),
    paddingHorizontal: scale(14),
    backgroundColor: '#fff',
  },
});
