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
  height = verticalScale(60),
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
      boxStyle.push({ width: verticalScale(fixedWidth) });
    }
    if (minWidth) {
      boxStyle.push({ minWidth: verticalScale(minWidth) });
    }
  }

  if (style) {
    boxStyle.push(style);
  }

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        style={[boxStyle, { height: height }]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.voilet.light,
    borderRadius: verticalScale(24),
    height: verticalScale(48),
    paddingHorizontal: verticalScale(14),
    backgroundColor: '#fff',
  },
});
