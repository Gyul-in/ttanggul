import { useState, useCallback, useRef } from 'react';
import { View, Image, Pressable, StyleSheet, useWindowDimensions, Modal, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppText } from '../components/AppText';
import { useUI } from '../context/UIContext';
import { useUserStore } from '../store/useUserStore';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const DAILY_LIMIT = 3;

// 피그마와 동일: D C D / C D C (두듀-클로버 교차)
const CARDS = [
  { type: 'dudue' as const },
  { type: 'clover' as const },
  { type: 'dudue' as const },
  { type: 'clover' as const },
  { type: 'dudue' as const },
  { type: 'clover' as const },
];

const DUDUE_IMAGES: Record<string, ReturnType<typeof require>> = {
  공감: require('../assets/illustrations/save-dudue-gongam.png'),
  위로: require('../assets/illustrations/save-dudue-wiro.png'),
  명언: require('../assets/illustrations/save-dudue-myungon.png'),
  동기부여: require('../assets/illustrations/save-dudue-donggi.png'),
  현실조언: require('../assets/illustrations/save-dudue-hyunsil.png'),
};
const CLOVER_IMG = require('../assets/illustrations/card-pick-clover.png');
const INFO_DUDUE_IMG = require('../assets/illustrations/card-pick-info-dudue.png');

// PNG 2048×2048 기준, 캐릭터 중심의 PNG 중심(1024,1024)으로부터의 오프셋 (실측값)
const DUDUE_OFFSETS: Record<string, { dx: number; dy: number }> = {
  공감:    { dx: -132, dy:  70 },
  위로:    { dx:  130, dy: -10 },
  명언:    { dx:  -40, dy:  30 },
  동기부여: { dx: -136, dy:  86 },
  현실조언: { dx:  -92, dy: -20 },
};

function getDudueImage(preferredCategory: string | null) {
  if (!preferredCategory) return require('../assets/illustrations/card-pick-dudue.png');
  const key = preferredCategory.replace(/^#/, '');
  return DUDUE_IMAGES[key] ?? require('../assets/illustrations/card-pick-dudue.png');
}

function getDudueTransform(preferredCategory: string | null, size: number) {
  const key = preferredCategory ? preferredCategory.replace(/^#/, '') : null;
  const { dx, dy } = (key && DUDUE_OFFSETS[key]) ? DUDUE_OFFSETS[key] : { dx: -136, dy: 86 };
  return [
    { translateX: Math.round(-dx * size / 2048) },
    { translateY: Math.round(-dy * size / 2048) },
  ];
}

export default function CardPickScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = width / 402;

  const { setTabBarVisible } = useUI();
  const preferredCategory = useUserStore((s) => s.preferredCategory);
  const cardPickCount = useUserStore((s) => s.cardPickCount);
  const cardPickDate = useUserStore((s) => s.cardPickDate);
  const useCardPick = useUserStore((s) => s.useCardPick);
  const dudueImg = getDudueImage(preferredCategory);

  const today = new Date().toDateString();
  const usedToday = cardPickDate === today ? cardPickCount : 0;
  const remaining = DAILY_LIMIT - usedToday;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const triggerToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
    }, [setTabBarVisible])
  );

  const cardW      = Math.round(114 * scale);
  const cardH      = Math.round(160 * scale);
  const cardRadius = Math.round(16 * scale);
  const cardGap    = Math.round(10 * scale);
  const dudueSize  = Math.round(100 * scale);
  const cloverW    = Math.round(82 * scale);
  const cloverH    = Math.round(100 * scale);


  return (
    <View style={styles.container}>
      <NavigationBar
        type="default"
        title=""
        onBack={() => navigation.goBack()}
        rightIcon="info-circle-contained"
        rightIconColor="#A8ACA8"
        onRight={() => setShowInfo(true)}
      />

      {/* Body */}
      <View style={[
        styles.body,
        {
          paddingTop: Math.round(10 * scale),
          paddingHorizontal: Math.round(20 * scale),
          gap: Math.round(50 * scale),
        },
      ]}>
        {/* 타이틀 — 피그마: text-center, w-full */}
        <View style={[styles.titleBlock, { gap: Math.round(2 * scale) }]}>
          <AppText variant="sectionTitle" color="gray900" style={styles.titleText}>
            어떤 이야기가 듣고 싶나요?
          </AppText>
          <AppText variant="bodyXL_M" color="gray600" style={styles.subtitleText}>
            지금 가장 마음이 가는 카드를 골라주세요
          </AppText>
        </View>

        {/* 그리드 + 태그 */}
        <View style={[styles.gridSection, { gap: Math.round(30 * scale) }]}>
          {/* 남은 횟수 태그 — 피그마: 카드 위 */}
          <View style={styles.tagWrapper}>
            <View style={[
              styles.tag,
              {
                paddingHorizontal: Math.round(12 * scale),
                paddingVertical: Math.round(4 * scale),
                borderRadius: Math.round(8 * scale),
              },
            ]}>
              <AppText variant="bodyMS_SB" style={styles.tagText}>
                남은 횟수 {remaining}/{DAILY_LIMIT}
              </AppText>
            </View>
          </View>

          {/* 카드 행 */}
          <View style={{ gap: cardGap }}>
            {[0, 1].map(rowIdx => {
              const rowSelected = selectedIdx !== null && Math.floor(selectedIdx / 3) === rowIdx;
              return (
                <View key={rowIdx} style={[styles.row, { gap: cardGap, zIndex: rowSelected ? 1 : 0 }]}>
                  {[0, 1, 2].map(colIdx => {
                    const idx = rowIdx * 3 + colIdx;
                    const card = CARDS[idx];
                    const isSelected = selectedIdx === idx;
                    const isClover = card.type === 'clover';

                    return (
                      <Pressable
                        key={idx}
                        onPress={() => setSelectedIdx(isSelected ? null : idx)}
                        style={[
                          styles.card,
                          {
                            width: cardW,
                            height: cardH,
                            borderRadius: cardRadius,
                            ...(isSelected && {
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 0 },
                              shadowRadius: Math.round(10.4 * scale),
                              shadowOpacity: 0.25,
                              elevation: 8,
                              zIndex: 1,
                            }),
                          },
                        ]}
                      >
                        <View style={{
                          position: 'absolute',
                          width: cardW,
                          height: cardH,
                          borderRadius: cardRadius,
                          backgroundColor: isSelected ? '#D3BF9E' : '#EDE2CE',
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: '#B48A5B',
                          overflow: 'hidden',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {isClover ? (
                            <Image
                              source={CLOVER_IMG}
                              style={{ width: cloverW, height: cloverH }}
                              resizeMode="contain"
                            />
                          ) : (
                            <Image
                              source={dudueImg}
                              style={{
                                width: dudueSize,
                                height: dudueSize,
                                transform: getDudueTransform(preferredCategory, dudueSize),
                              }}
                              resizeMode="contain"
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>

        </View>
      </View>

      {/* 토스트 슬롯 — 버튼 위, 카드 선택 시 레이아웃 공간 확보 */}
      {selectedIdx !== null && (
        <View
          pointerEvents="none"
          style={[styles.toastSlot, {
            paddingHorizontal: Math.round(10 * scale),
            paddingVertical: Math.round(20 * scale),
          }]}
        >
          <Animated.View style={[styles.toastPill, {
            opacity: toastOpacity,
            paddingHorizontal: Math.round(24 * scale),
            paddingVertical: Math.round(12 * scale),
          }]}>
            <AppText variant="bodyM_SB" color="white">하루 뽑기를 다 사용했어요</AppText>
          </Animated.View>
        </View>
      )}
      {/* 선택 후에만 나타나는 결과보기 버튼 */}
      {selectedIdx !== null && (
        <View style={[
          styles.bottomArea,
          { paddingBottom: Math.max(insets.bottom, Math.round(16 * scale)) },
        ]}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              {
                borderRadius: Math.round(12 * scale),
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => {
                if (remaining === 0) {
                  triggerToast();
                } else {
                  useCardPick();
                  setSelectedIdx(null);
                  navigation.navigate('CardPickResult');
                }
              }}
          >
            <AppText variant="bodyXL_SB" color="white">결과보기</AppText>
          </Pressable>
        </View>
      )}
      {/* 안내 모달 */}
      <Modal visible={showInfo} transparent statusBarTranslucent animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowInfo(false)}>
          <View style={[StyleSheet.absoluteFillObject, styles.dim]} pointerEvents="none" />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{
              backgroundColor: colors.bgMain,
              width: Math.round(337 * scale),
              borderRadius: Math.round(16 * scale),
              paddingHorizontal: Math.round(20 * scale),
              paddingTop: Math.round(24 * scale),
              paddingBottom: Math.round(20 * scale),
              gap: Math.round(28 * scale),
            }}
            onPress={() => {}}
          >
            {/* 이미지 + 텍스트 */}
            <View style={{ alignItems: 'center', gap: Math.round(25 * scale) }}>
              <Image
                source={INFO_DUDUE_IMG}
                style={{ width: Math.round(117 * scale), height: Math.round(98 * scale) }}
                resizeMode="contain"
              />
              <View style={{ width: '100%', gap: Math.round(8 * scale) }}>
                <AppText variant="subTitle" color="black" style={{ textAlign: 'center' }}>
                  행운 카드 뽑기 안내
                </AppText>
                <View style={{ gap: 0 }}>
                  {[
                    { pre: '매일 ', bold: '최대 3번', post: '까지 새로운 카드를 뽑을 수 있어요', hasBold: true },
                    { pre: '카드를 뽑으면 오늘 ', bold: '하루 동안', post: ' 홈 화면에 고정돼요', hasBold: true },
                    { pre: '매일 자정(24:00)이 되면 뽑기 기회가 새롭게 초기화돼요', bold: '', post: '', hasBold: false },
                  ].map(({ pre, bold, post, hasBold }, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <View style={{ width: Math.round(20 * scale), height: Math.round(20 * scale), alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: Math.round(3 * scale), height: Math.round(3 * scale), borderRadius: 2, backgroundColor: '#6A6F6B' }} />
                      </View>
                      <AppText variant="bodyS_M" color="gray600" style={{ flex: 1, lineHeight: 24 }}>
                        {hasBold
                          ? <>{pre}<AppText variant="bodyS_SB" style={{ color: '#393b38' }}>{bold}</AppText>{post}</>
                          : pre}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            {/* 확인 버튼 */}
            <Pressable
              style={{
                height: Math.round(56 * scale),
                backgroundColor: colors.gray900,
                borderRadius: Math.round(12 * scale),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setShowInfo(false)}
            >
              <AppText variant="bodyXL_SB" color="white">확인</AppText>
            </Pressable>
          </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  body: {
    flex: 1,
  },
  titleBlock: {
    alignSelf: 'stretch',
  },
  titleText: {
    letterSpacing: -0.24,
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
  },
  gridSection: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagWrapper: {
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#D3BF9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: colors.white,
    letterSpacing: -0.3,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ctaBtn: {
    height: 56,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModal: {
    backgroundColor: colors.bgMain,
    width: 337,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 28,
  },
  infoContent: {
    alignItems: 'center',
    gap: 25,
  },
  infoTitle: {
    textAlign: 'center',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    lineHeight: 22,
  },
  infoBtn: {
    height: 56,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastSlot: {
    alignItems: 'center',
  },
  toastPill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
  },
});
