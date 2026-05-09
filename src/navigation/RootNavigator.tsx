import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingNicknameScreen from '../screens/OnboardingNicknameScreen';
import OnboardingPreferenceScreen from '../screens/OnboardingPreferenceScreen';
import OnboardingNotificationScreen from '../screens/OnboardingNotificationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CloverScreen from '../screens/CloverScreen';
import TabNavigator from './TabNavigator';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingNickname" component={OnboardingNicknameScreen} />
      <Stack.Screen name="OnboardingPreference" component={OnboardingPreferenceScreen} />
      <Stack.Screen name="OnboardingNotification" component={OnboardingNotificationScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Clover" component={CloverScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
}
