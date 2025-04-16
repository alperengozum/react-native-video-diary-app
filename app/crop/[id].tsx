import {StatusBar} from 'expo-status-bar';
import {Platform} from 'react-native';
import {ScreenContent} from '~/components/ScreenContent';
import {useLocalSearchParams, useRouter} from "expo-router";
import {useCroppedVideoStore} from "~/store/CroppedVideoStore";
import {Video} from "~/domain/Video";
import VideoTrimmer from "~/components/video/VideoTrimmer";

export default function Modal() {
	const {id} = useLocalSearchParams();
	const router = useRouter();
	let video: Video | undefined;
	if (id) {
		video = useCroppedVideoStore((state) => state.getVideo(id as string));
	} else {
		video = useCroppedVideoStore((state) => state.getVideo("0"));
	}

	return (
		<>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
			<VideoTrimmer videoUri={video?.uri} onNext={(params) => {
				if (!id) {
					return;
				}
				router.push(`/edit/${id}`);
				useCroppedVideoStore.getState().updateVideo(id as string, params);
			}
			}/>
		</>
	);
}
