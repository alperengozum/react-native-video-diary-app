import {Video} from "~/domain/Video";
import {View, Text, TouchableOpacity, Image} from "react-native";
import {useRouter} from "expo-router";
import {useState} from "react";

export default function VideoCard({video}: { video: Video }) {
	const router = useRouter();
	const [error, setError] = useState(false);

	return (
		<TouchableOpacity
			onPress={() => router.push(`/detail/${video.id}`)}
			className="flex flex-col bg-white shadow-lg rounded-lg p-4"
		>
			<View className="flex flex-row items-center">
				{(video.croppedUri && !error) || (!error) ? (
					<View className="flex flex-[0.5]">
						<Image
							source={{uri: video.croppedUri}}
							className="w-full h-32 rounded-lg"
							onError={() => setError(true)}
							resizeMode="cover"/>
					</View>
				) : <View className="flex flex-[0.5]">
					<View className={"w-full h-32 bg-gray-200 rounded-lg"}/>
				</View>}
				<View className="ml-4 flex-[0.5]">
					<Text className="text-lg font-semibold">{video.name}</Text>
					<Text className="text-sm text-gray-500">{video.description}</Text>
					<Text className="text-sm text-gray-500">{new Date(video.createdAt as number).toLocaleString()}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
