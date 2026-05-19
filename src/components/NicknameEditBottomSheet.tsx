import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppText } from './AppText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  currentNickname: string;
  onClose: () => void;
  onConfirm: (nickname: string) => void;
};

export default function NicknameEditBottomSheet({ visible, currentNickname, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState('');
  const [hasError, setHasError] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setNickname(currentNickname);
      setHasError(false);
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
  }, [visible, slideAnim]);

  const handleChangeText = (text: string) => {
    if (text.length <= 6) {
      setNickname(text);
      setHasError(text.length === 6);
    }
  };

  const handleClose = () => {
    setNickname('');
    setHasError(false);
    onClose();
  };

  const handleConfirm = () => {
    if (nickname.trim().length === 0) return;
    onConfirm(nickname.trim());
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: Math.max(16, insets.bottom),
            },
          ]}
        >
          {/* 핸들 */}
          <View style={styles.handle} />

          {/* 타이틀 */}
          <AppText variant="subTitle" color="black" style={styles.title}>
            변경할 닉네임을 입력해 주세요
          </AppText>

          {/* TextField */}
          <View style={styles.textFieldWrapper}>
            <View style={styles.labelRow}>
              <AppText variant="bodyM_SB" color="gray700">닉네임</AppText>
              <AppText variant="bodyM_SB" color="required"> *</AppText>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="최대 6자까지 입력할 수 있어요"
              placeholderTextColor={colors.brown600}
              value={nickname}
              onChangeText={handleChangeText}
            />
            {/* 에러 텍스트 - 항상 공간 유지 */}
            <AppText variant="bodyM_R" style={[styles.errorText, !hasError && styles.errorHidden]}>
              최대 6자까지 입력할 수 있어요
            </AppText>
          </View>

          {/* CTA 버튼 */}
          <TouchableOpacity
            style={[styles.confirmBtn, nickname.trim().length === 0 && styles.confirmBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleConfirm}
            disabled={nickname.trim().length === 0}
          >
            <AppText variant="bodyXL_SB" style={styles.confirmBtnText}>
              변경하기
            </AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.bgMain,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 20,
    alignItems: 'stretch',
  },
  handle: {
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.brown200,
    alignSelf: 'center',
  },
  title: {
    marginTop: 24,
  },
  textFieldWrapper: {
    marginTop: 20,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 60,
    backgroundColor: colors.bgInput,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    color: colors.black,
  },
  errorText: {
    color: '#F53434',
  },
  errorHidden: {
    opacity: 0,
  },
  confirmBtn: {
    height: 56,
    backgroundColor: colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: colors.white,
  },
});
