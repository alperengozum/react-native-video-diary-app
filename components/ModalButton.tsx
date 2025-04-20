import {Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function ModalButton({
	                                    title,
	                                    icon,
	                                    onPress,
	                                    isLoading
                                    }: ModalButtonProps) {
	return (
		<TouchableOpacity
			disabled={isLoading}
			className="absolute bottom-6 w-full items-center bg-purple-700 rounded-full flex-row justify-center gap-0"
			onPress={onPress}>
			{title && <Text className="text-white text-lg py-2 px-4 font-normal">
				{title}
			</Text>}
			{icon && <Ionicons name={icon as any} size={12} color="white"/>}
		</TouchableOpacity>
	);
}

export interface ModalButtonProps {
	title: string;
	icon: string;
	onPress: () => void;
	isLoading?: boolean;
}
