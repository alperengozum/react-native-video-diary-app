import React, {useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useEventListener} from 'expo';
import {StatusChangeEventPayload, useVideoPlayer, VideoView} from 'expo-video';
import Slider from '@react-native-community/slider';
import {VideoPlayerStatus} from 'expo-video/src/VideoPlayer.types';
import {Ionicons} from "@expo/vector-icons";
import {useMutation} from '@tanstack/react-query';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import ModalButton from "~/components/ModalButton";

export default function VideoCropperContainer({videoUri, onNext}: VideoCropperContainerProps) {
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(5);
	const [duration, setDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const player = useVideoPlayer(videoUri, (player) => {
		player.loop = false;
		player.play();
	});

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
			return outputUri;
		} else {
			throw new Error('Error trimming video');
		}
	};

	const playAndPauseAfter5Seconds = async () => {
		if (isPlaying) {
			player.pause();
			setIsPlaying(false);
		} else {
			if (player.currentTime !== start) {
				player.currentTime = start;
			}
			player.play();
			setIsPlaying(true);
			await new Promise((resolve) => setTimeout(resolve, 5000));
			player.pause();
			setIsPlaying(false);
		}
	}

	const onNextPress = async () => {
		const croppedUri = await trimVideo()
		const video = {
			cropped: true,
			croppedUri,
			uri: videoUri,
			croppedAt: new Date().getTime()
		}
		onNext(video);
	}

	const {mutate, isError} = useMutation({mutationFn: onNextPress});

	const handleSliderChange = async (value: number) => {
		const clampedStart = Math.min(value, duration - 5);
		setStart(clampedStart);
		setEnd(clampedStart + 5);
		player.currentTime = clampedStart;
		await playAndPauseAfter5Seconds();
	};

	const handleLoad = (status: VideoPlayerStatus, oldStatus?: VideoPlayerStatus) => {
		if (duration === 0) {
			setDuration(player.duration);
			setEnd(Math.min(5, player.duration));
		}
		if (status === 'loading' && oldStatus === 'idle') {
			setStart(0);
			player.pause();
		}
	};

	const togglePlayPause = async () => {
		await playAndPauseAfter5Seconds();
	}

	useEventListener(player, 'statusChange', ({status, oldStatus}: StatusChangeEventPayload) =>
		handleLoad(status, oldStatus)
	);

	return (
		<View className="p-4 justify-start flex flex-1 w-full items-center">
			<VideoView style={{
				width: '100%',
				height: '60%',
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
				maximumTrackTintColor="#d8b4fe"
				thumbTintColor="#9333ea"
			/>
			{isError && <Text>Error occurred while trimming the video.</Text>}
			<TouchableOpacity
				className={"mt-5 items-center justify-center w-[50px] h-[50px] bg-purple-700 rounded-full p-2.5"}
				onPress={togglePlayPause}
			>
				<Ionicons
					name={isPlaying ? 'pause' : 'play'}
					size={24}
					color="white"
				/>
			</TouchableOpacity>
			<ModalButton title={"Next"} icon={"chevron-forward-outline"} onPress={() => mutate()}/>
		</View>
	);
}

export interface VideoCropperContainerProps {
	videoUri: string;
	onNext: (video: any) => void;
}
