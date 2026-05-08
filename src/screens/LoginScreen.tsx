import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const handleLogin = () => {
    // 임시로 바로 온보딩 화면으로 이동하도록 처리 (UI 완성 후 실제 연동 예정)
    navigation.replace('OnboardingNickname');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/*
        피그마: Frame 2134282015 - VERTICAL / SPACE_BETWEEN / paddingTop:40 / paddingHorizontal:20
        title(78) + character(238.75) + buttons(116) → SPACE_BETWEEN
      */}
      <View style={styles.mainFrame}>

        {/* 타이틀: Pretendard SemiBold 28px / lineHeight 140% / #393B38 */}
        <Text style={styles.title}>반가워요!{'\n'}두듀가 기다리고 있어요</Text>

        {/* 캐릭터 이미지: width fill / height 238.75 */}
        <Image
          source={require('../assets/images/login_character.png')}
          style={styles.character}
          resizeMode="cover"
        />

        {/* 하단 버튼 그룹: VERTICAL / gap 8 */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleLogin} activeOpacity={0.8}>
            <Image source={require('../assets/images/icon_kakao.png')} style={styles.buttonIcon} />
            <Text style={styles.kakaoText}>카카오톡으로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleLogin} activeOpacity={0.8}>
            <Image source={require('../assets/images/icon_google.png')} style={styles.buttonIcon} />
            <Text style={styles.googleText}>구글로 계속하기</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.brown100, // Brown/Brown 100 = #F5F1E8
  },
  // Frame 2134282015: VERTICAL / SPACE_BETWEEN / paddingHorizontal 20 / paddingTop 109
  // 피그마 절대좌표 기준: 타이틀 y=-5979.5, SafeArea 시작 y=-6089 → 차이 109.5px
  mainFrame: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 109, // 피그마 수치: 타이틀이 SafeArea top에서 109px 아래 시작
    paddingBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // 타이틀: Header/Header_2 스타일 - SemiBold 28px / 140% / #393B38
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    lineHeight: 39.2,    // 140%
    letterSpacing: -0.28, // -1%
    textAlign: 'center',
    color: '#393B38',    // Gray Scale/800
    alignSelf: 'stretch',
  },
  // 캐릭터: width 353(fill) / height 238.75(fixed)
  character: {
    width: '100%',
    height: 239,
  },
  // Frame 2134282020: VERTICAL / gap 8
  buttonGroup: {
    gap: 8,
  },
  // 공통 버튼: height 54 / borderRadius 8 / HORIZONTAL CENTER / paddingHorizontal 80
  // 피그마: icon right edge = text left edge (gap = 0)
  loginButton: {
    height: 54,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
  },
  buttonIcon: {
    width: 36,
    height: 36,
  },
  // 카카오 버튼: #FEE500
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  // 카카오 텍스트: Body/Body M_SB - SemiBold 16px / lineHeight 150% / #424242
  kakaoText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,       // 150%
    color: '#424242',
  },
  // 구글 버튼: #FFFFFF
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  // 구글 텍스트: Body/Body M_SB - SemiBold 16px / lineHeight 150% / #424242
  googleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,       // 150%
    color: '#424242',
  },
});
