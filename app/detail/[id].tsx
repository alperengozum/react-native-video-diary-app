import React, {useEffect, useState} from 'react';
import {View, Text, Button, TouchableOpacity, Alert, Modal} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useCroppedVideoStore} from '~/store/CroppedVideoStore';
import {Video} from '~/domain/Video';
import VideoPlayer from '~/components/video/VideoPlayer';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';

export default function DetailModal() {
	const {id} = useLocalSearchParams();
	const [video, setVideo] = useState<Video | undefined>(undefined);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (id) {
			const fetchedVideo = useCroppedVideoStore.getState().getVideo(id as string);
			setVideo(fetchedVideo);
		}
	}, [id]);

	const handleDelete = () => {
		if (id) {
			useCroppedVideoStore.getState().removeVideos([id as string]);
			router.push('/');
		}
	};

	return (
		<View className="p-4 bg-white flex flex-1 items-center">
			<View className="flex flex-[0.5] flex-col w-full gap-4">
				{video?.croppedUri && <VideoPlayer uri={video.croppedUri}/>}
				<Text className="text-lg font-bold">Name</Text>
				<Text className="border border-gray-300 rounded p-2 mb-2 bg-gray-100">{video?.name || 'No name provided'}</Text>

				<Text className="text-lg font-bold">Description</Text>
				<Text className="border border-gray-300 rounded p-2 h-20 text-top mb-2 bg-gray-100">
					{video?.description || 'No description provided'}
				</Text>
			</View>
			<View className="flex flex-1 flex-row gap-4">
				<TouchableOpacity
					onPress={() => router.push(`/edit/${id}`)}
					className="bg-purple-700 rounded-full w-full flex flex-row gap-6 items-start p-3 absolute bottom-20 left-0 shadow-lg"
				>
					<AntDesign name="edit" size={24} color="white"/>
					<Text className="text-white text-center font-bold text-lg">Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setIsModalVisible(true)}
					className="bg-red-700 rounded-full w-full flex flex-row gap-6 items-start p-3 absolute bottom-0 left-0 shadow-lg"
				>
					<MaterialIcons name="delete-outline" size={24} color="white"/>
					<Text className="text-white text-center font-bold text-lg">Delete</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={isModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View className="flex-1 justify-center items-center bg-gray-900">
					<View className="bg-white p-6 rounded-lg w-4/5">
						<Text className="text-lg font-bold mb-4">Confirm Deletion</Text>
						<Text className="text-gray-700 mb-6">Are you sure you want to delete this video?</Text>
						<View className="flex flex-row justify-end gap-4">
							<Button title="Cancel" onPress={() => setIsModalVisible(false)}/>
							<Button
								title="Confirm"
								onPress={() => {
									setIsModalVisible(false);
									handleDelete();
								}}
								color="crimson"
							/>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
