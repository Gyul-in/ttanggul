import React, { useState, useRef, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import Svg, { Ellipse } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppText } from '../components/AppText';
import { AppIcon } from '../components/AppIcon';
import TimePickerBottomSheet from '../components/TimePickerBottomSheet';
import FeedbackBottomSheet from '../components/FeedbackBottomSheet';

type SettingItemProps = {
  label: string;
  value?: string;
  valueColor?: 'primary' | 'gray600';
  onPress?: () => void;
  showArrow?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  rightElement?: React.ReactNode;
};

const SettingItem = ({
  label,
  value,
  valueColor = 'primary',
  onPress,
  showArrow = true,
  isFirst,
  isLast,
  rightElement,
}: SettingItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.listItem,
        isFirst && styles.listItemFirst,
        isLast && styles.listItemLast,
        !isLast && styles.listDivider,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <AppText variant="bodyL_M" color="gray900">
        {label}
      </AppText>
      <View style={styles.rightContent}>
        {value && (
          <AppText variant="bodyMS_M" color={valueColor} style={styles.valueText}>
            {value}
          </AppText>
        )}
        {rightElement}
        {showArrow && <AppIcon name="chevron-right" size={20} color={colors.gray300} />}
      </View>
    </TouchableOpacity>
  );
};

const SubHeader = ({ title }: { title: string }) => (
  <View style={styles.subHeader}>
    <AppText variant="bodyS_SB" color="gray600">
      {title}
    </AppText>
  </View>
);

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CATEGORY_ROWS = [
  ['위로', '공감'],
  ['동기부여', '현실조언'],
  ['명언'],
];

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [quoteSheetVisible, setQuoteSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('공감');
  const [timeSheetVisible, setTimeSheetVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('11:00 PM');
  const [feedbackSheetVisible, setFeedbackSheetVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [toastMessage, setToastMessage] = useState('변경했어요!');

  const showToast = (message: string = '변경했어요!') => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (quoteSheetVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [quoteSheetVisible, slideAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar - Height 54 */}
      <View style={styles.navBar}>
        <AppText variant="subTitle" color="black">
          설정
        </AppText>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content Area (A1LXO0) - gap 20, padding: 10 20 0 */}
        <View style={styles.mainContainer}>
          {/* Profile Card (M3RVJS) - width 362, padding 16, gap 31 */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.profileImage}>
                <Svg width={64} height={64} viewBox="0 0 64 64">
                  <Ellipse cx={32} cy={26} rx={10} ry={10} fill={colors.gray200} />
                  <Ellipse cx={32} cy={57} rx={18.5} ry={18} fill={colors.gray200} />
                </Svg>
              </View>
              <View style={styles.profileTextContainer}>
                <View style={styles.nicknameRow}>
                  <AppText variant="sectionTitle" color="black">
                    두듀
                  </AppText>
                  <View style={styles.editIconWrapper}>
                    <View style={styles.editIconCircle}>
                      <AppIcon name="edit-filled" size={12} color={colors.gray300} />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.infoLinkRow}
                  onPress={() => navigation.navigate('AccountInfo')}
                  activeOpacity={0.7}
                >
                  <AppText variant="bodyS_M" color="gray500">
                    내 정보 확인하기
                  </AppText>
                  <AppIcon name="chevron-right" size={20} color={colors.gray200} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Point Badge (VS9UXY) - padding 10, gap 10, width 69 */}
            <View style={styles.pointBadge}>
              <AppIcon name="clover" size={24} color={colors.primary} />
              <AppText variant="bodyL_SB" color="brown800">
                2
              </AppText>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsGroup}>
            <SubHeader title="알림 설정" />
            <View style={styles.listContainer}>
              <SettingItem
                label="알림 ON/OFF"
                showArrow={false}
                isFirst
                rightElement={
                  <Switch
                    value={isNotificationOn}
                    onValueChange={setIsNotificationOn}
                    trackColor={{ false: colors.gray100, true: colors.primary }}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.gray100}
                    style={Platform.OS === 'ios' ? { transform: [{ scale: 0.8 }] } : {}}
                  />
                }
              />
              <SettingItem label="알림 시간" value={selectedTime} onPress={() => setTimeSheetVisible(true)} />
              <SettingItem label="글귀" value={selectedCategory} isLast onPress={() => setQuoteSheetVisible(true)} />
            </View>
          </View>

          {/* Other Section */}
          <View style={styles.settingsGroup}>
            <SubHeader title="기타" />
            <View style={styles.listContainer}>
              <SettingItem label="개인정보처리방침" isFirst />
              <SettingItem label="의견 보내기" onPress={() => setFeedbackSheetVisible(true)} />
              <SettingItem label="버전정보" value="v1.0" valueColor="gray600" showArrow={false} isLast />
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={quoteSheetVisible}
        transparent
        animationType="none"
        onRequestClose={() => setQuoteSheetVisible(false)}
      >
        <View style={styles.sheetContainer}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setQuoteSheetVisible(false)} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom }]}>
            {/* 핸들 + 콘텐츠 */}
            <View style={styles.sheetInner}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetContent}>
                <AppText variant="subTitle" color="black">변경할 카테고리를 선택해 주세요!</AppText>
                <View style={styles.categoryGrid}>
                  {CATEGORY_ROWS.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.categoryRow}>
                      {row.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnSelected]}
                          activeOpacity={0.7}
                          onPress={() => setSelectedCategory(cat)}
                        >
                          <AppText
                            variant={selectedCategory === cat ? 'bodyL_SB' : 'bodyL_M'}
                            color={selectedCategory === cat ? 'brown700' : 'gray600'}
                          >
                            {cat}
                          </AppText>
                        </TouchableOpacity>
                      ))}
                      {row.length < 2 && <View style={styles.categoryBtnSpacer} />}
                    </View>
                  ))}
                </View>
              </View>
            </View>
            {/* 하단 버튼 영역 */}
            <View style={styles.sheetBtnContainer}>
              <TouchableOpacity
                style={styles.sheetSaveBtn}
                activeOpacity={0.7}
                onPress={() => { setQuoteSheetVisible(false); showToast(); }}
              >
                <AppText variant="bodyXL_SB" style={styles.sheetSaveBtnText}>변경하기</AppText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      <TimePickerBottomSheet
        visible={timeSheetVisible}
        onClose={() => setTimeSheetVisible(false)}
        onConfirm={(time) => {
          setSelectedTime(time);
          setTimeSheetVisible(false);
          showToast();
        }}
      />
      <FeedbackBottomSheet
        visible={feedbackSheetVisible}
        onClose={() => setFeedbackSheetVisible(false)}
        onSend={() => showToast('소중한 의견 감사합니다.')}
      />
      <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]} pointerEvents="none">
        <View style={styles.toastPill}>
          <AppIcon name="check" size={24} color={colors.white} />
          <AppText variant="bodyM_SB" style={styles.toastText}>{toastMessage}</AppText>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  navBar: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20, // layout_A1LXO0 gap
  },
  profileCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray100,
    overflow: 'hidden',
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  editIconWrapper: {
    paddingBottom: 6,
  },
  editIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pointBadge: {
    backgroundColor: colors.brown200,
    borderRadius: 12,
    padding: 10, // layout_VS9UXY padding
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // layout_VS9UXY gap
    width: 69,
    justifyContent: 'center',
  },
  settingsGroup: {
    gap: 4, // Figma: gap between Subheader and list group
  },
  subHeader: {
    justifyContent: 'center',
  },
  listContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16, // Figma: T16 R16 B16 L16
    minHeight: 58,
  },
  listItemFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listItemLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  listDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.brown200,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    marginRight: 4,
  },
  // Bottom Sheet
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.bgMain,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetInner: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    gap: 24,
  },
  sheetHandle: {
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.brown200,
    alignSelf: 'center',
  },
  sheetContent: {
    gap: 20,
  },
  categoryGrid: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnSelected: {
    backgroundColor: colors.bgInput,
  },
  categoryBtnSpacer: {
    flex: 1,
  },
  sheetBtnContainer: {
    padding: 16,
  },
  sheetSaveBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSaveBtnText: {
    color: colors.white,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 7,
  },
  toastText: {
    color: colors.white,
  },
});
