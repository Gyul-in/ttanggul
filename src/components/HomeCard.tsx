import React, { useState, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { colors } from '../theme';

export type HomeCardType = '위로' | '공감' | '명언' | '현실조언' | '동기부여' | 'Back';

type HomeCardProps = {
  type?: HomeCardType;
  text: string;
  category?: string;
  liked?: boolean;
  btn?: boolean;
  send?: boolean;
  onFlip?: () => void;
  onLike?: () => void;
  onShare?: () => void;
};

const BG_LAYERS: Record<Exclude<HomeCardType, 'Back'>, ImageSourcePropType[]> = {
  현실조언: [
    require('../assets/illustrations/card-bg-hyunsil-1.png'),
    require('../assets/illustrations/card-bg-hyunsil-2.png'),
    require('../assets/illustrations/card-bg-hyunsil-3.png'),
  ],
  위로: [
    require('../assets/illustrations/card-bg-wiro-1.png'),
    require('../assets/illustrations/card-bg-wiro-2.png'),
  ],
  공감: [
    require('../assets/illustrations/card-bg-gongam-1.png'),
    require('../assets/illustrations/card-bg-gongam-2.png'),
    require('../assets/illustrations/card-bg-gongam-3.png'),
  ],
  명언: [
    require('../assets/illustrations/card-bg-gongam-1.png'),
    require('../assets/illustrations/card-bg-gongam-2.png'),
    require('../assets/illustrations/card-bg-gongam-3.png'),
    require('../assets/illustrations/card-bg-myungon-4.png'),
  ],
  동기부여: [
    require('../assets/illustrations/card-bg-donggi-1.png'),
  ],
};

const CARD_BG: Record<HomeCardType, string> = {
  현실조언: '#2A2F2B',
  위로: '#EEE5B8',
  공감: '#EEE5B8',
  명언: '#EEE5B8',
  동기부여: '#EEE5B8',
  Back: colors.brown200,
};

export default forwardRef<View, HomeCardProps>(function HomeCard({
  type = '현실조언',
  text,
  category = '현실조언',
  liked: initialLiked = false,
  btn = true,
  send = true,
  onFlip,
  onLike,
  onShare,
}: HomeCardProps, ref) {
  const [liked, setLiked] = useState(initialLiked);
  const isBack = type === 'Back';
  const textColor = type === '현실조언' ? colors.white : colors.black;
  const bgLayers = isBack ? [] : BG_LAYERS[type] ?? [];

  return (
    <View ref={ref} style={[styles.card, { backgroundColor: CARD_BG[type] }]}>
      {/* 배경 이미지 레이어 */}
      {bgLayers.map((src, i) => (
        <Image key={i} source={src} style={styles.bgImage} resizeMode="cover" />
      ))}

      {/* 상단 행: Back이면 배지, 앞면이면 공유 버튼 */}
      {isBack ? (
        <View style={styles.topRowCenter}>
          <View style={styles.badge}>
            <AppText variant="bodyXS_SB" style={styles.badgeText}>{category}</AppText>
          </View>
        </View>
      ) : (
        <View style={styles.topRow}>
          {send && (
            <TouchableOpacity onPress={onShare} style={styles.sendBtn} activeOpacity={0.8}>
              <AppIcon name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 중앙: 뒷면 */}
      {isBack && (
        <View style={styles.backTextArea}>
          <AppText
            variant="sectionTitle"
            style={[styles.cardText, { color: textColor, maxHeight: 189 }]}
            numberOfLines={7}
          >
            {text}
          </AppText>
        </View>
      )}

      {/* 중앙: 앞면 (배지 + 텍스트) */}
      {!isBack && (
        <View style={[styles.textArea, { paddingTop: 10, gap: 10 }]}>
          <View style={styles.badge}>
            <AppText variant="bodyXS_SB" style={styles.badgeText}>{category}</AppText>
          </View>
          <AppText
            variant="sectionTitle"
            style={[styles.cardText, { color: textColor, maxHeight: 144 }]}
            numberOfLines={5}
          >
            {text}
          </AppText>
        </View>
      )}

      {/* 하단 버튼 행 */}
      {btn && (
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.flipBtn} onPress={onFlip} activeOpacity={0.85}>
            <AppText variant="bodyM_SB" style={styles.flipBtnText}>카드 뒤집기</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => {
              onLike?.();
              setLiked(prev => !prev);
            }}
            activeOpacity={0.8}
          >
            <AppIcon
              name="heart-filled"
              size={20}
              color={liked ? '#FF5959' : colors.brown300}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 348,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    flexDirection: 'column',
  },
  bgImage: {
    position: 'absolute',
    width: 300,
    height: 348,
    top: 0,
    left: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(57,59,56,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.brown300,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: colors.brown700,
    letterSpacing: -0.26,
  },
  backTextArea: {
    flex: 1,
    justifyContent: 'center',
  },
  textArea: {
    flex: 1,
    alignItems: 'center',
  },
  cardText: {
    textAlign: 'center',
    letterSpacing: -0.24,
    alignSelf: 'stretch',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flipBtn: {
    flex: 1,
    height: 52,
    backgroundColor: colors.gray900,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipBtnText: {
    color: colors.white,
  },
  heartBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.brown100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
