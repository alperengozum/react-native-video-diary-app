import {create} from "zustand";
import {SelectedVideoState, Video} from "~/domain/Video";
import {persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSelectedVideoStore = create<SelectedVideoState>()(
	persist(
		(setState, getState) => ({
			video: null as Video | null,
			setVideo: (video: Video) => {
				setState({video})
				return video;
			},
			removeVideo: () => {
				setState({video: null});
			},
		}),
		{
			name: "selected-video-storage",
			storage: {
				getItem: async (key) => {
					const value = await AsyncStorage.getItem(key);
					if (value) return JSON.parse(value);
				},
				setItem: async (key, value) => {
					await AsyncStorage.setItem(key, JSON.stringify(value));
				},
				removeItem: async (key) => {
					await AsyncStorage.removeItem(key);
				},
			},
		}
	),
)
