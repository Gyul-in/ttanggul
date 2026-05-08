import { View, Image, ImageBackground, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';

const DESIGN_WIDTH  = 402;
const DESIGN_HEIGHT = 875;

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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
  const cardBottomGap = Math.round(8  * uiScale);
  const cardFlipPadH  = Math.round(18 * uiScale);
  const cardFlipPadV  = Math.round(14 * uiScale);
  const cardHeartW    = Math.round(52 * uiScale);

  const bodyPadH      = Math.round(20 * uiScale);
  const bodyPadTop    = Math.round(20 * uiScale);
  const bodyGap       = Math.round(44 * uiScale);
  const contents01Gap = Math.round(30 * uiScale);

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
        pointCount={2}
        onBell={() => navigation.navigate('Notification')}
        onClover={() => navigation.navigate('Clover')}
      />

      <View style={[styles.body, {
        paddingHorizontal: bodyPadH,
        paddingTop: bodyPadTop,
        gap: bodyGap,
      }]}>

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

            <View style={[styles.cardBottomRow, { gap: cardBottomGap }]}>
              <Pressable style={[styles.cardFlipBtn, { paddingHorizontal: cardFlipPadH, paddingVertical: cardFlipPadV, borderRadius: Math.round(12 * uiScale) }]}>
                <AppText variant="bodyM_SB" color="white">카드 뒤집기</AppText>
              </Pressable>
              <Pressable style={[styles.cardHeartBtn, { width: cardHeartW, paddingVertical: cardFlipPadV, borderRadius: Math.round(12 * uiScale) }]}>
                <AppIcon name="heart" size={cardIconSz} color={colors.gray900} />
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

        <Image
          source={require('../assets/illustrations/Half_dudue.png')}
          style={{ width: dudueW, height: dudueH }}
          resizeMode="contain"
        />
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
    backgroundColor: colors.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
