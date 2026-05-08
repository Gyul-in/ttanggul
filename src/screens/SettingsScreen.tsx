import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { AppText } from '../components/AppText';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="subTitle" color="gray900">설정</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
