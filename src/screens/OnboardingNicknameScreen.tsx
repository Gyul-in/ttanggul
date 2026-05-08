import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function OnboardingNicknameScreen({ navigation }: any) {
  const [nickname, setNickname] = useState('');

  const handleNext = () => {
    if (nickname.trim().length > 0) {
      navigation.navigate('OnboardingPreference');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            {/* 상단 네비 바 */}
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>

            {/*
              피그마: Frame 2134281005 (layout_8N33IZ)
              padding: 0 20px / gap: 40px / fill both
            */}
            <View style={styles.scrollContent}>

              {/*
                피그마: Frame 2134282016 (layout_GFF6XC)
                column / center / gap: 30px / padding-top: 10px
              */}
              <View style={styles.mainGroup}>

                {/*
                  피그마: Frame 2134281003 (layout_EAROML)
                  column / center / gap: 16px
                */}
                <View style={styles.headerGroup}>
                  {/* 1/3 태그 */}
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>1/3</Text>
                  </View>
                  {/* 타이틀 */}
                  <Text style={styles.title}>어떤 이름으로 부를까요?</Text>
                </View>

                {/* 두듀 캐릭터 이미지 - 피그마 175×175 crop */}
                <View style={styles.characterContainer}>
                  <Image
                    source={require('../assets/images/dudyu_sleepy.png')}
                    style={styles.characterImage}
                    resizeMode="stretch"
                  />
                </View>

                {/*
                  피그마: Text Field (layout_8W2XVW)
                  column / gap: 6px / width: 362
                */}
                <View style={styles.textFieldWrapper}>
                  {/* 라벨 행 - row / gap: 4px */}
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>닉네임</Text>
                    <Text style={styles.asterisk}>*</Text>
                  </View>
                  {/* 인풋 - padding: 15px 16px */}
                  <TextInput
                    style={styles.textInput}
                    placeholder="닉네임을 입력해 주세요"
                    placeholderTextColor={theme.colors.brown600}
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={10}
                    textAlignVertical="center"
                  />
                </View>
              </View>
            </View>

            {/* 하단 다음 버튼 */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  nickname.trim().length === 0 && styles.ctaButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={nickname.trim().length === 0}
              >
                <Text style={styles.ctaButtonText}>다음</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.brown100 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  /* 네비 바 */
  navBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  backButton: { padding: 10, marginLeft: -10 },
  backButtonText: { fontSize: 24, color: theme.colors.gray900 },

  /* 피그마 layout_8N33IZ: padding 0 20px */
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  /* 피그마 layout_GFF6XC: column / center / gap 30 / paddingTop 10 */
  mainGroup: {
    alignItems: 'center',
    paddingTop: 10,
    gap: 30,
  },

  /* 피그마 layout_EAROML: column / center / gap 16 */
  headerGroup: {
    alignItems: 'center',
    gap: 16,
    alignSelf: 'stretch',
  },

  /* 태그 - Brown/200 bg, borderRadius 8, padding 4 12 */
  tagBadge: {
    backgroundColor: theme.colors.brown200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.brown500,
    letterSpacing: -0.3,
  },

  /* 타이틀 - SemiBold 26px, center */
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
    color: theme.colors.black,
    textAlign: 'center',
  },

  /* 캐릭터 이미지 - 피그마 175×175 crop (이미지 원본 366×458, offset -95.5,-141) */
  characterContainer: {
    width: 175,
    height: 175,
    overflow: 'hidden',
  },
  characterImage: {
    width: 366,
    height: 458,
    position: 'absolute',
    left: -95.5,
    top: -141,
  },

  /* 피그마 layout_8W2XVW: column / gap 6 / width 362 */
  textFieldWrapper: {
    width: 362,
    gap: 6,
  },

  /* 피그마 label row: row / gap 4 */
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.gray700,
  },
  asterisk: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.error,
  },

  /* 피그마 layout_OLRUPW: padding 15 16 / Brown/200 bg / borderRadius 8 */
  textInput: {
    height: 54, // 고정 높이 - 입력 전후 크기 변동 방지
    backgroundColor: theme.colors.brown200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    lineHeight: 25,
    color: theme.colors.black,
  },

  /* 하단 버튼 */
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: theme.colors.white,
  },
});
