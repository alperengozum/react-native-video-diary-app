import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {z} from 'zod';
import ModalButton from "~/components/ModalButton";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useSelectedVideoStore} from "~/store/SelectedVideoStore";
import {useCroppedVideoStore} from "~/store/CroppedVideoStore";
import {Video} from "~/domain/Video";
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {useQuery} from '@tanstack/react-query';
import VideoPlayer from "~/components/video/VideoPlayer";

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional()
});

export default function EditModal() {
	const {id} = useLocalSearchParams();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [video, setVideo] = useState<Video | undefined>(undefined);
	const router = useRouter();

	const addMetadataToCroppedVideo = async (inputUri: string, outputUri: string, name: string, description?: string): Promise<string | undefined> => {
		try {
			await FFmpegKit.execute(`rm "${outputUri}"`);

			let command = `-y -i "${inputUri}" -c copy "${outputUri}"`;
			if (name) command += ` -metadata title="${name}"`;
			if (description) command += ` -metadata description="${description}"`;

			const session = await FFmpegKit.execute(command);
			const returnCode = await session.getReturnCode();

			if (returnCode.isValueSuccess()) {
				return outputUri;
			} else {
				new Error('Failed to add metadata to the video');
			}
		} catch (error) {
			console.error('Error adding metadata:', error);
			throw error;
		}
	};

	const saveToCroppedVideoStore = (video?: Video) => {
		let finalVideo: Video;
		if (!video) {
			return;
		}
		if (!id) {
			return;
		}
		switch (id) {
			case "new":
				finalVideo = useCroppedVideoStore.getState().addVideo(video);
				useSelectedVideoStore.getState().setVideo(null);
				break;
			default:
				finalVideo = video;
				useCroppedVideoStore.getState().updateVideo(id as string, video);
				break;
		}
		return finalVideo
	}

	const {data, isLoading, isError, refetch} = useQuery({
		queryKey: ['addMetadata', id],
		queryFn: async () => {
			const result = schema.safeParse({name, description});

			if (!result.success) {
				throw new Error(result.error.errors[0].message);
			}
			const metadataUri = `${video?.croppedUri!.split('.').slice(0, -1).join('.')}_metadata.mp4`;
			await addMetadataToCroppedVideo(
				video?.croppedUri!,
				metadataUri,
				result.data.name,
				result.data.description
			);
			return saveToCroppedVideoStore({
				...video,
				croppedUri: metadataUri,
				name: result.data.name,
				description: result.data.description
			});
		},
		enabled: false,
		retry: false,
	});

	const handleResult = async () => {
		try {
			const result = await refetch();
			if (result.isError) {
				throw result.error;
			}
			if (result.data) {
				router.push(`/(tabs)`);
			}
		} catch (error: any) {
			Alert.alert('Error', error.message || 'Failed to add metadata to video');
		}
	};

	useEffect(() => {
		let selectedVideo: Video | undefined;
		switch (id) {
			case "new":
				selectedVideo = useSelectedVideoStore.getState().video;
				setVideo(selectedVideo);
				setName(selectedVideo?.name || '');
				setDescription(selectedVideo?.description || '');
				break;
			default:
				selectedVideo = useCroppedVideoStore.getState().getVideo(id as string);
				setVideo(selectedVideo);
				setName(selectedVideo?.name || '');
				setDescription(selectedVideo?.description || '');
				break;
		}
	}, []);

	return (
		<View className="p-4 bg-white flex flex-1 items-center">
			<View className={"flex flex-[0.5] flex-col w-full gap-4"}>
				{video?.croppedUri && <VideoPlayer uri={video?.croppedUri}/>}
				<Text className="text-lg">Name</Text>
				<TextInput
					className="border border-gray-300 rounded p-2 mb-2"
					placeholder="Enter name"
					value={name}
					onChangeText={setName}
				/>

				<Text className="text-lg">Description</Text>
				<TextInput
					className="border border-gray-300 rounded p-2 h-20 text-top mb-2"
					placeholder="Enter description"
					value={description}
					onChangeText={setDescription}
					multiline
				/>
				{isLoading && <Text>Processing...</Text>}
				{isError && <Text>Error occurred while adding metadata.</Text>}
			</View>
			<ModalButton isLoading={isLoading} title={"Save Result"} icon={"chevron-forward-outline"} onPress={handleResult}/>
		</View>
	);
}
