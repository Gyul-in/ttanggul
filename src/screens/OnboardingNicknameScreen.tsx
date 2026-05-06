import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { theme } from '../theme';

export default function OnboardingNicknameScreen({ navigation }: any) {
  const [nickname, setNickname] = useState('');

  const handleNext = () => {
    // 다음 온보딩 단계로 이동 (추후 OnboardingPreference 등 추가)
    if (nickname.trim().length > 0) {
      console.log('Nickname:', nickname);
      // navigation.navigate('OnboardingPreference');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Top Navigation Bar Placeholder */}
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {/* Pagination Tag */}
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>1/3</Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>어떤 이름으로 부를까요?</Text>

              {/* Character Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: theme.colors.brown500 }}>두듀 캐릭터 영역</Text>
              </View>

              {/* Input Field */}
              <View style={styles.inputSection}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>닉네임</Text>
                  <Text style={styles.asterisk}>*</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="닉네임을 입력해 주세요"
                  placeholderTextColor={theme.colors.brown600}
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Bottom CTA Button */}
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
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.brown100,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  navBar: {
    height: 56,
    justifyContent: 'center',
    paddingVertical: 7,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.gray900,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  tagContainer: {
    backgroundColor: theme.colors.brown200,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagText: {
    ...theme.typography.tag,
    color: theme.colors.brown500,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.black,
    marginBottom: 30,
  },
  imagePlaceholder: {
    width: 175,
    height: 175,
    backgroundColor: theme.colors.brown200,
    borderRadius: 87.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputSection: {
    width: '100%',
    gap: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...theme.typography.bodyM_SB,
    color: theme.colors.gray700,
  },
  asterisk: {
    ...theme.typography.bodyM_SB,
    color: theme.colors.error,
  },
  textInput: {
    height: 54,
    backgroundColor: theme.colors.brown200,
    borderRadius: 8,
    paddingHorizontal: 16,
    ...theme.typography.bodyL_R,
    color: theme.colors.black,
  },
  bottomContainer: {
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
    backgroundColor: theme.colors.gray700,
    opacity: 0.5,
  },
  ctaButtonText: {
    ...theme.typography.bodyXL_SB,
    color: theme.colors.white,
  },
});
