import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import SipUAClient, {SipUA} from '@/services/sip/SippUA';
import { updateSipState } from '@/store/sip';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Use useRef to maintain a single instance of SipUA
  const sipUARef = useRef<SipUAClient | null>(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!sipUARef.current) {
      sipUARef.current =SipUA;
      sipUARef.current.createUA();
      store.dispatch(updateSipState({key:"SipUA", value:sipUARef.current}));
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }} // Hide headers globally
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="call/connecting" />
          <Stack.Screen name="call/ongoing" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
