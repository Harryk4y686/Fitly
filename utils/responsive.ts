import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Responsive width function
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive height function
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font size
export const rf = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing
export const rs = (size: number): number => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Screen size categories
export const isSmallScreen = SCREEN_WIDTH < 375;
export const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = SCREEN_WIDTH >= 414;

// Safe area helpers
export const getMinimumPadding = () => {
  if (isSmallScreen) return 16;
  if (isMediumScreen) return 20;
  return 24;
};

// Font size helpers
export const getFontSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return rf(small);
  if (isMediumScreen) return rf(medium);
  return rf(large);
};

// Spacing helpers
export const getSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return rs(small);
  if (isMediumScreen) return rs(medium);
  return rs(large);
};

// Button height helpers
export const getButtonHeight = () => {
  if (isSmallScreen) return rs(48);
  if (isMediumScreen) return rs(52);
  return rs(56);
};

// Container padding helpers
export const getContainerPadding = () => {
  return {
    horizontal: getMinimumPadding(),
    vertical: getSpacing(16, 20, 24),
  };
};

export const RESPONSIVE_SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallScreen,
  isMedium: isMediumScreen,
  isLarge: isLargeScreen,
};
