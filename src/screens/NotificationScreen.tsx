import { View, Image, StyleSheet, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppText } from '../components/AppText';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function NotificationScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <NavigationBar
        type="default"
        title="알림"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.body}>
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../assets/illustrations/Sleep.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textBlock}>
          <AppText variant="subTitle" color="gray900" style={styles.textCenter}>
            행운 배달 시간이 정해지지 않았어요!
          </AppText>
          <AppText variant="bodyM_R" color="gray600" style={styles.textCenter}>
            {'알림을 설정해두면 매일 잊지 않고\n따뜻한 행운의 문장을 전해드릴게요.'}
          </AppText>
        </View>

        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
          onPress={() => navigation.navigate('Settings')}
        >
          <AppText variant="bodyM_SB" color="white">알림 시간 설정하기</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 40,
  },
  illustrationWrapper: {
    width: 187,
    height: 210,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  illustration: {
    width: 187,
    height: 187,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
    marginTop: -20,
  },
  textCenter: {
    textAlign: 'center',
  },
  ctaBtn: {
    width: 260,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.gray900,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnPressed: {
    opacity: 0.8,
  },
});
