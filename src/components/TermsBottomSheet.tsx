import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { AppIcon } from './AppIcon';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (marketingAgreed: boolean) => void;
};

export default function TermsBottomSheet({ visible, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [thirdPartyAgreed, setThirdPartyAgreed] = useState(true);
  const [marketingAgreed, setMarketingAgreed] = useState(true);

  const allAgreed = privacyAgreed && thirdPartyAgreed && marketingAgreed;
  const isCtaEnabled = privacyAgreed && thirdPartyAgreed;

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

  const handleToggleAll = () => {
    const newValue = !allAgreed;
    setPrivacyAgreed(newValue);
    setThirdPartyAgreed(newValue);
    setMarketingAgreed(newValue);
  };

  const handleConfirm = () => {
    if (isCtaEnabled) {
      onConfirm(marketingAgreed);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Do not dismiss on press */}
        <Pressable style={StyleSheet.absoluteFill} />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: Math.max(16, insets.bottom),
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.title}>
            {'두듀님!\n원활한 이용을 위해 동의가 필요해요'}
          </Text>

          <View style={styles.contentContainer}>
            {/* All Agree Button */}
            <TouchableOpacity
              style={[styles.allAgreeCard, allAgreed && styles.allAgreeCardActive]}
              activeOpacity={0.8}
              onPress={handleToggleAll}
            >
              <View style={{ position: 'relative', width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                <AppIcon
                  name={allAgreed ? 'checkbox-m-on' : 'checkbox-m-off'}
                  size={20}
                  color={allAgreed ? theme.colors.brown100 : theme.colors.brown300}
                />
                {!allAgreed && (
                  <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <AppIcon
                      name="check"
                      size={12}
                      strokeWidth={3}
                      color={theme.colors.brown300}
                    />
                  </View>
                )}
              </View>
              <Text style={[styles.allAgreeText, allAgreed && styles.allAgreeTextActive]}>
                약관 전체 동의
              </Text>
            </TouchableOpacity>

            {/* Individual Terms */}
            <View style={styles.termsList}>
              <TermItem
                title="개인정보 수집 및 이용 동의 (필수)"
                checked={privacyAgreed}
                onToggle={() => setPrivacyAgreed(!privacyAgreed)}
              />
              <TermItem
                title="제 3자 정보 제공 동의 (필수)"
                checked={thirdPartyAgreed}
                onToggle={() => setThirdPartyAgreed(!thirdPartyAgreed)}
              />
              <TermItem
                title="마케팅 정보 수신 동의 (선택)"
                checked={marketingAgreed}
                onToggle={() => setMarketingAgreed(!marketingAgreed)}
              />
            </View>
          </View>

          {/* Bottom CTA */}
          <TouchableOpacity
            style={[styles.ctaButton, !isCtaEnabled && styles.ctaButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleConfirm}
            disabled={!isCtaEnabled}
          >
            <Text style={styles.ctaButtonText}>다음</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

function TermItem({ title, checked, onToggle }: { title: string; checked: boolean; onToggle: () => void }) {
  return (
    <View style={styles.termItem}>
      <TouchableOpacity style={styles.termRow} activeOpacity={0.8} onPress={onToggle}>
        <AppIcon
          name="check"
          size={16}
          strokeWidth={3}
          color={checked ? theme.colors.primary : theme.colors.brown300}
        />
        <Text style={styles.termTitle}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <AppIcon name="chevron-right" size={20} color={theme.colors.gray500} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: theme.colors.brown100,
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
    backgroundColor: theme.colors.brown200,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: theme.colors.black,
    marginTop: 24,
  },
  contentContainer: {
    marginTop: 24,
    gap: 20,
  },
  allAgreeCard: {
    height: 56,
    backgroundColor: theme.colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  allAgreeCardActive: {
    backgroundColor: theme.colors.brown500,
  },
  allAgreeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: theme.colors.gray800,
  },
  allAgreeTextActive: {
    color: theme.colors.white,
  },
  termsList: {
    gap: 16,
    paddingHorizontal: 8,
  },
  termItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  termTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    lineHeight: 22.5,
    color: theme.colors.gray600,
  },
  ctaButton: {
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
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
