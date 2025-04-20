import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import {useLocalSearchParams} from "expo-router";

export default function Modal() {
	const {id} = useLocalSearchParams();
	return (
		<>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</>
	);
}
