import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { ScrollbarView } from '../components/ScrollbarView';
import { AppText } from '../components/AppText';
import { AppIcon } from '../components/AppIcon';
import { auth } from '../services/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { logout as kakaoLogout } from '@react-native-kakao/user';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AccountInfoScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const user = auth.currentUser;
  const providerId = user?.providerData?.[0]?.providerId;
  const isKakao = providerId === 'oidc.kakao';
  const email = user?.email || (isKakao ? '카카오 계정' : '');
  const providerLabel = providerId === 'google.com' ? 'Google' : isKakao ? 'Kakao' : '소셜 로그인';

  const handleLogout = async () => {
    try {
      if (providerId === 'google.com') await GoogleSignin.signOut();
      if (isKakao) await kakaoLogout();
      await auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    } catch (e) {
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (providerId === 'google.com') await GoogleSignin.signOut();
      if (isKakao) await kakaoLogout();
      await user?.delete();
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    } catch (e) {
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={[styles.navBar, { paddingTop: insets.top }]}>
        <View style={styles.navInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.navIcon}>
            <AppIcon name="chevron-left" size={24} color={colors.gray700} />
          </TouchableOpacity>
          <AppText variant="subTitle" color="black">계정 정보</AppText>
          <View style={styles.navIcon} />
        </View>
      </View>

      {/* Main Content */}
      <ScrollbarView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainContainer}>
          {/* 이메일 섹션 */}
          <View style={styles.section}>
            <View style={styles.subHeader}>
              <AppText variant="bodyS_SB" color="gray600">이메일</AppText>
            </View>
            <View style={styles.listItem}>
              <AppText variant="bodyL_M" color="gray900">{email}</AppText>
            </View>
          </View>

          {/* 로그인 정보 섹션 */}
          <View style={styles.section}>
            <View style={styles.subHeader}>
              <AppText variant="bodyS_SB" color="gray600">로그인 정보</AppText>
            </View>
            <View style={styles.listItem}>
              <AppText variant="bodyL_M" color="gray900">{providerLabel}</AppText>
            </View>
          </View>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}
          >
            <AppText variant="bodyL_M" color="gray700">로그아웃</AppText>
          </TouchableOpacity>
        </View>
      </ScrollbarView>

      {/* 하단 영역 */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7} onPress={() => setDeleteModalVisible(true)}>
          <AppText variant="bodyXL_SB" style={styles.deleteBtnText}>탈퇴하기</AppText>
        </TouchableOpacity>
      </View>

      {/* 탈퇴하기 확인 모달 */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDeleteModalVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={styles.modalContent}>
              <Image
                source={require('../../assets/illustrations/modal-delete.png')}
                style={styles.modalIllustration}
                resizeMode="contain"
              />
              <View style={styles.modalTextGroup}>
                <AppText variant="subTitle" color="black" style={styles.modalTitle}>
                  정말 탈퇴할까요?
                </AppText>
                <AppText variant="bodyMS_M" color="gray500" style={styles.modalSubtitle}>
                  {"지금 탈퇴하면 그동안 모은 네잎클로버와\n위로 메시지들이 모두 사라져요"}
                </AppText>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnLogout}
                activeOpacity={0.7}
                onPress={handleDeleteAccount}
              >
                <AppText variant="bodyXL_SB" color="gray700">탈퇴하기</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnDeleteCancel}
                activeOpacity={0.7}
                onPress={() => setDeleteModalVisible(false)}
              >
                <AppText variant="bodyXL_SB" style={styles.cancelBtnText}>취소하기</AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 로그아웃 확인 모달 */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={styles.modalContent}>
              <Image
                source={require('../../assets/illustrations/modal-logout.png')}
                style={styles.modalIllustration}
                resizeMode="contain"
              />
              <View style={styles.modalTextGroup}>
                <AppText variant="subTitle" color="black" style={styles.modalTitle}>
                  로그아웃 할까요?
                </AppText>
                <AppText variant="bodyMS_M" color="gray500" style={styles.modalSubtitle}>
                  {"걱정 마세요. 클로버들은 숲에서 안전하게\n보관하고 있을게요"}
                </AppText>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnLogout}
                activeOpacity={0.7}
                onPress={handleLogout}
              >
                <AppText variant="bodyXL_SB" color="gray700">로그아웃</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                activeOpacity={0.7}
                onPress={() => setLogoutModalVisible(false)}
              >
                <AppText variant="bodyXL_SB" style={styles.cancelBtnText}>취소하기</AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  navBar: {
    backgroundColor: colors.bgMain,
  },
  navInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  section: {},
  subHeader: {
    height: 21,
    justifyContent: 'center',
  },
  listItem: {
    paddingVertical: 16,
    justifyContent: 'center',
  },
  logoutBtn: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    backgroundColor: colors.bgMain,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  deleteBtn: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#F53434',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: 337,
    backgroundColor: colors.bgMain,
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 28,
  },
  modalContent: {
    alignItems: 'center',
    gap: 20,
  },
  modalIllustration: {
    width: 84,
    height: 58,
  },
  modalTextGroup: {
    alignItems: 'center',
    gap: 4,
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalSubtitle: {
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  modalBtnLogout: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: colors.white,
  },
  modalBtnDeleteCancel: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.errorBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
