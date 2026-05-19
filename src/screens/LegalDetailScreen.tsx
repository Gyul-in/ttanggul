import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppText } from '../components/AppText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
};

const LEGAL_CONTENTS: Record<string, string> = {
  '개인정보 처리방침': `땅굴(이하 '서비스')은 이용자의 개인정보를 소중히 다루며, 개인정보보호법 등 관련 법령을 준수하고 있습니다.

1. 수집하는 개인정보 항목
• 필수항목: 닉네임, 서비스 이용 기록, 접속 로그, 쿠키, 단말기 정보 (OS 버전 등)

2. 개인정보의 수집 및 이용 목적
• 서비스 제공 및 회원 식별
• 서비스 개선, 신규 기능 개발 및 맞춤형 글귀 추천
• 고객 의견 수렴 및 문의 응대

3. 개인정보의 보유 및 이용 기간
• 이용자의 개인정보는 서비스 이용 기간 동안 안전하게 보존되며, 회원 탈퇴 시 또는 목적 달성 시 지체 없이 파기합니다.
• 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 정한 일정 기간 보관합니다.`,

  '이용 약관': `제 1 조 (목적)
본 약관은 '땅굴' 서비스(이하 '서비스')의 이용 조건 및 절차, 회원과 서비스 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

제 2 조 (용어의 정의)
1. "서비스"라 함은 제공되는 '땅굴' 모바일 어플리케이션 및 이와 관련된 모든 서비스를 의미합니다.
2. "회원"이란 서비스에 접속하여 본 약관에 동의하고 계정을 등록한 사용자를 말합니다.

제 3 조 (약관의 효력 및 변경)
1. 본 약관은 서비스 내에 게시하여 회원에게 공시함으로써 효력이 발생합니다.
2. 서비스는 필요하다고 인정되는 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 변경된 약관은 공지사항을 통해 공지합니다.`,

  '마케팅 정보 수신': `땅굴 서비스의 맞춤형 혜택 정보 및 이벤트 소식 등 마케팅 정보 수신에 관한 안내입니다.

1. 수집 및 이용 목적
• 땅굴 서비스 관련 신규 릴리즈 기능 및 업데이트 안내
• 이벤트 정보, 프로모션 참여 기회 제공
• 맞춤형 정보 및 서비스 이용 관련 혜택 제공

2. 수집하는 개인정보 항목
• 닉네임, 서비스 이용 기록, 앱 푸시 수신 여부

3. 보유 및 이용 기간
• 동의 철회 시 또는 회원 탈퇴 시까지 보유합니다.
• 본 마케팅 정보 수신 동의는 거부할 권리가 있으며, 동의를 거부하더라도 땅굴의 기본 서비스를 이용하는 데에는 아무런 제한이 없습니다. 다만, 맞춤형 혜택 및 이벤트 소식 전달은 제한될 수 있습니다.`
};

export default function LegalDetailScreen({ route, navigation }: Props) {
  const { title } = (route.params || {}) as { title: string };
  const content = LEGAL_CONTENTS[title] || '내용을 불러올 수 없습니다.';

  return (
    <View style={styles.container}>
      <NavigationBar
        title={title}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContainer}>
          <AppText variant="bodyL_M" color="gray800" style={styles.text}>
            {content}
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  textContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
  },
  text: {
    lineHeight: 26,
  },
});
