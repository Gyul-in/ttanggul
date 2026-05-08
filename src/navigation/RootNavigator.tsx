import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingNicknameScreen from '../screens/OnboardingNicknameScreen';
import OnboardingPreferenceScreen from '../screens/OnboardingPreferenceScreen';
import OnboardingNotificationScreen from '../screens/OnboardingNotificationScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingNickname" component={OnboardingNicknameScreen} />
      <Stack.Screen name="OnboardingPreference" component={OnboardingPreferenceScreen} />
      <Stack.Screen name="OnboardingNotification" component={OnboardingNotificationScreen} />
    </Stack.Navigator>
  );
}
