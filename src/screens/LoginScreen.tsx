import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const handleLogin = () => {
    // 임시로 바로 온보딩 화면으로 이동하도록 처리
    navigation.replace('OnboardingNickname');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>땅굴</Text>
          <Text style={styles.subtitle}>오늘 하루도 잘 버틴 당신을 위해</Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleLogin}>
            <Text style={styles.kakaoText}>카카오로 시작하기</Text>
          </TouchableOpacity>

          {/* 구글 로그인 버튼 */}
          <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleLogin}>
            <Text style={styles.googleText}>구글로 시작하기</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    ...theme.typography.title,
    fontSize: 40,
    color: theme.colors.brown600,
    marginBottom: 16,
  },
  subtitle: {
    ...theme.typography.bodyL_R,
    color: theme.colors.gray700,
  },
  buttonContainer: {
    gap: 12,
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButton: {
    backgroundColor: '#FEE500', // 카카오 브랜드 컬러
  },
  kakaoText: {
    ...theme.typography.bodyM_SB,
    color: '#000000',
  },
  googleButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  googleText: {
    ...theme.typography.bodyM_SB,
    color: theme.colors.black,
  },
});
