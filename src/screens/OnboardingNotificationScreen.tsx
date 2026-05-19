import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { AppIcon } from '../components/AppIcon';
import TimePickerBottomSheet from '../components/TimePickerBottomSheet';
import { useUserStore } from '../store/useUserStore';

const OPTIONS = [
  {
    id: 'random',
    label: '두듀가 알아서 보내줘',
    desc: '시간 설정 없이 바로 완료',
    selected: true,
  },
  {
    id: 'fixed',
    label: '지정 시간을 정할래',
    desc: '알림 시간대 설정',
    selected: false,
  },
];

export default function OnboardingNotificationScreen({ navigation }: any) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const setNotificationTime = useUserStore((state) => state.setNotificationTime);

  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
    if (id === 'fixed') {
      setShowTimePicker(true);
    }
  };

  const handleComplete = () => {
    if (selectedOption === 'random') {
      setNotificationTime('랜덤');
    } else if (selectedOption === 'fixed' && selectedTime) {
      setNotificationTime(selectedTime);
    }
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AppIcon name="chevron-left" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Pagination Tag */}
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>3/3</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{'두듀가\n언제 메세지를 보낼까요?'}</Text>
          </View>

          {/* Character Image */}
          <View style={styles.characterContainer}>
            <Image
              source={require('../assets/images/dudyu_notification.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          {/* Selectable Cards */}
          <View style={styles.cardList}>
            {OPTIONS.map((option) => {
              const isSelected = selectedOption === option.id;
              const showTimeBadge = option.id === 'fixed' && selectedTime;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => handleOptionSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                      {option.desc}
                    </Text>
                  </View>
                  {showTimeBadge && (
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>{selectedTime}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(16, insets.bottom) }]}>
          <Text style={styles.guideText}>* 나중에 설정에서 변경 가능해요</Text>
          <TouchableOpacity
            style={[styles.ctaButton, !selectedOption && styles.ctaButtonDisabled]}
            onPress={handleComplete}
            disabled={!selectedOption}
          >
            <Text style={styles.ctaButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TimePickerBottomSheet
        visible={showTimePicker}
        showRandomOption={false}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(time) => {
          setSelectedTime(time);
          setShowTimePicker(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.brown100 },
  container: { flex: 1 },
  navBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  backButton: { padding: 10, marginLeft: -10 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 30,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    gap: 16,
    alignSelf: 'stretch',
  },
  tagBadge: {
    backgroundColor: theme.colors.brown200,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  tagBadgeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.brown500,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
    color: theme.colors.black,
    textAlign: 'center',
  },
  characterContainer: {
    width: 175,
    height: 175,
  },
  characterImage: {
    width: 175,
    height: 175,
  },
  cardList: {
    gap: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  card: {
    height: 76,
    backgroundColor: '#FFFCF7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSelected: {
    backgroundColor: theme.colors.brown500,
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  timeBadge: {
    backgroundColor: theme.colors.brown200,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.brown500,
    letterSpacing: -0.3,
  },
  cardLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: '#6A6F6B',
  },
  cardLabelSelected: {
    fontFamily: 'Pretendard-Bold',
    color: theme.colors.white,
  },
  cardDesc: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 21,
    color: '#858885',
  },
  cardDescSelected: {
    color: theme.colors.white,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  guideText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 13,
    lineHeight: 20,
    color: '#9FA19F',
    textAlign: 'center',
  },
  ctaButton: {
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaButtonText: {
    ...theme.typography.bodyXL_SB,
    color: theme.colors.white,
  },
});
