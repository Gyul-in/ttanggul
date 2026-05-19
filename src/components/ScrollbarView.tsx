import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, ScrollViewProps, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
}

export function ScrollbarView({ children, style, contentContainerStyle, ...rest }: Props) {
  const isFocused = useIsFocused();
  const containerHRef = useRef(0);
  const contentHRef = useRef(0);
  const indicatorTranslateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const [indicatorH, setIndicatorH] = useState(0);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
    }, 1000);
  }, [opacityAnim]);

  useEffect(() => {
    if (!isFocused) {
      clearTimeout(hideTimer.current);
      Animated.timing(opacityAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
    }
  }, [isFocused, opacityAnim]);

  const showAndUpdate = useCallback((scrollY: number) => {
    const cH = containerHRef.current;
    const ctH = contentHRef.current;
    if (cH <= 0 || ctH <= cH) return;
    const indH = Math.max(30, (cH / ctH) * cH);
    const maxTop = cH - indH;
    const ratio = scrollY / (ctH - cH);
    indicatorTranslateAnim.setValue(Math.min(Math.max(ratio * maxTop, 0), maxTop));
    opacityAnim.setValue(1);
  }, [indicatorTranslateAnim, opacityAnim]);

  const recalcIndicator = useCallback(() => {
    const cH = containerHRef.current;
    const ctH = contentHRef.current;
    if (cH > 0 && ctH > cH) {
      setIndicatorH(Math.max(30, (cH / ctH) * cH));
    } else {
      setIndicatorH(0);
    }
  }, []);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        containerHRef.current = e.nativeEvent.layout.height;
        recalcIndicator();
      }}
    >
      <ScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        onContentSizeChange={(_, h) => {
          contentHRef.current = h;
          recalcIndicator();
        }}
        onScrollEndDrag={(e) => {
          showAndUpdate(e.nativeEvent.contentOffset.y);
          scheduleHide();
        }}
        onMomentumScrollEnd={(e) => {
          showAndUpdate(e.nativeEvent.contentOffset.y);
          scheduleHide();
        }}
        {...rest}
      >
        {children}
      </ScrollView>
      {indicatorH > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 3,
            top: 0,
            width: 3,
            height: indicatorH,
            backgroundColor: 'rgba(0,0,0,0.22)',
            borderRadius: 1.5,
            opacity: opacityAnim,
            transform: [{ translateY: indicatorTranslateAnim }],
          }}
        />
      )}
    </View>
  );
}
