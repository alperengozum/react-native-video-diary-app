import {View} from "react-native";
import {useCroppedVideoStore} from "~/store/CroppedVideoStore";
import {Video} from "~/domain/Video";
import {ScrollView} from "react-native-reanimated/src/Animated";
import {VideoList} from "~/components/video/VideoList";
import {UploadButton} from "~/components/video/UploadButton";
import {useRouter} from "expo-router";
import * as picker from 'expo-image-picker';

export default function MainScreen() {
	const router = useRouter();
	const updateVideo = useCroppedVideoStore((state) => state.updateVideo);

	const pickVideo = async () => {
		let result = await picker.launchImageLibraryAsync({
			mediaTypes: "videos",
			allowsEditing: true
		});

		if (!result.canceled) {
			updateVideo("0", {
				uri: result.assets[0].uri,
				id: "0",
			})
			return result.assets[0].uri;
		}
	}
	const onUploadPress = async () => {
		const uri = await pickVideo()
		if (!uri) {
			//TODO: Show an error message
			return;
		}
		router.navigate(`/crop/0`);
	}

	const videos: Video[] = useCroppedVideoStore((state) => state.videos);
	return (
		<View className={"flex flex-1 bg-white"}>
			<ScrollView>
				<VideoList videos={videos} containerClassName={"flex-1"}/>
			</ScrollView>
			<UploadButton title={"Upload Video"} onPress={onUploadPress}/>
		</View>
	)
}
