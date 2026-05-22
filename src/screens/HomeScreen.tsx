import { View, Image, Pressable, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import HomeCard, { HomeCardType } from '../components/HomeCard';
import { useEffect, useState, useRef } from 'react';
import { useSave } from '../context/SaveContext';
import CloverModal from '../components/CloverModal';
import { useUserStore } from '../store/useUserStore';

const CURRENT_CARD = {
  id: 'card-001',
  text: '실패 경험은 면접에서 오히려 강점입니다. 어떻게 극복했는지가 핵심입니다.',
};

// 온보딩 선택값(#공감 등) → HomeCardType 매핑
function toCardType(category: string | null): HomeCardType {
  const map: Record<string, HomeCardType> = {
    '#공감': '공감',
    '#위로': '위로',
    '#명언': '명언',
    '#현실조언': '현실조언',
    '#동기부여': '위로',
  };
  return (category && map[category]) ?? '현실조언';
}

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function CardIcon() {
  return (
    <View style={cardIconStyles.wrap}>
      <View style={[cardIconStyles.card, cardIconStyles.cardBack]} />
      <View style={[cardIconStyles.card, cardIconStyles.cardFront]} />
    </View>
  );
}

const cardIconStyles = StyleSheet.create({
  wrap: { width: 24, height: 24 },
  card: {
    position: 'absolute',
    width: 13,
    height: 19,
    borderRadius: 3,
  },
  cardBack: {
    backgroundColor: colors.brown300,
    left: 1,
    top: 2,
    transform: [{ rotate: '-16.73deg' }],
  },
  cardFront: {
    backgroundColor: colors.brown200,
    left: 8,
    top: 1,
    transform: [{ rotate: '4.19deg' }],
  },
});

export default function HomeScreen({ navigation }: Props) {
  const { toggleSave, isSaved } = useSave();
  const saved = isSaved(CURRENT_CARD.id);
  const clovers = useUserStore((state) => state.clovers);
  const addClover = useUserStore((state) => state.addClover);
  const lastCloverReceivedDate = useUserStore((state) => state.lastCloverReceivedDate);
  const setLastCloverReceivedDate = useUserStore((state) => state.setLastCloverReceivedDate);
  const hasUnreadNotification = useUserStore((state) => state.hasUnreadNotification);
  const setUnreadNotification = useUserStore((state) => state.setUnreadNotification);

  const preferredCategory = useUserStore((state) => state.preferredCategory);
  const cardType = toCardType(preferredCategory);
  const cardPickCount = useUserStore((state) => state.cardPickCount);
  const dotCount = Math.min(Math.max(cardPickCount, 1), 4);

  const [showCloverModal, setShowCloverModal] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    const toValue = flipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setFlipped(prev => !prev));
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastCloverReceivedDate !== today) {
      setShowCloverModal(true);
    }
  }, [lastCloverReceivedDate]);

  const handleReceiveClover = () => {
    addClover();
    setLastCloverReceivedDate(new Date().toDateString());
    setShowCloverModal(false);
  };

  const showToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleToggleSave = () => {
    const isSaving = !saved;
    const category = preferredCategory?.replace('#', '') ?? '현실조언';
    toggleSave({ ...CURRENT_CARD, category });
    if (isSaving) showToast();
  };

  return (
    <View style={styles.container}>
      <NavigationBar
        type="logo"
        pointCount={clovers}
        onBell={() => {
          setUnreadNotification(false);
          navigation.navigate('Notification');
        }}
        onClover={() => navigation.getParent()?.getParent()?.navigate('Clover' as never)}
        hasNotification={hasUnreadNotification}
      />

      <View style={styles.body}>

        {/* 배너: 카드 더 뽑기 */}
        <Pressable style={styles.banner} onPress={() => navigation.navigate('CardPick')}>
          <View style={styles.bannerLeft}>
            <CardIcon />
            <AppText variant="bodyM_M" style={styles.bannerText}>카드를 더 뽑아보세요</AppText>
          </View>
          <AppIcon name="chevron-right" size={24} color={colors.brown800} />
        </Pressable>

        {/* 카드 + 인디케이터 */}
        <View style={styles.contents}>
          {/* 앞면 */}
          <Animated.View style={[styles.cardFace, { transform: [{ rotateY: frontRotate }] }]}
            pointerEvents={flipped ? 'none' : 'auto'}>
            <HomeCard
              type={cardType}
              text={CURRENT_CARD.text}
              category={preferredCategory?.replace('#', '') ?? '현실조언'}
              liked={saved}
              onFlip={handleFlip}
              onLike={handleToggleSave}
              onShare={() => {}}
            />
          </Animated.View>
          {/* 뒷면 */}
          <Animated.View style={[styles.cardFace, styles.cardFaceBack, { transform: [{ rotateY: backRotate }] }]}
            pointerEvents={flipped ? 'auto' : 'none'}>
            <HomeCard
              type="Back"
              text={CURRENT_CARD.text}
              category={preferredCategory?.replace('#', '') ?? '현실조언'}
              liked={saved}
              onFlip={handleFlip}
              onLike={handleToggleSave}
              onShare={() => {}}
            />
          </Animated.View>

          {/* 도트 인디케이터: 뽑은 카드 수만큼 표시 (최대 4개) */}
          {dotCount > 1 && (() => {
            const dotCx = Array.from({ length: dotCount }, (_, i) => 3 + i * 16);
            const svgW = 6 + (dotCount - 1) * 16;
            return (
              <Svg width={svgW} height={6} viewBox={`0 0 ${svgW} 6`}>
                {dotCx.map((cx, i) => (
                  <Circle key={i} cx={cx} cy={3} r={3}
                    fill={i === 0 ? colors.brown600 : colors.bgInput} />
                ))}
              </Svg>
            );
          })()}
        </View>

        {/* 하단 두듀 캐릭터 */}
        <View style={styles.dudueSection}>
          <Image
            source={require('../assets/illustrations/home-dudue-peek.png')}
            style={styles.dudueImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 저장 토스트 - 보관함 삭제 토스트와 동일한 위치 */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <AppIcon name="check" size={24} color={colors.white} />
        <AppText variant="bodyM_SB" style={styles.toastText}>
          '{preferredCategory?.replace('#', '') ?? '현실조언'}' 보관함에 저장했어요
        </AppText>
      </Animated.View>

      <CloverModal
        visible={showCloverModal}
        onReceive={handleReceiveClover}
      />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
    alignItems: 'center',
  },
  banner: {
    alignSelf: 'stretch',
    backgroundColor: colors.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  bannerText: {
    color: colors.brown800,
    flex: 1,
  },
  contents: {
    alignItems: 'center',
    gap: 20,
  },
  cardFace: {
    width: 300,
    height: 348,
    backfaceVisibility: 'hidden',
  },
  cardFaceBack: {
    position: 'absolute',
    top: 0,
  },
  dudueSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dudueImage: {
    width: 136,
    height: 94,
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  toastText: {
    color: colors.white,
  },
});
