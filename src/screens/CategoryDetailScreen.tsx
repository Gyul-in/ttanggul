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
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    const remaining = cards.filter(c => !selectedIds.has(c.id));
    removeCards(categoryName, selectedIds);
    setSelectedIds(new Set());
    setIsEditMode(false);
    if (remaining.length === 0) {
      showToastMessage();
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      showToastMessage();
    }
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
          {!isEditMode && (
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
            <Text style={styles.emptyText}>아직 저장된 카드가 없어요.</Text>
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
          <View style={styles.modalCard}>
            <View style={styles.modalTop}>
              <Image
                source={require('../../assets/illustrations/Warning.png')}
                style={styles.modalIllust}
                resizeMode="contain"
              />
              <View style={styles.modalTextGroup}>
                <Text style={styles.modalTitle}>기록이 삭제돼요!</Text>
                <Text style={styles.modalSubtitle}>
                  {'선택된 문구가 영구적으로 지워져요.\n그래도 삭제할까요?'}
                </Text>
              </View>
            </View>
            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleConfirmDelete}>
                <Text style={styles.confirmBtnText}>삭제하기</Text>
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
    paddingTop: 60,
  },
  emptyText: {
    ...typography.bodyM_R,
    color: colors.gray500,
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
    width: 337,
    backgroundColor: '#F5F1E8',
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 32,
    alignItems: 'center',
  },
  modalTop: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalIllust: {
    width: 133,
    height: 87,
  },
  modalTextGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  modalTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: '#111111',
  },
  modalSubtitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    lineHeight: 22.5,
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
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#525552',
  },
  confirmBtn: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FF5959',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
