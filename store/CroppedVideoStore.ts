import {create} from "zustand";
import {Video, VideoState} from "~/domain/Video";
import {persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCroppedVideoStore = create<VideoState>()(
	persist(
		(setState, getState) => ({
			videos: [
				{
					id: "0",
					uri: "",
				},
			] as Video[],
			addVideo: (video: Video) => {
				const videos = [...getState().videos, video];
				setState({videos})
				return video;
			},
			getVideo: (id: string) => {
				const video = getState().videos.find((v: Video): boolean => v.id === id);
				if (!video) {
					return undefined;
				}
				return video;
			},
			updateVideo: (id, param) => {
				const updated = getState().videos.map((v) => {
					if (v.id === id) {
						return {...v, ...param};
					}
					return v;
				});
				setState({videos: updated});
			},
			removeVideos: (ids) => {
				const updated = getState().videos.filter((_, index) => !ids.includes(index.toString()));
				setState({videos: updated});
			},
		}),
		{
			name: "video-storage",
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
