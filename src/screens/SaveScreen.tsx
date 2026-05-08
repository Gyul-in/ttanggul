import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { AppText } from '../components/AppText';

export default function SaveScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="subTitle" color="gray900">보관함</AppText>
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
