import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // 2초 정도 스플래시 화면을 유지한 후 로그인 상태 체크
    const timer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // 이미 로그인된 상태라면 메인 화면(또는 온보딩)으로 이동
          navigation.replace('OnboardingNickname'); 
        } else {
          // 로그인되지 않았다면 로그인 화면으로 이동
          navigation.replace('Login');
        }
      });

      // 컴포넌트 언마운트 시 리스너 해제 (혹은 타임아웃 해제 전 전환될 경우)
      return () => unsubscribe();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>취준생을 위한{'\n'}데일리 위로</Text>
          <Image 
            source={require('../assets/images/ddanggul_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Image 
          source={require('../assets/images/splash_character.png')} 
          style={styles.character}
          resizeMode="cover"
        />
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
    alignItems: 'center',
    paddingTop: 93,
    gap: 140, // 텍스트 영역과 캐릭터 사이의 정확한 간격
  },
  textContainer: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    lineHeight: 39.2, // 140%
    letterSpacing: -0.28, // -1%
    textAlign: 'center',
    color: '#393B38',
  },
  logo: {
    width: 353, // 캔버스 전체 넓이에 맞춰 원본 크기 유지
    height: 32,
  },
  character: {
    width: 635, // 피그마 원본 너비 반영 (화면 양옆으로 자연스럽게 넘어감)
    height: 264,
  },
});
