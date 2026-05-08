import { Text, TextProps } from 'react-native';
import { typography, colors, TypographyVariant, ColorToken } from '../theme';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ColorToken | (string & {});
};

export function AppText({ variant = 'bodyM_R', color, style, ...props }: AppTextProps) {
  const colorValue =
    color && color in colors
      ? colors[color as ColorToken]
      : (color ?? colors.black);

  return (
    <Text
      style={[typography[variant], { color: colorValue }, style]}
      {...props}
    />
  );
}
