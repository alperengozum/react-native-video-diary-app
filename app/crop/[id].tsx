import {StatusBar} from 'expo-status-bar';
import {Platform} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import {useCroppedVideoStore} from "~/store/CroppedVideoStore";
import {Video} from "~/domain/Video";
import VideoCropperContainer from "~/components/video/VideoCropperContainer";
import {useSelectedVideoStore} from "~/store/SelectedVideoStore";

export default function CropModal() {
	const {id} = useLocalSearchParams();
	const router = useRouter();
	let video: Video | undefined;
	const updateSelectedVideo = useSelectedVideoStore((state) => (state.setVideo));
	const updateVideo = useCroppedVideoStore((state) => (state.updateVideo));

	switch (id) {
		case "new":
			video = useSelectedVideoStore((state) => state.video);
			break;
		default:
			video = useCroppedVideoStore((state) => state.getVideo(id as string));
			break;
	}

	const onNextPress = (_video: Video) => {
		videoCrop(_video);
		router.push(`/edit/${id}`);
	}

	const videoCrop = (_video: Video) => {
		if (!id) {
			return;
		}
		switch (id) {
			case "new":
				updateSelectedVideo(_video);
				break;
			default:
				updateVideo(id as string, _video);
				break;
		}
	}

	return (
		<>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
			<VideoCropperContainer videoUri={video?.uri} onNext={onNextPress}/>
		</>
	);
}
