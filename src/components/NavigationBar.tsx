import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { TangulLogo } from './TangulLogo';

type NavigationBarProps = {
  type?: 'default' | 'logo';
  title?: string;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  pointCount?: number;
  onBell?: () => void;
  onClover?: () => void;
};

export function NavigationBar({
  type = 'default',
  title,
  onBack,
  showMenu,
  onMenu,
  pointCount = 0,
  onBell,
  onClover,
}: NavigationBarProps) {
  const insets = useSafeAreaInsets();

  if (type === 'logo') {
    return (
      <View style={[styles.safeTop, { paddingTop: insets.top }]}>
        <View style={styles.bar}>
          <TangulLogo width={43} height={21} />
          <View style={styles.logoRight}>
            <Pressable style={styles.pointBadge} onPress={onClover} hitSlop={8}>
              <AppIcon name="clover" size={24} color={colors.primary} />
              <AppText variant="bodyL_SB" color="brown800">{pointCount}</AppText>
            </Pressable>
            <Pressable onPress={onBell} hitSlop={8}>
              <AppIcon name="bell" size={24} color={colors.gray700} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safeTop, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.iconSlot}>
          <AppIcon name="chevron-left" size={24} color={colors.black} />
        </Pressable>
        <AppText variant="subTitle" color="black">{title}</AppText>
        <Pressable onPress={onMenu} hitSlop={12} style={styles.iconSlot}>
          {showMenu && <AppIcon name="menu" size={24} color={colors.black} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: colors.bgMain,
  },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
});
