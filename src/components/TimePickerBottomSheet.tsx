import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { theme } from '../theme';

/** 아이템 1개 높이 */
const ITEM_HEIGHT = 44;
/** 화면에 보이는 아이템 수 (홀수여야 중앙 강조 가능) */
const VISIBLE_ITEMS = 5;

type WheelPickerProps = {
  items: string[];
  onSelect: (index: number) => void;
  initialIndex?: number;
};

function WheelPicker({ items, onSelect, initialIndex = 0 }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // 위아래에 빈 패딩 아이템 추가 (중앙 정렬용)
  const paddedItems = ['', '', ...items, '', ''];

  const handleScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    setSelectedIndex(clamped);
    onSelect(clamped);
    // 정확한 위치로 스냅
    scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={pickerStyles.wrapper}>
      {/* 가운데 선택 강조 배경 */}
      <View style={pickerStyles.highlight} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        style={pickerStyles.scroll}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
        scrollEventThrottle={16}
      >
        {paddedItems.map((item, i) => {
          const realIndex = i - 2;
          const isSelected = realIndex === selectedIndex;
          return (
            <View key={i} style={pickerStyles.item}>
              <Text
                style={[
                  pickerStyles.itemText,
                  isSelected ? pickerStyles.selectedText : pickerStyles.dimText,
                ]}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
  // 선택된 줄 강조 배경 (정중앙에 위치)
  highlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2, // 0,1은 빈 패딩 → 2번째가 중앙
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.brown200,
    borderRadius: 8,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
    zIndex: 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    zIndex: 2,
  },
  selectedText: {
    color: '#8B6143', // Brown/700
    fontFamily: 'Pretendard-SemiBold',
  },
  dimText: {
    color: '#D3BF9E', // Brown/400
    fontFamily: 'Pretendard-Medium',
  },
});

// ─── 피커 데이터 ─────────────────────────────────────────
const MERIDIEM = ['AM', 'PM'];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
};

export default function TimePickerBottomSheet({ visible, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [meridiem, setMeridiem] = useState(0); // 0=AM, 1=PM
  const [hour, setHour] = useState(10);         // 기본 11시 (0-based → index 10)
  const [minute, setMinute] = useState(0);      // 기본 00분

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleConfirm = useCallback(() => {
    const timeStr = `${MERIDIEM[meridiem]} ${HOURS[hour]}:${MINUTES[minute]}`;
    onConfirm(timeStr);
  }, [meridiem, hour, minute, onConfirm]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* 전체를 감싸는 컨테이너: 딤 + 바텀시트를 아래로 정렬 */}
      <View style={styles.overlay}>
        {/* 딤 배경 - 누르면 닫힘 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* 바텀 시트 본체 */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* 핸들 */}
          <View style={styles.handle} />

          {/* 타이틀 */}
          <Text style={styles.title}>알림 시간을 선택해 주세요</Text>

          {/* 휠 피커 3개 */}
          <View style={styles.pickerRow}>
            <WheelPicker items={MERIDIEM} onSelect={setMeridiem} initialIndex={meridiem} />
            <WheelPicker items={HOURS} onSelect={setHour} initialIndex={hour} />
            <WheelPicker items={MINUTES} onSelect={setMinute} initialIndex={minute} />
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity style={styles.ctaButton} onPress={handleConfirm}>
            <Text style={styles.ctaButtonText}>변경하기</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: theme.colors.brown100,
    // 피그마: borderRadius 20px 20px 0 0
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  // 피그마: width 78, height 5, borderRadius 999, Brown/200
  handle: {
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.brown200,
  },
  // 피그마: Header/Sub Title — SemiBold 20px, lineHeight 150%
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: theme.colors.black,
    alignSelf: 'flex-start',
    marginTop: 24, // handle과 title 사이 gap
  },
  // 피그마: row, gap: 20px
  pickerRow: {
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'stretch',
    marginTop: 24, // title과 pickerRow 사이 gap
  },
  // 피그마: CTA btn_L — height 56, Gray/900, borderRadius 12
  ctaButton: {
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24, // pickerRow와 ctaButton 사이 gap
  },
  ctaButtonText: {
    ...theme.typography.bodyXL_SB,
    color: theme.colors.white,
  },
});
