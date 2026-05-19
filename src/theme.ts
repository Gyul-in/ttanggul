export const colors = {
  // Backgrounds
  bgMain: '#F5F1E8',
  bgCard: '#FFFCF7',
  bgLight: '#FAF7F2',
  bgInput: '#EDE2CE',

  // Brown scale
  brown100: '#F5F1E8',
  brown200: '#EDE2CE',
  brown300: '#D3BF9E',
  brown500: '#B48A5B',
  brown600: '#A7784F',
  brown700: '#8B6143',
  brown800: '#71503B',
  brown900: '#5C4232',

  // Gray scale
  gray100: '#ECEDEC',
  gray200: '#D2D4D2',
  gray300: '#B8BBB8',
  gray400: '#9FA19F',
  gray500: '#858885',
  gray600: '#6A6F6B',
  gray700: '#525552',
  gray800: '#353835',
  gray900: '#212121',

  // Foundation
  black: '#111111',
  white: '#FFFFFF',

  // Brand
  primary: '#3FC259',
  primary600: '#29903E',

  // System
  error: '#FF6D6D',
  errorBtn: '#FF5959',
  required: '#FF6D6D',

  // 보관함 배경색
  pastelBlue: '#E8F1F5',
  pastelGreen: '#E8F5E9',
  pastelYellow: '#FFF9C4',
  pastelCoral: '#FFCCBC',
  pastelPurple: '#E1BEE7',
} as const;

export const typography = {
  header: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 30,
    lineHeight: 42,
    letterSpacing: -0.3,
  },
  header2: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    lineHeight: 39.2,
    letterSpacing: -0.28,
  },
  mainTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: -0.26,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.24,
  },
  subTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
  },
  bodyXL_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    letterSpacing: 0,
  },
  bodyXL_M: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
  },
  bodyL_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 17,
    letterSpacing: 0,
  },
  bodyL_M: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 17,
    lineHeight: 25.5,
    letterSpacing: 0,
  },
  bodyL_R: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    lineHeight: 25.5,
    letterSpacing: 0,
  },
  bodyM_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyM_R: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMS_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 19.5,
    letterSpacing: -0.3,
  },
  bodyMS_M: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0,
  },
  bodyS_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  bodyS_M: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  bodyXS_SB: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 13,
    lineHeight: 16.9,
    letterSpacing: 0,
  },
  bodyXS_M: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  tag: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 22.5,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
export type ColorToken = keyof typeof colors;

export const theme = {
  colors,
  typography,
};
