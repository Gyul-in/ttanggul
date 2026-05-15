import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { colors } from '../theme';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';

interface CloverModalProps {
  visible: boolean;
  onReceive: () => void;
}

export default function CloverModal({ visible, onReceive }: CloverModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onReceive}
    >
      <View style={styles.overlay}>
        {/* Do not dismiss on outside tap to force receiving */}
        <Pressable style={StyleSheet.absoluteFillObject} />
        
        <View style={styles.modalContainer}>
          <View style={styles.contentBlock}>
            <Image
              source={require('../assets/images/clover_modal_img.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <AppText variant="subTitle" color="black" style={styles.title}>
                <AppText variant="subTitle" color="primary" style={{ color: '#29903E' }}>행운의 네잎클로버</AppText>
                {' 한 개 발견!'}
              </AppText>
              <AppText variant="bodyMS_M" color="gray500" style={styles.subtitle}>
                {'두듀가 온종일 굴을 파서 찾아낸\n소중한 네잎클로버예요'}
              </AppText>
            </View>
          </View>

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onReceive}>
            <AppText variant="bodyXL_SB" color="white">
              고마워!
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: 337,
    backgroundColor: colors.bgMain,
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'stretch',
    gap: 28,
  },
  contentBlock: {
    alignItems: 'center',
  },
  headerImage: {
    width: 130,
    height: 130,
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
    alignSelf: 'stretch',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 21,
  },
  button: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
