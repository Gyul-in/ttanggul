import { View, Image, ImageBackground, Pressable, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import { useEffect, useState, useRef } from 'react';
import { useSave } from '../context/SaveContext';
import CloverModal from '../components/CloverModal';
import { useUserStore } from '../store/useUserStore';

const DESIGN_WIDTH  = 402;
const DESIGN_HEIGHT = 875;

const CURRENT_CARD = {
  id: 'card-001',
  text: '실패 경험은 면접에서 오히려 강점입니다. 어떻게 극복했는지가 핵심입니다.',
  category: '현실조언',
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const { toggleSave, isSaved } = useSave();
  const saved = isSaved(CURRENT_CARD.id);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const clovers = useUserStore((state) => state.clovers);
  const addClover = useUserStore((state) => state.addClover);
  const lastCloverReceivedDate = useUserStore((state) => state.lastCloverReceivedDate);
  const setLastCloverReceivedDate = useUserStore((state) => state.setLastCloverReceivedDate);
  const hasUnreadNotification = useUserStore((state) => state.hasUnreadNotification);
  const setUnreadNotification = useUserStore((state) => state.setUnreadNotification);

  const [showCloverModal, setShowCloverModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const toastOpacity = useRef(new Animated.Value(0)).current;

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
    toggleSave(CURRENT_CARD);
    if (!saved) showToast();
  };

  const uiScale = Math.min(screenWidth / DESIGN_WIDTH, 1);

  const cardHeight = Math.round(screenHeight * (348 / DESIGN_HEIGHT));
  const cardWidth  = Math.min(
    Math.round(cardHeight * (300 / 348)),
    Math.round(screenWidth - 40),
  );

  const cardRadius    = Math.round(20 * uiScale);
  const cardPadH      = Math.round(16 * uiScale);
  const cardPadV      = Math.round(20 * uiScale);
  const cardTextPT    = Math.round(68 * uiScale);
  const cardBtnSize   = Math.round(32 * uiScale);
  const cardBtnGap    = Math.round(12 * uiScale);
  const cardIconSz    = Math.round(20 * uiScale);
  const cardFontSz    = Math.round(24 * uiScale);
  const cardLineH     = Math.round(36 * uiScale);
  const cardFlipPadH  = Math.round(18 * uiScale);
  const cardFlipPadV  = Math.round(14 * uiScale);
  const cardHeartW    = Math.round(52 * uiScale);

  const bodyPadH      = Math.round(20 * uiScale);
  const bodyPadTop    = Math.round(10 * uiScale);
  const bodyGap       = Math.round(20 * uiScale);
  const contents01Gap = Math.round(30 * uiScale);

  const bannerPadH    = Math.round(16 * uiScale);
  const bannerPadV    = Math.round(14 * uiScale);
  const bannerRadius  = Math.round(12 * uiScale);

  const dotR       = Math.round(3  * uiScale);
  const dotH       = dotR * 2;
  const dotW       = Math.round(70 * uiScale);
  const dotCenters = [3, 19, 35, 51, 67].map(x => Math.round(x * uiScale));

  const dudueW = Math.round(136 * uiScale);
  const dudueH = Math.round(94  * uiScale);

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

      <View style={[styles.body, {
        paddingHorizontal: bodyPadH,
        paddingTop: bodyPadTop,
        gap: bodyGap,
      }]}>

        {/* 배너 */}
        {showBanner && (
          <Pressable
            style={[styles.banner, {
              paddingHorizontal: bannerPadH,
              paddingVertical: bannerPadV,
              borderRadius: bannerRadius,
            }]}
            onPress={() => navigation.navigate('CardPick')}
          >
            <AppText variant="bodyM_M" style={styles.bannerText}>카드를 더 뽑아보세요</AppText>
            <Pressable onPress={(e) => { e.stopPropagation(); setShowBanner(false); }} hitSlop={8}>
              <AppIcon name="close" size={Math.round(24 * uiScale)} color={colors.gray300} />
            </Pressable>
          </Pressable>
        )}

        <View style={[styles.contents01, { gap: contents01Gap }]}>
          <ImageBackground
            source={require('../assets/illustrations/card-bg.png')}
            style={{
              width: cardWidth,
              height: cardHeight,
              borderRadius: cardRadius,
              overflow: 'hidden',
              paddingHorizontal: cardPadH,
              paddingTop: cardPadV,
              paddingBottom: cardPadV,
            }}
            imageStyle={{ borderRadius: cardRadius }}
            resizeMode="cover"
          >
            <View style={[styles.cardBtns, { gap: cardBtnGap }]}>
              <Pressable style={[styles.cardBtn, { width: cardBtnSize, height: cardBtnSize, borderRadius: cardBtnSize / 2 }]}>
                <AppIcon name="send" size={cardIconSz} color="white" />
              </Pressable>
            </View>

            <View style={[styles.cardTextArea, { paddingTop: cardTextPT }]}>
              <AppText
                variant="sectionTitle"
                color="black"
                style={[styles.cardText, { fontSize: cardFontSz, lineHeight: cardLineH }]}
              >
                {'실패 경험은 면접에서\n오히려 강점입니다. 어떻게\n극복 했는지가 핵심입니다.'}
              </AppText>
            </View>

            <View style={[styles.cardBottomRow, { gap: Math.round(8 * uiScale) }]}>
              <Pressable style={[styles.cardFlipBtn, { paddingHorizontal: cardFlipPadH, paddingVertical: cardFlipPadV, borderRadius: Math.round(12 * uiScale) }]}>
                <AppText variant="bodyM_SB" color="white">카드 뒤집기</AppText>
              </Pressable>
              <Pressable
                style={[styles.cardHeartBtn, {
                  width: cardHeartW,
                  height: cardHeartW,
                  borderRadius: Math.round(12 * uiScale),
                  backgroundColor: saved ? colors.error : colors.bgMain,
                }]}
                onPress={handleToggleSave}
              >
                <AppIcon
                  name={saved ? 'heart-filled' : 'heart'}
                  size={cardIconSz}
                  color={saved ? colors.white : colors.gray900}
                />
              </Pressable>
            </View>
          </ImageBackground>

          <Svg width={dotW} height={dotH} viewBox={`0 0 ${dotW} ${dotH}`}>
            {dotCenters.map((cx, i) => (
              <Circle key={i} cx={cx} cy={dotR} r={dotR}
                fill={i === 1 ? colors.brown600 : colors.bgInput} />
            ))}
          </Svg>
        </View>

        {/* 두듀 + 토스트 */}
        <View style={styles.dudueSection}>
          <Image
            source={require('../assets/illustrations/Half_dudue.png')}
            style={{ width: dudueW, height: dudueH }}
            resizeMode="contain"
          />
          <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
            <AppIcon name="check" size={20} color={colors.white} />
            <AppText variant="bodyM_SB" style={styles.toastText}>
              '{CURRENT_CARD.category}' 보관함에 저장했어요
            </AppText>
          </Animated.View>
        </View>
      </View>

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
    alignItems: 'center',
  },
  banner: {
    alignSelf: 'stretch',
    backgroundColor: colors.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    flex: 1,
    color: '#393B38',
  },
  contents01: {
    alignItems: 'center',
  },
  cardBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardBtn: {
    backgroundColor: 'rgba(57,59,56,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextArea: {
    flex: 1,
    alignItems: 'center',
  },
  cardText: {
    textAlign: 'center',
    letterSpacing: -0.24,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFlipBtn: {
    flex: 1,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeartBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dudueSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  toast: {
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
