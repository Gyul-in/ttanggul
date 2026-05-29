import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppText } from '../components/AppText';
import HomeCard, { HomeCardType } from '../components/HomeCard';
import { useUserStore } from '../store/useUserStore';
import { useUI } from '../context/UIContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: { params?: { category?: string; text?: string } };
};

const DAILY_LIMIT = 3;

// 폭죽을 구성할 입자 데이터 생성 함수
const createParticles = () => {
  // 따뜻하고 세련된 카드 테마 브라운/골드 컬러 팔레트
  const colorsList = ['#B48A5B', '#D3BF9E', '#EDE2CE', '#8C6239', '#5C3A21', '#E6C594', '#C5A880'];
  return Array.from({ length: 45 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2; // 사방 360도 무작위 각도
    const distance = 120 + Math.random() * 220; // 더 시원하게 퍼져나갈 거리 (120 ~ 340)
    return {
      id: i,
      color: colorsList[Math.floor(Math.random() * colorsList.length)],
      width: 6 + Math.random() * 8, // 너비 6 ~ 14
      height: 10 + Math.random() * 8, // 높이 10 ~ 18 (직사각형 입자가 회전할 때 프리미엄 느낌 극대화)
      angle,
      distance,
      peakY: -(80 + Math.random() * 170), // 위로 더 시원하게 솟구치는 높이 (-80 ~ -250)
      dropY: 240 + Math.random() * 260, // 화면 아래쪽까지 시원하게 낙하 (240 ~ 500)
      rotationSpeed: 2 + Math.random() * 5, // 회전 수 (2 ~ 7 바퀴)
      anim: new Animated.Value(0),
      delay: Math.random() * 70, // 우아한 순차적 흩날림을 위한 개별 지연시간 (0 ~ 70ms)
    };
  });
};

const CATEGORY_TEXTS: Record<string, string> = {
  '공감': '나만 이렇게 힘든 게 아니라는 걸 알면서도 가끔은 내 감정이 제일 무거워.',
  '위로': '지금 이 순간도 충분히 잘 하고 있어요. 조금 쉬어가도 괜찮습니다.',
  '명언': '성공은 포기하지 않은 사람들에게 돌아갑니다.',
  '현실조언': '실패 경험은 면접에서 오히려 강점입니다. 어떻게 극복했는지가 핵심입니다.',
  '동기부여': '오늘 하루도 한 걸음씩. 작은 진전이 큰 변화를 만듭니다.',
};

export default function CardPickResultScreen({ navigation, route }: Props) {
  const category = route.params?.category ?? '현실조언';
  const cardText = CATEGORY_TEXTS[category] ?? CATEGORY_TEXTS['현실조언'];
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const particles = useRef(createParticles()).current;

  const { setTabBarVisible } = useUI();

  const triggerConfetti = useCallback(() => {
    particles.forEach((p) => {
      p.anim.setValue(0);
      Animated.timing(p.anim, {
        toValue: 1,
        duration: 1300 + Math.random() * 400, // 1.3초 ~ 1.7초 동안 우아하고 부드럽게 진행
        delay: p.delay,
        easing: Easing.out(Easing.cubic), // 부드럽게 펼쳐졌다가 하강
        useNativeDriver: true,
      }).start();
    });
  }, [particles]);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);

      // 카드 진입 애니메이션 (우아하고 고급스러운 스피드로 쫀득하게 팝업)
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,   // 안정적이고 쫀득한 탄성
        tension: 50,   // 속도 강도를 50으로 살짝 낮추어 차분하고 예쁜 '띨롱' 효과
        useNativeDriver: true,
      }).start();

      // 갈색 폭죽 동시 가동!
      triggerConfetti();
    }, [setTabBarVisible, scaleAnim, triggerConfetti])
  );

  const getParticleStyle = useCallback((p: typeof particles[0]) => {
    const translateX = p.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.cos(p.angle) * p.distance],
    });

    const translateY = p.anim.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, p.peakY, p.dropY],
    });

    const rotate = p.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${p.rotationSpeed * 360}deg`],
    });

    const opacity = p.anim.interpolate({
      inputRange: [0, 0.1, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });

    const scale = p.anim.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 1.2, 0.4],
    });

    return {
      position: 'absolute' as const,
      left: '50%' as const,
      top: '50%' as const,
      marginLeft: -p.width / 2,
      marginTop: -p.height / 2,
      width: p.width,
      height: p.height,
      backgroundColor: p.color,
      borderRadius: Math.random() > 0.5 ? 2 : 0,
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      opacity,
      zIndex: -1, // 카드 뒤에 렌더링되도록 보장
    };
  }, [particles]);

  const cardPickCount = useUserStore((s) => s.cardPickCount);
  const cardPickDate = useUserStore((s) => s.cardPickDate);
  const today = new Date().toDateString();
  const usedToday = cardPickDate === today ? cardPickCount : 0;
  const remaining = DAILY_LIMIT - usedToday;

  return (
    <View style={styles.container}>
      <NavigationBar
        type="default"
        title=""
        onBack={() => navigation.navigate('HomeMain')}
      />

      <View style={styles.body}>
        
        {/* Header Section */}
        <View style={styles.titleBlock}>
          <AppText variant="sectionTitle" color="gray900" style={styles.titleText}>
            오늘의 행운 카드를 뽑았어요!
          </AppText>
          <AppText variant="bodyXL_M" color="gray600" style={styles.subtitleText}>
            오늘 하루 동안 홈 화면에 예쁘게 걸어둘게요
          </AppText>
        </View>

        {/* Card Section */}
        <View style={styles.cardSection}>
          {/* 남은 횟수 태그 */}
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <AppText variant="tag" style={styles.tagText}>
                남은 횟수 {remaining}/{DAILY_LIMIT}
              </AppText>
            </View>
          </View>

          {/* 폭죽 애니메이션 입자들 (카드 뒷배경 절대좌표 레이어) */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {particles.map((p) => (
              <Animated.View key={p.id} style={getParticleStyle(p)} />
            ))}
          </View>

          {/* Home Card with Spring entry animation */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <HomeCard
              type={category as HomeCardType}
              category={category}
              text={cardText}
              btn={false}
            />
          </Animated.View>
        </View>

      </View>

      {/* Bottom CTA Button */}
      <View style={[
        styles.bottomArea,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <AppText variant="bodyXL_SB" color="white">
            다시 뽑기
          </AppText>
        </Pressable>
      </View>
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
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 50, // Figma body gap 50
  },
  titleBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 2, // Figma title block gap 2
  },
  titleText: {
    textAlign: 'center',
    width: 362,
  },
  subtitleText: {
    textAlign: 'center',
    width: 362,
  },
  cardSection: {
    alignItems: 'center',
    gap: 30, // Figma card section gap 30
  },
  tagWrapper: {
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.brown300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: colors.white,
    letterSpacing: -0.3,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.bgMain,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
});
