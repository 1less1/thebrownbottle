/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'; // tab button color when pressed
const tintColorDark = '#fff';  // tab button color when pressed

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FBF7F7',
    tint: tintColorLight,
    icon: '#687076', // for the chevron icon, can be deleted later
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  
  /* App Theme Colors */
  lightTan: '#FAF3ED',
  mediumTan: '#F0E7E0',
  darkTan: '#ECE1D4',
  yellowTan: '#FFDEAB',
  brown: '#7C580D',
  darkBrown: '#4A3508',
  greyWhite: '#FBF7F7',
  borderColor: '#D4CABE',
  tabBG: '#FDFBFB',
  
  /* General Colors */
  black: '#000000',
  white:'#FFFFFF',
  lightGray: '#E5E5EA',
  gray: '#B1B1B5',
  darkGray: '6B6B6E',

};
