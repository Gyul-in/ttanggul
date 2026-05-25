import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { login as kakaoLogin } from '@react-native-kakao/user';

GoogleSignin.configure({
  webClientId: '788744506991-pjrkcpf2i1hi8331fgekpbq9307ka8da.apps.googleusercontent.com',
  iosClientId: '788744506991-fduobvmtmfst6t11oq749ed2nned7tnl.apps.googleusercontent.com',
});

export default function LoginScreen({ navigation }: any) {
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error('ID 토큰을 가져오지 못했어요');
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      navigation.replace('OnboardingNickname');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      Alert.alert('로그인 실패', `code: ${error.code}\nmessage: ${error.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setKakaoLoading(true);
      const token = await kakaoLogin();
      if (!token.idToken) throw new Error('idToken이 없어요. OpenID Connect 설정을 확인해주세요.');
      const provider = new OAuthProvider('oidc.kakao');
      const credential = provider.credential({ idToken: token.idToken });
      await signInWithCredential(auth, credential);
      navigation.replace('OnboardingNickname');
    } catch (error: any) {
      Alert.alert('로그인 실패', error?.message ?? '카카오 로그인 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setKakaoLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      {/*
        피그마: Frame 2134282015 - y=54(after status bar), height=777
        Frame 2134282021 - y=109.5, height=598 → paddingTop:109.5, paddingBottom:69.5
      */}
      <View style={styles.mainFrame}>
        {/*
          Frame 2134282021: paddingVertical:21 / justifyContent:space-between
          upperGroup(399.75) + gap(40) + buttonGroup(116)
        */}
        <View style={styles.contentGroup}>

          {/*
            Frame 2147227996: title(78) + gap(83) + character(238.75)
          */}
          <View style={styles.upperGroup}>
            <Text style={styles.title}>반가워요!{'\n'}두듀가 기다리고 있어요</Text>
            <Image
              source={require('../assets/images/login_character.png')}
              style={styles.character}
              resizeMode="cover"
            />
          </View>

          {/* Frame 2134282020: gap 8 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleKakaoLogin} activeOpacity={0.8} disabled={kakaoLoading || googleLoading}>
              {kakaoLoading ? (
                <ActivityIndicator size="small" color="#424242" />
              ) : (
                <>
                  <Image source={require('../assets/images/icon_kakao.png')} style={styles.buttonIcon} />
                  <Text style={styles.kakaoText}>카카오톡으로 계속하기</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleGoogleLogin} activeOpacity={0.8} disabled={kakaoLoading || googleLoading}>
              {googleLoading ? (
                <ActivityIndicator size="small" color="#424242" />
              ) : (
                <>
                  <Image source={require('../assets/images/icon_google.png')} style={styles.buttonIcon} />
                  <Text style={styles.googleText}>구글로 계속하기</Text>
                </>
              )}
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
  // Frame 2134282015: paddingTop 109.5 / paddingBottom 69.5 / paddingHorizontal 20
  mainFrame: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 110,
    paddingBottom: 70,
  },
  // Frame 2134282021: paddingVertical 21 / space-between
  contentGroup: {
    flex: 1,
    paddingVertical: 21,
    justifyContent: 'space-between',
  },
  // Frame 2147227996: column / gap 83
  upperGroup: {
    gap: 83,
  },
  // title: SemiBold 28px / lineHeight 140% / #393B38
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    lineHeight: 39.2,
    letterSpacing: -0.28,
    textAlign: 'center',
    color: '#393B38',
  },
  // character: width fill / height 238.75
  character: {
    width: '100%',
    height: 239,
  },
  // Frame 2134282020: gap 8
  buttonGroup: {
    gap: 8,
  },
  // 공통 버튼: height 54 / borderRadius 8 / row / center
  loginButton: {
    height: 54,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 36,
    height: 36,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  googleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
});
