import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import HomeScreen from '../screens/HomeScreen';
import SaveScreen from '../screens/SaveScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 74;
const DESIGN_WIDTH = 402;
const DESIGN_OUTER_PAD = 20;
const DESIGN_INNER_PAD = 10;
const DESIGN_ITEM_WIDTH = 88;

type TabItem = {
  name: string;
  label: string;
  icon: 'heart-filled' | 'home-filled' | 'settings-filled';
};

const TAB_ITEMS: TabItem[] = [
  { name: 'Save', label: '보관함', icon: 'heart-filled' },
  { name: 'Home', label: '홈', icon: 'home-filled' },
  { name: 'Settings', label: '설정', icon: 'settings-filled' },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const scale = screenWidth / DESIGN_WIDTH;
  const outerPad = Math.round(DESIGN_OUTER_PAD * scale);
  const innerPad = Math.round(DESIGN_INNER_PAD * scale);
  const itemWidth = Math.round(DESIGN_ITEM_WIDTH * scale);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={[styles.tabBar, { height: TAB_BAR_HEIGHT, paddingHorizontal: outerPad }]}>
        <View style={[styles.mainTab, { paddingHorizontal: innerPad }]}>
          {TAB_ITEMS.map((tab, index) => {
            const isFocused = state.index === index;
            const color = isFocused ? colors.gray900 : colors.gray300;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[index]?.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            };

            return (
              <Pressable
                key={tab.name}
                onPress={onPress}
                style={[styles.tabItem, { width: itemWidth }]}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <AppIcon name={tab.icon} size={24} color={color} />
                <AppText variant="caption" color={color}>
                  {tab.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Save" component={SaveScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 80,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    rowGap: 4,
  },
});
