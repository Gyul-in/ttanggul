import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { theme } from '../theme';
import { AppIcon } from '../components/AppIcon';
import { useUserStore } from '../store/useUserStore';

export default function OnboardingPermissionScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const setNotificationOn = useUserStore((state) => state.setNotificationOn);

  const handleRequestPermission = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        setNotificationOn(true);
      }

      navigation.navigate('OnboardingNotification');
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      navigation.navigate('OnboardingNotification');
    }
  };

  const handleSkip = () => {
    setNotificationOn(false);
    navigation.replace('Main');
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

        {/* Main Content Area (Figma: Frame 2134281005) */}
        <View style={styles.content}>
          {/* Frame 2134282016 */}
          <View style={styles.innerContent}>

            {/* Header Section (Figma: Frame 2134281003) */}
            <View style={styles.headerSection}>
              {/* 알림 종 뱃지 (Figma: Frame 2147228005) */}
              <View style={styles.iconBadge}>
                <AppIcon name="bell" size={24} color={theme.colors.brown500} />
              </View>

              {/* 메인 타이틀 (Figma: Frame 2087330488) */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {'두듀가 알림을\n보낼 수 있도록 허용해 주세요!'}
                </Text>
              </View>
            </View>

            {/* 카드 섹션 영역 (Figma: Frame 2147228009) */}
            <View style={styles.cardSection}>
              {/* 푸시 알림 3중 겹침 예시 카드 영역 (Figma: Group 2085670246) */}
              <View style={styles.previewContainer}>
                {/* 가장 뒤쪽 카드 (카드 1 - Rectangle 240654962) */}
                <View style={[styles.overlapCard, styles.cardLayer1]} />

                {/* 중간 카드 (카드 2 - Rectangle 240654961) */}
                <View style={[styles.overlapCard, styles.cardLayer2]} />

                {/* 맨 앞 메인 카드 (카드 3 - Frame 2147228008) */}
                <View style={[styles.overlapCard, styles.cardMain]}>
                  {/* 앱 아이콘 영역 (App Icon) */}
                  <View style={styles.appIconContainer}>
                    <Image
                      source={require('../../assets/icon.png')}
                      style={styles.appIcon}
                      resizeMode="contain"
                    />
                  </View>

                  {/* 텍스트 정보 영역 (Frame 2147228007) */}
                  <View style={styles.cardTextContainer}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>오늘 하루도 고생 많았어</Text>
                      <Text style={styles.cardTime}>5분 전</Text>
                    </View>
                    <Text style={styles.cardBody}>
                      두듀가 전하는 따뜻한 한마디를 확인해요!
                    </Text>
                  </View>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Bottom CTA Button Area */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(16, insets.bottom) }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>나중에</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRequestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>알림 받기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.brown100,
  },
  container: {
    flex: 1,
  },
  navBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  innerContent: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  headerSection: {
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 48,
    height: 48, // 사용자의 '작다, 키워달라'는 피드백을 수용하여 48px로 시각적 존재감 확대
    borderRadius: 24,
    backgroundColor: theme.colors.brown200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
    color: theme.colors.black,
    textAlign: 'center',
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  previewContainer: {
    width: 346,
    height: 130,
    position: 'relative',
  },
  overlapCard: {
    position: 'absolute',
  },
  // 뒤쪽 카드 1
  cardLayer1: {
    width: 267,
    height: 64,
    backgroundColor: '#EDE2CE', // Brown 200
    borderRadius: 10,
    top: 66,
    left: 39,
    zIndex: 1,
    opacity: 0.5,
  },
  // 중간 카드 2
  cardLayer2: {
    width: 315,
    height: 80, // 메인 카드 세로높이 확장에 따른 80px 보정
    backgroundColor: '#E1CFAE', // Brown 300
    borderRadius: 10,
    top: 29,
    left: 15,
    zIndex: 2,
    opacity: 0.8,
  },
  // 맨 앞 메인 카드 3
  cardMain: {
    width: 346,
    height: 80, // 두듀 사진 확대에 맞춰 카드 비율 80px로 넉넉하게 확장
    backgroundColor: '#B48A5B', // Brown 500
    borderRadius: 12,
    top: 0,
    left: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
    // 그림자 효과로 고급스러움 추가
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  appIconContainer: {
    width: 56,
    height: 56, // 두듀 캐릭터 사진을 풍성하게 메우기 위해 컨테이너 56px로 증량
    borderRadius: 12,
    backgroundColor: '#F5F1E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 42,
    height: 42, // 캐릭터 이미지 크기 가로 52px, 세로 36px로 큼직하게 극대화
  },
  cardTextContainer: {
    flex: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cardTime: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#E1CFAE',
  },
  cardBody: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    lineHeight: 20,
    color: '#EDE2CE',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  skipButton: {
    flex: 1,
    height: 56,
    backgroundColor: theme.colors.brown200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: theme.colors.gray600,
  },
  submitButton: {
    flex: 1,
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: theme.colors.white,
  },
});
