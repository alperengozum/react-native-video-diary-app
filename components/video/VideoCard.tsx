import {Video} from "~/domain/Video";
import {View, Text} from "react-native";

export default function VideoCard({
	                                  video
                                  }: {
	video: Video
}) {

	return (
		<View className="flex flex-col bg-white shadow-lg rounded-lg p-4">
			<View className="flex flex-row items-center">
				<View className="bg-gray-300 w-32 h-32 rounded-lg" />
				<View className="ml-4">
					<Text className="text-lg font-semibold">{video.name}</Text>
					<Text className="text-sm text-gray-500">{video.description}</Text>
				</View>
			</View>
		</View>
	)
}

export interface VideoCardProps {
	video: Video
}
