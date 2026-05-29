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
import { AppIcon } from './AppIcon';

/** 아이템 1개 높이 */
const ITEM_HEIGHT = 44;
/** 아이템 사이 간격 */
const ITEM_GAP = 8;
/** 스냅 단위 = 아이템 높이 + 간격 */
const ITEM_STEP = ITEM_HEIGHT + ITEM_GAP;
/** 화면에 보이는 아이템 수 (홀수여야 중앙 강조 가능) */
const VISIBLE_ITEMS = 3;

type WheelPickerProps = {
  items: string[];
  onSelect: (index: number) => void;
  initialIndex?: number;
};

function WheelPicker({ items, onSelect, initialIndex = 0 }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // 위아래에 빈 패딩 아이템 추가 (중앙 정렬용)
  const paddedItems = ['', ...items, ''];

  const handleScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_STEP);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    setSelectedIndex(clamped);
    onSelect(clamped);
    scrollRef.current?.scrollTo({ y: clamped * ITEM_STEP, animated: true });
  };

  return (
    <View style={pickerStyles.wrapper}>
      {/* 가운데 선택 강조 배경 */}
      <View style={pickerStyles.highlight} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        style={pickerStyles.scroll}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_STEP}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentOffset={{ x: 0, y: initialIndex * ITEM_STEP }}
        scrollEventThrottle={16}
      >
        {paddedItems.map((item, i) => {
          const realIndex = i - 1;
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
    width: 95,
    height: ITEM_STEP * VISIBLE_ITEMS - ITEM_GAP,
    overflow: 'hidden',
    position: 'relative',
  },
  // 선택된 줄 강조 배경 (정중앙에 위치)
  highlight: {
    position: 'absolute',
    top: ITEM_STEP * 1,
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
    marginBottom: ITEM_GAP,
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
  showRandomOption?: boolean;
};

export default function TimePickerBottomSheet({
  visible,
  onClose,
  onConfirm,
  showRandomOption = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const getNowTime = () => {
    const now = new Date();
    const h24 = now.getHours();
    const pm = h24 >= 12 ? 1 : 0;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return { meridiem: pm, hour: h12 - 1, minute: now.getMinutes() };
  };

  const [meridiem, setMeridiem] = useState(getNowTime().meridiem);
  const [hour, setHour] = useState(getNowTime().hour);
  const [minute, setMinute] = useState(getNowTime().minute);
  const [isRandom, setIsRandom] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      const t = getNowTime();
      setMeridiem(t.meridiem);
      setHour(t.hour);
      setMinute(t.minute);
      setIsRandom(false);
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
    if (isRandom) {
      onConfirm('랜덤');
    } else {
      const timeStr = `${MERIDIEM[meridiem]} ${HOURS[hour]}:${MINUTES[minute]}`;
      onConfirm(timeStr);
    }
  }, [isRandom, meridiem, hour, minute, onConfirm]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* 피그마 Frame 2147227859: padding 14px 20px, gap 24px, alignItems center */}
          <View style={styles.sheetContent}>
            {/* 핸들 */}
            <View style={styles.handle} />

            {/* 피그마 Frame 2147227858: 타이틀+피커 포함, gap 24 */}
            <View style={styles.innerFrame}>
              <View style={styles.titleAndPicker}>
                <Text style={styles.title}>시간을 선택해 주세요</Text>

                {/* 피커: row, gap 20 */}
                <View 
                  style={[styles.pickerArea, isRandom && { opacity: 0.5 }]}
                  pointerEvents={isRandom ? 'none' : 'auto'}
                >
                  <WheelPicker items={MERIDIEM} onSelect={setMeridiem} initialIndex={meridiem} />
                  <WheelPicker items={HOURS} onSelect={setHour} initialIndex={hour} />
                  <WheelPicker items={MINUTES} onSelect={setMinute} initialIndex={minute} />
                </View>
              </View>

              {showRandomOption && (
                <>
                  <View style={styles.divider} />

                  <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={() => setIsRandom(!isRandom)} 
                    activeOpacity={0.7}
                  >
                    <AppIcon name={isRandom ? 'checkbox-m-on' : 'checkbox-m-off'} size={20} />
                    <Text style={styles.checkboxText}>랜덤 시간으로 설정</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* 피그마 Bottom_Fill: padding 16px 전체, safe area 포함 */}
          <View style={[styles.bottomFill, { paddingBottom: Math.max(16, insets.bottom) }]}>
            <TouchableOpacity style={styles.ctaButton} onPress={handleConfirm}>
              <Text style={styles.ctaButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
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
  // 피그마: borderRadius 20 20 0 0, Brown 100
  sheet: {
    backgroundColor: theme.colors.brown100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // 피그마 Frame 2147227859: padding 14px 20px, gap 24px, alignItems center
  sheetContent: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 24,
  },
  // 핸들: width 78, height 5, Brown/200
  handle: {
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.brown200,
  },
  // 피그마 Frame_6ZYRN0: 타이틀+피커 포함, gap 24
  innerFrame: {
    alignSelf: 'stretch',
    gap: 24,
  },
  titleAndPicker: {
    alignSelf: 'stretch',
    gap: 20,
  },
  // 타이틀: alignSelf flex-start
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: theme.colors.black,
  },
  // 피커: row, fill 높이, gap 20, justifyContent center
  pickerArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  // 피그마 Bottom_Fill: padding 16px
  bottomFill: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // CTA btn_L: height 56, Gray/900, borderRadius 12
  ctaButton: {
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    ...theme.typography.bodyXL_SB,
    color: theme.colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.brown200,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkboxText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: theme.colors.brown900,
  },
});
