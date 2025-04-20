import {Stack} from 'expo-router';
import {SafeAreaContainer} from '~/components/SafeAreaContainer';
import MainScreen from "~/screens/MainScreen";

export default function Home() {
	return (
		<>
			<Stack.Screen options={{title: "Video Diary App"}}/>
			<SafeAreaContainer>
				<MainScreen/>
			</SafeAreaContainer>
		</>
	);
}
