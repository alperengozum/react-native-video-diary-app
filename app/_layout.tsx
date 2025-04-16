import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail-modal" options={{ title: 'Detail', presentation: 'modal' }} />
        <Stack.Screen name="edit-modal" options={{ title: 'Edit', presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
