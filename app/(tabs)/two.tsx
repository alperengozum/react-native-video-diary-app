import { Stack } from 'expo-router';

import { SafeAreaContainer } from '~/components/SafeAreaContainer';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <SafeAreaContainer>
        <ScreenContent path="app/(tabs)/two.tsx" title="Tab Two" />
      </SafeAreaContainer>
    </>
  );
}
