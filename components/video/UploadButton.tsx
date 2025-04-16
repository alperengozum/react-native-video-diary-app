import {forwardRef} from 'react';
import {Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {Feather} from "@expo/vector-icons";

type ButtonProps = {
	title: string;
} & TouchableOpacityProps;

export const UploadButton = forwardRef<View, ButtonProps>(({title, ...touchableProps}, ref) => {
	return (
		<TouchableOpacity
			ref={ref}
			{...touchableProps}
			className={`${styles.button} ${touchableProps.className}`}>
			<Text className={styles.buttonText}>{title}</Text>
			<Feather name={"upload"} size={20} color="white"/>
		</TouchableOpacity>
	);
});

const styles = {
	button: 'flex flex-row gap-3 absolute bottom-3 right-3 items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
	buttonText: 'text-white text-lg font-semibold text-center',
};
