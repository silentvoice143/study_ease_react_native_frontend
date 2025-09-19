import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Use your design base width/height (e.g. from Figma)
const BASE_WIDTH = 375; // iPhone X width
const BASE_HEIGHT = 812; // iPhone X height

// Scale horizontally
export const scale = (size: number) => (width / BASE_WIDTH) * size;

// Scale vertically
export const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;

// Scale with moderation factor (default 0.5)
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Scale fonts
export const scaleFont = (size: number) => size * PixelRatio.getFontScale();
