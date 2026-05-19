import { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import { useUI } from '../context/UIContext';
import { useUserStore } from '../store/useUserStore';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CATEGORIES = ['전체', '위로', '공감', '명언', '동기부여', '현실조언'];

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

export default function NotificationScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const notifications = useUserStore((state) => state.notifications);
  const deleteNotification = useUserStore((state) => state.deleteNotification);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortLatest, setSortLatest] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setTabBarVisible } = useUI();
  const chipScrollRef = useRef<ScrollView>(null);
  const chipOffsets = useRef<{ [key: string]: number }>({});

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      return () => setTabBarVisible(true);
    }, [setTabBarVisible])
  );

  const scale = width / 402;
  const padH = Math.round(20 * scale);
  const padTop = Math.round(10 * scale);
  const sectionGap = Math.round(24 * scale);
  const itemPadH = Math.round(16 * scale);
  const itemPadV = Math.round(14 * scale);
  const itemRadius = Math.round(12 * scale);
  const itemGap = Math.round(12 * scale);
  const chipPadH = Math.round(12 * scale);
  const chipPadV = Math.round(6 * scale);
  const chipRadius = Math.round(8 * scale);
  const chipGap = Math.round(10 * scale);


  const base = selectedCategory === '전체'
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);
  const filtered = sortLatest ? [...base].reverse() : [...base];

  const hasNotifications = notifications.length > 0;

  return (
    <View style={styles.container}>
      <NavigationBar
        type="default"
        title="알림"
        onBack={() => navigation.goBack()}
        rightIcon={hasNotifications ? 'pencil-fill' : undefined}
        rightIconColor="#A8ACA8"
        onRight={() => setIsEditMode(p => !p)}
      />

      {!hasNotifications ? (
        <View style={styles.emptyBody}>
          <View style={styles.illustrationWrapper}>
            <Image
              source={require('../assets/illustrations/Sleep.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textBlock}>
            <AppText variant="subTitle" color="gray900" style={styles.textCenter}>
              행운 배달 준비 중이에요
            </AppText>
            <AppText variant="bodyM_R" color="gray600" style={styles.textCenter}>
              {'아직 도착한 행운 문구가 없어요.\n설정한 시간대에 맞춰서 보내드릴게요!'}
            </AppText>
          </View>
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.getParent()?.navigate('Settings', { openTimeSheet: true })}
          >
            <AppText variant="bodyM_SB" color="white">알림 시간 변경하기</AppText>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.body, { paddingTop: padTop, paddingHorizontal: padH, gap: sectionGap }]}>
          {/* 정렬 + 카테고리 */}
          <View style={[styles.filterSection, { gap: Math.round(16 * scale) }]}>
            <Pressable style={styles.sortRow} onPress={() => setSortLatest(p => !p)}>
              <Text style={styles.sortText}>{sortLatest ? '최신순' : '날짜순'}</Text>
              <AppIcon name="menu-05" size={Math.round(16 * scale)} color={colors.gray500} />
            </Pressable>
            <ScrollView
              ref={chipScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 0 }}
              contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: chipGap }}
            >
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onLayout={(e) => { chipOffsets.current[cat] = e.nativeEvent.layout.x; }}
                    onPress={() => {
                      setSelectedCategory(cat);
                      if (cat === '전체') {
                        chipScrollRef.current?.scrollTo({ x: 0, animated: true });
                      } else if (cat === '현실조언') {
                        chipScrollRef.current?.scrollTo({ x: chipOffsets.current[cat] ?? 0, animated: true });
                      }
                    }}
                    style={[
                      styles.chip,
                      {
                        paddingHorizontal: chipPadH,
                        paddingVertical: Math.round(10 * scale),
                        borderRadius: chipRadius,
                        backgroundColor: isSelected ? colors.brown500 : colors.bgCard,
                      },
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      { fontSize: Math.round(15 * scale) },
                      isSelected ? styles.chipTextSelected : styles.chipTextDefault,
                    ]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 알림 목록 */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: itemGap }} />}
            renderItem={({ item }) => (
              <View style={[styles.notifItem, {
                paddingHorizontal: itemPadH,
                paddingVertical: itemPadV,
                borderRadius: itemRadius,
              }]}>
                <Text style={[styles.notifText, { fontSize: Math.round(16 * scale), lineHeight: Math.round(16 * scale * 1.5) }]}>
                  {item.text}
                </Text>
                {isEditMode ? (
                  <Pressable onPress={() => deleteNotification(item.id)} hitSlop={8} style={styles.deleteBtn}>
                    <AppIcon name="close" size={Math.round(18 * scale)} color="#9FA19F" />
                  </Pressable>
                ) : (
                  <Text style={[styles.notifTime, { fontSize: Math.round(13 * scale) }]}>
                    {formatTime(item.receivedAt)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  // 빈 상태
  emptyBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 194,
    gap: 40,
  },
  illustrationWrapper: {
    width: 187,
    height: 210,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  illustration: {
    width: 187,
    height: 187,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
    marginTop: -20,
  },
  textCenter: {
    textAlign: 'center',
  },
  ctaBtn: {
    width: 260,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.gray900,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 알림 있을 때
  body: {
    flex: 1,
  },
  filterSection: {
    width: '100%',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
  sortText: {
    ...typography.bodyMS_M,
    color: colors.gray500,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    lineHeight: undefined,
  },
  chipTextSelected: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.white,
  },
  chipTextDefault: {
    fontFamily: 'Pretendard-Medium',
    color: colors.gray600,
  },
  notifItem: {
    backgroundColor: colors.bgCard,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  notifText: {
    flex: 1,
    fontFamily: 'Pretendard-Medium',
    color: '#393B38',
  },
  notifTime: {
    fontFamily: 'Pretendard-Medium',
    color: '#9FA19F',
    textAlign: 'right',
    width: 54,
    lineHeight: 24,
  },
  deleteBtn: {
    width: 54,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
