import { ScrollView, ScrollViewProps } from 'react-native';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
}

export function ScrollbarView({ children, style, contentContainerStyle, ...rest }: Props) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
