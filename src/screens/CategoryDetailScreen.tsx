import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions, Modal, Image, Animated } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { AppIcon } from '../components/AppIcon';
import { useSave, SavedCard } from '../context/SaveContext';
import { useUI } from '../context/UIContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ CategoryDetail: { categoryName: string } }, 'CategoryDetail'>;
};

export default function CategoryDetailScreen({ navigation, route }: Props) {
  const { categoryName } = route.params;
  const { savedCategories, removeCards } = useSave();
  const { setTabBarVisible } = useUI();
  const [sortLatest, setSortLatest] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cards: SavedCard[] = savedCategories[categoryName] ?? [];
  const sorted = sortLatest ? [...cards].reverse() : [...cards];
  const cardWidth = Math.floor((width - 40 - 14) / 2);

  const modalWidth = Math.round(width * 337 / 402);
  const modalPadH = Math.round(width * 20 / 402);
  const modalPadTop = Math.round(width * 20 / 402);
  const modalPadBottom = Math.round(width * 20 / 402);
  const modalGap = Math.round(width * 32 / 402);
  const illustW = Math.round(modalWidth * 133 / 337);
  const illustH = Math.round(illustW * 87 / 133);
  const modalBtnH = Math.round(width * 56 / 402);
  const modalBtnRadius = Math.round(width * 12 / 402);
  const modalTitleSize = Math.round(width * 20 / 402);
  const modalSubSize = Math.round(width * 15 / 402);
  const modalBtnTextSize = Math.round(width * 18 / 402);

  const cardFontSize = Math.round(cardWidth / 174 * 18);
  const cardLineHeight = cardFontSize * 1.5;
  const maxTextLines = Math.floor((cardWidth - 24) / cardLineHeight);
  const checkboxSize = Math.round(cardWidth * 36 / 174);
  const checkIconSize = Math.round(checkboxSize * 0.55);

  useEffect(() => {
    setTabBarVisible(!isEditMode);
  }, [isEditMode]);

  useEffect(() => {
    return () => setTabBarVisible(true);
  }, []);

  const enterEditMode = () => {
    setIsEditMode(true);
    setSelectedIds(new Set());
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeletePress = () => {
    if (selectedIds.size === 0) return;
    setShowConfirm(true);
  };

  const showToastMessage = () => {
    toastOpacity.setValue(0);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    removeCards(categoryName, selectedIds);
    setSelectedIds(new Set());
    setIsEditMode(false);
    showToastMessage();
  };

  const ctaBottomPad = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => isEditMode ? exitEditMode() : navigation.goBack()}
          hitSlop={12}
          style={styles.iconSlot}
        >
          <AppIcon name="chevron-left" size={24} color={colors.black} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEditMode ? '수정' : categoryName}</Text>
        <View style={styles.iconSlot}>
          {!isEditMode && cards.length > 0 && (
            <Pressable onPress={enterEditMode} hitSlop={12}>
              <AppIcon name="pencil-fill" size={24} color="#A8ACA8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* 전체 개수 + 정렬 */}
      <View style={styles.controls}>
        <Text style={styles.totalText}>전체 {cards.length}개</Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortLatest(p => !p)}>
          <Text style={styles.sortText}>{sortLatest ? '최신순' : '날짜순'}</Text>
          <AppIcon name="menu-05" size={16} color="#757682" />
        </Pressable>
      </View>

      {/* 카드 목록 */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        extraData={isEditMode}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <Pressable
              style={[
                styles.card,
                { width: cardWidth, height: cardWidth },
                isEditMode && isSelected && styles.cardSelected,
              ]}
              onPress={() => isEditMode && toggleSelect(item.id)}
            >
              <Text
                numberOfLines={maxTextLines}
                ellipsizeMode="clip"
                style={[
                  styles.cardText,
                  { fontSize: cardFontSize, lineHeight: cardLineHeight },
                ]}
              >
                {item.text}
              </Text>
              {isEditMode && (
                <View
                  style={[
                    styles.checkbox,
                    {
                      width: checkboxSize,
                      height: checkboxSize,
                      borderRadius: Math.round(checkboxSize * 0.25),
                    },
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <AppIcon name="check" size={checkIconSize} color="#A7784F" />
                  )}
                </View>
              )}
            </Pressable>
          );
        }}
        contentContainerStyle={[
          styles.listContent,
          isEditMode && { paddingBottom: 88 + ctaBottomPad },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyGroup}>
              <View style={styles.emptyIllustWrapper}>
                <Image
                  source={require('../../assets/illustrations/Empty.png')}
                  style={styles.emptyIllust}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.emptyTextBlock}>
                <Text style={styles.emptyTitle}>보관함이 텅 비었어요!</Text>
                <Text style={styles.emptySubtitle}>
                  {'앗! 아직 저장된 문구가 없네요. 해당 카테고리로\n두듀가 준비한 문구들을 받아볼까요?'}
                </Text>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [styles.emptyCtaBtn, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.getParent()?.navigate('Settings', { openQuoteSheet: true })}
            >
              <Text style={styles.emptyCtaText}>카테고리 변경하기</Text>
            </Pressable>
          </View>
        }
      />

      {/* 삭제 CTA */}
      {isEditMode && (
        <View style={[styles.ctaWrapper, { paddingBottom: ctaBottomPad }]}>
          <Pressable
            style={[styles.deleteBtn, selectedIds.size === 0 && styles.deleteBtnDisabled]}
            onPress={handleDeletePress}
          >
            <Text style={styles.deleteBtnText}>삭제하기</Text>
          </Pressable>
        </View>
      )}

      {/* 삭제 완료 토스트 */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { bottom: 20, opacity: toastOpacity }]} pointerEvents="none">
          <AppIcon name="check" size={24} color="#FFFFFF" />
          <Text style={styles.toastText}>삭제했어요!</Text>
        </Animated.View>
      )}

      {/* 삭제 확인 모달 */}
      <Modal visible={showConfirm} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {
            width: modalWidth,
            paddingTop: modalPadTop,
            paddingBottom: modalPadBottom,
            paddingHorizontal: modalPadH,
            gap: modalGap,
          }]}>
            <View style={styles.modalTop}>
              <Image
                source={require('../../assets/illustrations/Warning.png')}
                style={{ width: illustW, height: illustH }}
                resizeMode="contain"
              />
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalTitle, { fontSize: modalTitleSize, lineHeight: modalTitleSize * 1.5 }]}>기록이 삭제돼요!</Text>
                <Text style={[styles.modalSubtitle, { fontSize: modalSubSize, lineHeight: modalSubSize * 1.5 }]}>
                  {'선택된 문구가 영구적으로 지워져요.\n그래도 삭제할까요?'}
                </Text>
              </View>
            </View>
            <View style={styles.modalBtns}>
              <Pressable style={[styles.cancelBtn, { height: modalBtnH, borderRadius: modalBtnRadius }]} onPress={() => setShowConfirm(false)}>
                <Text style={[styles.cancelBtnText, { fontSize: modalBtnTextSize }]}>취소</Text>
              </Pressable>
              <Pressable style={[styles.confirmBtn, { height: modalBtnH, borderRadius: modalBtnRadius }]} onPress={handleConfirmDelete}>
                <Text style={[styles.confirmBtnText, { fontSize: modalBtnTextSize }]}>삭제하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    ...typography.subTitle,
    color: colors.black,
  },
  iconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  totalText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    lineHeight: 22.5,
    color: '#757682',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    lineHeight: 22.5,
    color: '#757682',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.bgInput,
    borderRadius: 16,
    padding: 12,
  },
  cardSelected: {
    backgroundColor: '#D3BF9E',
    borderWidth: 1.5,
    borderColor: '#A7784F',
    padding: 10.5,
  },
  cardText: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.black,
  },
  checkbox: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#B8A898',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 40,
    gap: 40,
  },
  emptyGroup: {
    alignItems: 'center',
    gap: 20,
  },
  emptyIllustWrapper: {
    width: 187,
    height: 187,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emptyIllust: {
    width: 179,
    height: 179,
  },
  emptyTextBlock: {
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#6A6F6B',
    textAlign: 'center',
  },
  emptyCtaBtn: {
    width: 260,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.gray900,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCtaText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.bgMain,
  },
  deleteBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnDisabled: {
    backgroundColor: '#BFBFBF',
  },
  deleteBtnText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  toastText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#F5F1E8',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTop: {
    width: '100%',
    alignItems: 'center',
    gap: 0,
  },
  modalTextGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  modalTitle: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#111111',
  },
  modalSubtitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#858885',
    textAlign: 'center',
  },
  modalBtns: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#525552',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#FF5959',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
});
