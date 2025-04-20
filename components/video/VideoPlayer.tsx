import React, {useState} from 'react';
import {View} from 'react-native';
import {useVideoPlayer, VideoView} from 'expo-video';

interface VideoPlayerProps {
	uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({uri}) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const player = useVideoPlayer(uri, (player) => {
		player.loop = false;
	});

	return (
		<View className={"flex justify-center items-center"}>
			<VideoView
				style={{
					width: '100%',
					height: 300,
					backgroundColor: 'black',
					borderRadius: 10,
				}}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
			/>
		</View>
	);
};

export default VideoPlayer;
