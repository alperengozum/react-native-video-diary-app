import { Stack } from 'expo-router';

import { SafeAreaContainer } from '~/components/SafeAreaContainer';
import { ScreenContent } from '~/components/ScreenContent';
import MainScreen from "~/screens/MainScreen";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <SafeAreaContainer>
      <MainScreen/>
      </SafeAreaContainer>
    </>
  );
}
