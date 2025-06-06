import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export const unstable_settings = {
  initialRouteName: 'index',
};

const queryClient = new QueryClient()


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Video Diary App", headerBackVisible: false }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Edit Metadata', presentation: 'modal' }} />
        <Stack.Screen name="detail/[id]" options={{ title: 'Detail', presentation: 'modal' }} />
        <Stack.Screen name="crop/[id]" options={{ title: 'Crop Video', presentation: 'modal' }} />
      </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
