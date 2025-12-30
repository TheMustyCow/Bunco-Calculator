import { View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorScheme?: 'light' | 'dark';
};

export function ThemedView({ style, lightColor, darkColor, colorScheme: propColorScheme, ...otherProps }: ThemedViewProps) {
  const systemColorScheme = useColorScheme();
  const colorScheme = propColorScheme ?? systemColorScheme;
  const backgroundColor = lightColor || darkColor
    ? (colorScheme === 'dark' ? darkColor : lightColor) || Colors[colorScheme ?? 'light'].background
    : Colors[colorScheme ?? 'light'].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
