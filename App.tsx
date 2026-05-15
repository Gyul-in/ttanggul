import { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { SaveProvider } from './src/context/SaveContext';
import { UIProvider } from './src/context/UIContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./src/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./src/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./src/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./src/assets/fonts/Pretendard-Bold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
  );
}
