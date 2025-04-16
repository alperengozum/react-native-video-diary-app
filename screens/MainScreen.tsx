import {View} from "react-native";
import {useVideoStore} from "~/store/VideoStore";
import {Video} from "~/domain/Video";
import {ScrollView} from "react-native-reanimated/src/Animated";
import {VideoList} from "~/components/video/VideoList";
import {UploadButton} from "~/components/video/UploadButton";
import {useRouter} from "expo-router";
import * as picker from 'expo-image-picker';
import {useState} from "react";

export default function MainScreen() {
	const router = useRouter();

	const [video, setVideo] = useState<Video | null>(null);

	const pickVideo = async () => {
		let result = await picker.launchImageLibraryAsync({
			mediaTypes: "videos",
			allowsEditing: true
		});

		if (!result.canceled) {
			setVideo({
				name: result.assets[0].fileName || "video.mp4",
				description: "Description",
				uri: result.assets[0].uri,
			});
		}
	}
	const onUploadPress = async () => {
		await pickVideo()
		router.navigate("/edit-modal");
		useVideoStore.getState().addVideo({
			name: `Video ${Math.random()}`,
			description: `Description ${Math.random()}`,
		})
	}

	const videos: Video[] = useVideoStore((state) => state.videos);
	return (
		<View className={"flex flex-1 bg-white"}>
			<ScrollView>
				<VideoList videos={videos} containerClassName={"flex-1"}/>
			</ScrollView>
			<UploadButton title={"Upload Video"} onPress={onUploadPress}/>
		</View>
	)
}
