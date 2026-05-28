import { View, ScrollView, Image, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import HomeCard, { HomeCardType } from '../components/HomeCard';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSave } from '../context/SaveContext';
import CloverModal from '../components/CloverModal';
import { useUserStore, PickedCard } from '../store/useUserStore';
import { useFocusEffect } from '@react-navigation/native';
import { useUI } from '../context/UIContext';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 348;
const CARD_GAP = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const DEFAULT_TEXT = '실패 경험은 면접에서 오히려 강점입니다. 어떻게 극복했는지가 핵심입니다.';

function toCardType(category: string): HomeCardType {
  const map: Record<string, HomeCardType> = {
    '공감': '공감', '위로': '위로', '명언': '명언', '현실조언': '현실조언', '동기부여': '동기부여',
  };
  return map[category] ?? '현실조언';
}

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
  card: { position: 'absolute', width: 13, height: 19, borderRadius: 3 },
  cardBack: { backgroundColor: colors.brown300, left: 1, top: 2, transform: [{ rotate: '-16.73deg' }] },
  cardFront: { backgroundColor: colors.brown200, left: 8, top: 1, transform: [{ rotate: '4.19deg' }] },
});

type FlippableCardProps = {
  card: PickedCard;
  isSaved: boolean;
  onToggleSave: () => void;
  onSaveToast: (category: string) => void;
};

function FlippableCard({ card, isSaved, onToggleSave, onSaveToast }: FlippableCardProps) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const frontRef = useRef<any>(null);
  const backRef = useRef<any>(null);
  const shareFrontRef = useRef<any>(null);
  const shareBackRef = useRef<any>(null);
  const cardType = toCardType(card.category);

  const handleFlip = () => {
    const toValue = flipped ? 0 : 1;
    Animated.timing(flipAnim, { toValue, duration: 350, useNativeDriver: true })
      .start(() => setFlipped(v => !v));
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const handleShare = async () => {
    try {
      const ref = flipped ? shareBackRef : shareFrontRef;
      if (!ref.current) return;
      const uri = await captureRef(ref, { format: 'png', quality: 1.0 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '땅굴 행운 카드 공유', UTI: 'public.png' });
      }
    } catch {}
  };

  const handleLike = () => {
    const willSave = !isSaved;
    onToggleSave();
    if (willSave) onSaveToast(card.category);
  };

  return (
    <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      {/* 캡처 전용 카드 (버튼 없음, 투명) */}
      <View style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }} pointerEvents="none">
        <HomeCard ref={shareFrontRef} type={cardType} text={card.text} category={card.category} btn={false} send={false} />
      </View>
      <View style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }} pointerEvents="none">
        <HomeCard ref={shareBackRef} type="Back" text={card.text} category={card.category} btn={false} send={false} />
      </View>

      <Animated.View
        style={[styles.cardFace, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }], opacity: frontOpacity }]}
        pointerEvents={flipped ? 'none' : 'auto'}
      >
        <HomeCard
          ref={frontRef}
          type={cardType}
          text={card.text}
          category={card.category}
          liked={isSaved}
          onFlip={handleFlip}
          onLike={handleLike}
          onShare={handleShare}
        />
      </Animated.View>
      <Animated.View
        style={[styles.cardFace, { transform: [{ perspective: 1000 }, { rotateY: backRotate }], opacity: backOpacity }]}
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        <HomeCard
          ref={backRef}
          type="Back"
          text={card.text}
          category={card.category}
          liked={isSaved}
          onFlip={handleFlip}
          onLike={handleLike}
        />
      </Animated.View>
    </View>
  );
}

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const { toggleSave, isSaved } = useSave();
  const { setTabBarVisible } = useUI();

  useFocusEffect(useCallback(() => {
    setTabBarVisible(true);
    setActiveIndex(0);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [setTabBarVisible]));

  const clovers = useUserStore(s => s.clovers);
  const addClover = useUserStore(s => s.addClover);
  const lastCloverReceivedDate = useUserStore(s => s.lastCloverReceivedDate);
  const setLastCloverReceivedDate = useUserStore(s => s.setLastCloverReceivedDate);
  const hasUnreadNotification = useUserStore(s => s.hasUnreadNotification);
  const setUnreadNotification = useUserStore(s => s.setUnreadNotification);
  const preferredCategory = useUserStore(s => s.preferredCategory);
  const pickedCards = useUserStore(s => s.pickedCards);
  const cardPickDate = useUserStore(s => s.cardPickDate);

  const today = new Date().toDateString();
  const todayCards = cardPickDate === today ? pickedCards : [];
  const defaultCategory = preferredCategory?.replace('#', '') ?? '현실조언';
  const defaultCard: PickedCard = { id: 'default', category: defaultCategory, text: DEFAULT_TEXT };
  const cardsToShow: PickedCard[] = [defaultCard, ...todayCards];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showCloverModal, setShowCloverModal] = useState(false);
  const [toastCategory, setToastCategory] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const now = new Date().toDateString();
    if (lastCloverReceivedDate !== now) {
      setShowCloverModal(true);
    }
  }, [lastCloverReceivedDate]);

  const handleReceiveClover = () => {
    addClover();
    setLastCloverReceivedDate(new Date().toDateString());
    setShowCloverModal(false);
  };

  const showSaveToast = (category: string) => {
    setToastCategory(category);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <NavigationBar
        type="logo"
        pointCount={clovers}
        onBell={() => { setUnreadNotification(false); navigation.navigate('Notification'); }}
        onClover={() => navigation.getParent()?.getParent()?.navigate('Clover' as never)}
        hasNotification={hasUnreadNotification}
      />

      <View style={styles.body}>
        {/* 배너: 카드 더 뽑기 */}
        <Pressable style={styles.banner} onPress={() => navigation.navigate('CardPick')}>
          <View style={styles.bannerLeft}>
            <CardIcon />
            <AppText variant="bodyL_M" style={styles.bannerText}>카드를 더 뽑아보세요</AppText>
          </View>
          <AppIcon name="chevron-right" size={24} color="#A8ACA8" />
        </Pressable>

        {/* 카드 슬라이더 + 페이지네이션 */}
        <View style={styles.contents}>
          {cardsToShow.length === 1 ? (
            // 단일 카드: 가운데 정렬
            <View style={styles.singleCardWrapper}>
              <FlippableCard
                card={cardsToShow[0]}
                isSaved={isSaved(cardsToShow[0].id)}
                onToggleSave={() => toggleSave({ id: cardsToShow[0].id, text: cardsToShow[0].text, category: cardsToShow[0].category })}
                onSaveToast={showSaveToast}
              />
            </View>
          ) : (
            // 여러 카드: 슬라이더
            <>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                decelerationRate="fast"
                scrollEventThrottle={50}
                onScroll={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
                  setActiveIndex(Math.max(0, Math.min(idx, cardsToShow.length - 1)));
                }}
                contentContainerStyle={{
                  paddingLeft: SCROLL_PADDING,
                  paddingRight: SCROLL_PADDING,
                  gap: CARD_GAP,
                }}
              >
                {cardsToShow.map((card) => (
                  <FlippableCard
                    key={card.id}
                    card={card}
                    isSaved={isSaved(card.id)}
                    onToggleSave={() => toggleSave({ id: card.id, text: card.text, category: card.category })}
                    onSaveToast={showSaveToast}
                  />
                ))}
              </ScrollView>

              {/* 페이지네이션 도트 */}
              <View style={styles.dotsRow}>
                {cardsToShow.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: i === activeIndex ? colors.brown600 : colors.bgInput }]}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* 두듀 캐릭터 */}
        <View style={styles.dudueSection}>
          <Image
            source={require('../assets/illustrations/home-dudue-peek.gif')}
            style={styles.dudueImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <AppIcon name="check" size={24} color={colors.white} />
        <AppText variant="bodyM_SB" style={styles.toastText}>
          '{toastCategory}' 보관함에 저장했어요
        </AppText>
      </Animated.View>

      <CloverModal visible={showCloverModal} onReceive={handleReceiveClover} />
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
    paddingTop: 10,
    gap: 20,
  },
  banner: {
    marginHorizontal: 20,
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
    gap: 20,
    alignItems: 'center',
  },
  singleCardWrapper: {
    alignItems: 'center',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backfaceVisibility: 'hidden',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dudueSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dudueImage: {
    width: 260,
    height: 180,
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
