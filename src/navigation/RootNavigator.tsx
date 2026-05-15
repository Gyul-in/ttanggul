import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingNicknameScreen from '../screens/OnboardingNicknameScreen';
import OnboardingPreferenceScreen from '../screens/OnboardingPreferenceScreen';
import OnboardingNotificationScreen from '../screens/OnboardingNotificationScreen';
<<<<<<< HEAD
=======
import NotificationScreen from '../screens/NotificationScreen';
import CloverScreen from '../screens/CloverScreen';
>>>>>>> 021acc2cb1618ea296ad6af5c035bfe6138e6c7c
import AccountInfoScreen from '../screens/AccountInfoScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: '#F5F1E8' } }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingNickname" component={OnboardingNicknameScreen} />
      <Stack.Screen name="OnboardingPreference" component={OnboardingPreferenceScreen} />
      <Stack.Screen name="OnboardingNotification" component={OnboardingNotificationScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
<<<<<<< HEAD
=======
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Clover" component={CloverScreen} />
>>>>>>> 021acc2cb1618ea296ad6af5c035bfe6138e6c7c
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
    </Stack.Navigator>
  );
}
