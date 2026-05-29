import { useEffect, useCallback, useRef } from 'react';
import { LogBox, View, Platform, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { SaveProvider } from './src/context/SaveContext';
import { UIProvider } from './src/context/UIContext';
import { useUserStore } from './src/store/useUserStore';
import { setupNotificationChannel, replenishRandomNotifications } from './src/services/notificationService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();
setupNotificationChannel();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./src/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./src/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./src/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./src/assets/fonts/Pretendard-Bold.otf'),
  });

  const handledNotifIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const { isNotificationOn, notificationTime } = useUserStore.getState();
    if (isNotificationOn && notificationTime === '랜덤') {
      replenishRandomNotifications();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || Platform.Version < 31) return;
    const { isNotificationOn, hasRequestedExactAlarm, setHasRequestedExactAlarm } = useUserStore.getState();
    if (!isNotificationOn || hasRequestedExactAlarm) return;

    Alert.alert(
      '정확한 알림 시간 설정',
      '설정한 시간에 정확히 알림을 받으려면 "알람 및 리마인더" 권한이 필요해요.',
      [
        { text: '나중에', style: 'cancel' },
        {
          text: '설정하기',
          onPress: () => Linking.sendIntent('android.settings.REQUEST_SCHEDULE_EXACT_ALARM'),
        },
      ]
    );
    setHasRequestedExactAlarm(true);
  }, []);

  useEffect(() => {
    const saveNotification = (title: string, id: string) => {
      if (!title || handledNotifIds.current.has(id)) return;
      handledNotifIds.current.add(id);
      useUserStore.getState().addNotification({
        text: title,
        category: '위로',
        receivedAt: new Date().toISOString(),
      });
    };

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title ?? '';
      saveNotification(title, notification.request.identifier);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const title = response.notification.request.content.title ?? '';
      saveNotification(title, response.notification.request.identifier);
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E8' }}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <UIProvider>
          <SaveProvider>
            <NavigationContainer theme={{ dark: false, colors: { background: '#F5F1E8', primary: '#F5F1E8', card: '#F5F1E8', text: '#111111', border: 'transparent', notification: '#F5F1E8' }, fonts: { regular: { fontFamily: 'Pretendard-Regular', fontWeight: '400' }, medium: { fontFamily: 'Pretendard-Medium', fontWeight: '500' }, bold: { fontFamily: 'Pretendard-SemiBold', fontWeight: '600' }, heavy: { fontFamily: 'Pretendard-SemiBold', fontWeight: '700' } } }}>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SaveProvider>
        </UIProvider>
      </SafeAreaProvider>
    </View>
  );
}
