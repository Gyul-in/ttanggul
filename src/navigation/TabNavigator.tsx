import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import HomeScreen from '../screens/HomeScreen';
import SaveScreen from '../screens/SaveScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, {
          height: 74 + insets.bottom,
          paddingBottom: insets.bottom,
        }],
        tabBarActiveTintColor: colors.gray900,
        tabBarInactiveTintColor: colors.gray300,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Save"
        component={SaveScreen}
        options={{
          title: '보관함',
          tabBarIcon: ({ color }) => <AppIcon name="heart-filled" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <AppIcon name="home-filled" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <AppIcon name="settings-filled" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 0,
    paddingTop: 8,
    paddingHorizontal: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 80,
  },
  tabLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 18,
  },
});
