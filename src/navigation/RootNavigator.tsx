import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingNicknameScreen from '../screens/OnboardingNicknameScreen';
import OnboardingPreferenceScreen from '../screens/OnboardingPreferenceScreen';
import OnboardingPermissionScreen from '../screens/OnboardingPermissionScreen';
import OnboardingNotificationScreen from '../screens/OnboardingNotificationScreen';
import AccountInfoScreen from '../screens/AccountInfoScreen';
import CloverScreen from '../screens/CloverScreen';
import LegalDetailScreen from '../screens/LegalDetailScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: '#F5F1E8' } }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingNickname" component={OnboardingNicknameScreen} />
      <Stack.Screen name="OnboardingPreference" component={OnboardingPreferenceScreen} />
      <Stack.Screen name="OnboardingPermission" component={OnboardingPermissionScreen} />
      <Stack.Screen name="OnboardingNotification" component={OnboardingNotificationScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
      <Stack.Screen name="Clover" component={CloverScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="LegalDetail" component={LegalDetailScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
