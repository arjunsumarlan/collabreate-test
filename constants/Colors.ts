/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#007AFF',
    icon: '#000',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    secondaryBackground: '#f0f0f0',
    error: '#ff4444',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#0A84FF',
    icon: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    secondaryBackground: '#1c1c1c',
    error: '#FF453A',
  },
} as const;
