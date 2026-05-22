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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import TermsBottomSheet from '../components/TermsBottomSheet';
import { AppText } from '../components/AppText';
import { useUserStore } from '../store/useUserStore';

export default function OnboardingNicknameScreen({ navigation }: any) {
  const [nickname, setNicknameState] = useState('');
  const [showTerms, setShowTerms] = useState(true);
  const [hasError, setHasError] = useState(false);
  const insets = useSafeAreaInsets();
  const setNickname = useUserStore((state) => state.setNickname);

  const handleChangeText = (text: string) => {
    if (text.length <= 6) {
      setNicknameState(text);
      setHasError(text.length === 6);
    }
  };

  const handleNext = () => {
    if (nickname.trim().length > 0) {
      setNickname(nickname.trim());
      navigation.navigate('OnboardingPreference');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            {/* 상단 네비 바 */}
            <View style={styles.navBar}>
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
                    placeholder="최대 6자까지 입력할 수 있어요"
                    placeholderTextColor={theme.colors.brown600}
                    value={nickname}
                    onChangeText={handleChangeText}
                    textAlignVertical="center"
                  />
                  {hasError && (
                    <AppText variant="bodyM_R" style={styles.errorText}>
                      최대 6자까지 입력할 수 있어요
                    </AppText>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* 하단 다음 버튼 - KeyboardAvoidingView 밖으로 이동하여 고정 */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(16, insets.bottom) }]}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            (nickname.trim().length === 0 || hasError) && styles.ctaButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={nickname.trim().length === 0 || hasError}
        >
          <Text style={styles.ctaButtonText}>다음</Text>
        </TouchableOpacity>
      </View>

      <TermsBottomSheet
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        onConfirm={() => {
          // You can save the marketingAgreed preference here if needed
          setShowTerms(false);
        }}
      />
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
    height: 54,
    backgroundColor: theme.colors.brown200,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    includeFontPadding: false,
    color: theme.colors.black,
  },

  errorText: {
    color: '#F53434',
  },

  /* 하단 버튼 */
  bottomContainer: {
    paddingHorizontal: 16,
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
