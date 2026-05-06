import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OnboardingNicknameScreen from '../screens/OnboardingNicknameScreen';
import OnboardingPreferenceScreen from '../screens/OnboardingPreferenceScreen';
import OnboardingNotificationScreen from '../screens/OnboardingNotificationScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingNickname" component={OnboardingNicknameScreen} />
      <Stack.Screen name="OnboardingPreference" component={OnboardingPreferenceScreen} />
      <Stack.Screen name="OnboardingNotification" component={OnboardingNotificationScreen} />
    </Stack.Navigator>
  );
}
