import { useEffect, useCallback, useRef } from 'react';
import { LogBox, View } from 'react-native';
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
import { initializeKakaoSDK } from '@react-native-kakao/core';
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
initializeKakaoSDK('d7ab736fbfd5229a5ec40952a58da3a7');
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
    replenishRandomNotifications();
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

    // 앱 포그라운드 상태에서 알림 수신
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title ?? '';
      saveNotification(title, notification.request.identifier);
    });

    // 백그라운드/종료 상태에서 알림 탭
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
