import { View, Image, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { NavigationBar } from '../components/NavigationBar';
import { AppText } from '../components/AppText';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CloverScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <NavigationBar
        type="default"
        title="행운 포인트"
        onBack={() => navigation.navigate('Main')}
      />

      <View style={styles.body}>
        <Image
          source={require('../assets/illustrations/clover-empty.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={styles.textBlock}>
          <AppText variant="subTitle" color="gray900" style={styles.textCenter}>
            땅굴 확장 공사 중!
          </AppText>
          <AppText variant="bodyM_R" color="gray600" style={styles.textCenter}>
            {'더 좋은 서비스를 위해 준비 중이에요. \n완성되면 가장 먼저 알려드릴게요.'}
          </AppText>
        </View>
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
    gap: 20,
  },
  illustration: {
    width: 187,
    height: 187,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  textCenter: {
    textAlign: 'center',
  },
});
