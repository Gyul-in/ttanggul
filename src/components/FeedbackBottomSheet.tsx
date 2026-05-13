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
  onClose: () => void;
  onSend?: () => void;
};

export default function FeedbackBottomSheet({ visible, onClose, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
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

  const handleClose = () => {
    setText('');
    onClose();
  };

  const handleSend = () => {
    setText('');
    onClose();
    onSend?.();
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
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* 핸들 */}
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>

          {/* 콘텐츠 */}
          <View style={styles.content}>
            <AppText variant="subTitle" color="black">
              자유롭게 의견을 작성해 주세요!
            </AppText>

            {/* 텍스트 입력 영역 */}
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="내용을 입력해 주세요"
                placeholderTextColor={colors.brown600}
                maxLength={100}
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <AppText variant="bodyS_M" style={styles.counter}>
                {text.length}/100
              </AppText>
            </View>
          </View>

          {/* 보내기 버튼 */}
          <View style={[styles.btnContainer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity
              style={styles.sendBtn}
              activeOpacity={0.7}
              onPress={handleSend}
            >
              <AppText variant="bodyXL_SB" style={styles.sendBtnText}>
                보내기
              </AppText>
            </TouchableOpacity>
          </View>
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleWrapper: {
    paddingTop: 14,
    alignItems: 'center',
  },
  handle: {
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.brown200,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 14,
    paddingHorizontal: 20,
    gap: 20,
  },
  textAreaContainer: {
    backgroundColor: colors.bgInput,
    borderRadius: 12,
    padding: 16,
    height: 177,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: colors.gray900,
    padding: 0,
  },
  counter: {
    color: colors.brown600,
    textAlign: 'right',
  },
  btnContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sendBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: colors.white,
  },
});
