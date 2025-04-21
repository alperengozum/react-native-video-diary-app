import {View, Text, TouchableOpacity} from "react-native";
import {useCroppedVideoStore} from "~/store/CroppedVideoStore";
import {Video} from "~/domain/Video";
import {ScrollView} from "react-native-reanimated/src/Animated";
import {VideoList} from "~/components/video/VideoList";
import {UploadButton} from "~/components/video/UploadButton";
import {useRouter} from "expo-router";
import * as picker from 'expo-image-picker';
import {useSelectedVideoStore} from "~/store/SelectedVideoStore";

export default function MainScreen() {
	const router = useRouter();
	const setVideo = useSelectedVideoStore((state) => state.setVideo);

	const pickVideo = async () => {
		let result = await picker.launchImageLibraryAsync({
			mediaTypes: "videos",
			allowsEditing: true
		});

		if (!result.canceled) {
			setVideo({
				uri: result.assets[0].uri,
			});

			return result.assets[0].uri;
		}
	}

	const onUploadPress = async () => {
		const uri: string | undefined = await pickVideo();
		if (!uri) {
			return;
		}
		router.navigate(`/crop/new`);
	}

	const videos: Video[] = useCroppedVideoStore((state) => state.videos);

	return (
		<View className={"flex flex-1 bg-white"}>
			{videos.length === 0 ? (
				<>
					<TouchableOpacity
						className="flex-1 justify-center items-center"
						onPress={onUploadPress}
					>
						<Text className="text-gray-500 text-lg">Click to upload a video</Text>
					</TouchableOpacity>
					<UploadButton title={"Upload Video"} onPress={onUploadPress}/>
				</>
			) : (
				<>
					<ScrollView>
						<VideoList videos={videos} containerClassName={"flex-1"}/>
					</ScrollView>
					<UploadButton title={"Upload Video"} onPress={onUploadPress}/>
				</>
			)}
		</View>
	);
}
