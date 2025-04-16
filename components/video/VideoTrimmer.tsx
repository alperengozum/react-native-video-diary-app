import React, {useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useEventListener} from 'expo';
import {StatusChangeEventPayload, useVideoPlayer, VideoView} from 'expo-video';
import Slider from '@react-native-community/slider';
import {VideoPlayerStatus} from 'expo-video/src/VideoPlayer.types';
import {Ionicons} from "@expo/vector-icons";
import {useMutation} from '@tanstack/react-query';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

//TODO: Add interface
export default function VideoTrimmer({videoUri, onNext}: any) {
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(5);
	const [duration, setDuration] = useState(0);

	const player = useVideoPlayer(videoUri, (player) => {
		player.loop = false;
		player.play();
	});

	const handleSliderChange = async (value: number) => {
		const clampedStart = Math.min(value, duration - 5);
		setStart(clampedStart);
		setEnd(clampedStart + 5);
		player.currentTime = clampedStart;
		player.play();
		await new Promise((resolve) => setTimeout(resolve, 5000));
		player.pause();
	};

	const handleLoad = (status: VideoPlayerStatus, oldStatus?: VideoPlayerStatus) => {
		if (duration === 0) {
			setDuration(player.duration);
			setEnd(Math.min(5, player.duration));
		}
		if (status === 'loading' && oldStatus === 'idle') {
			setStart(0);
		}
	};

	const trimVideo = async (): Promise<string> => {
		const outputUri = `${videoUri.split('.').slice(0, -1).join('.')}_trimmed.mp4`;
		try {
			await FFmpegKit.execute(`rm "${outputUri}"`);
		} catch (error) {
			console.error('Error removing file:', error);
		}
		const command = `-y -i "${videoUri}" -ss ${new Date(start * 1000).toISOString().substr(11, 8)} -to ${new Date(end * 1000).toISOString().substr(11, 8)} -c copy "${outputUri}"`;
		const session = await FFmpegKit.execute(command);
		const returnCode = await session.getReturnCode();
		if (returnCode.isValueSuccess()) {
			return outputUri; // Return the trimmed video path
		} else {
			throw new Error('Error trimming video');
		}
	};

	useEventListener(player, 'statusChange', ({status, oldStatus}: StatusChangeEventPayload) =>
		handleLoad(status, oldStatus)
	);

	const {mutate, data, isLoading, isError} = useMutation({mutationFn: trimVideo});


	const outputPlayer = useVideoPlayer(data, (player) => {
		player.loop = false;
		player.play();
	});

	if (data) {
		console.log("mutated data", data);
	}

	return (
		<View className="p-4 justify-start flex flex-1 w-full items-center">
			<VideoView style={{
				width: '100%',
				height: 200,
				backgroundColor: 'black',
				borderRadius: 10,
			}} player={player} nativeControls={false}/>
			<Text className="text-center text-lg mt-4">
				Start: {start.toFixed(1)}s — End: {end.toFixed(1)}s
			</Text>

			<Slider
				style={{marginVertical: 20, width: '100%'}}
				minimumValue={0}
				maximumValue={Math.max(0, duration - 5)}
				step={0.1}
				value={start}
				onValueChange={handleSliderChange}
				minimumTrackTintColor="#9333ea"
				maximumTrackTintColor="#faf5ff"
				thumbTintColor="#9333ea"
			/>

			<TouchableOpacity
				className="absolute bottom-6 w-full items-center bg-purple-700 rounded-full flex-row justify-center gap-0"
				onPress={() => mutate()}>
				<Text className="text-white text-lg py-2 px-4">
					Next
				</Text>
				<Ionicons name={"chevron-forward-outline"} size={12} color="white"/>
			</TouchableOpacity>

			{isLoading && <Text>Trimming video...</Text>}
			{isError && <Text>Error occurred while trimming the video.</Text>}
			{data && <VideoView style={{
				width: '100%',
				height: 200,
				backgroundColor: 'black',
				borderRadius: 10,
			}} player={outputPlayer} nativeControls={true}/>}
		</View>
	);
}
