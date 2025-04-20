import {create} from "zustand";
import {Video, VideoState} from "~/domain/Video";
import {persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {generateRandomID} from "~/utils/UuidUtils";


export const useCroppedVideoStore = create<VideoState>()(
	persist(
		(setState, getState) => ({
			videos: [] as Video[],
			addVideo: (video: Video) => {
				const _video: Video = {
					...video,
					id: video.id === "new" || !video.id ? generateRandomID() : video.id,
					createdAt: new Date().getTime()
				};
				const videos: Video[] = [...getState().videos, _video];
				setState({videos})
				return _video;
			},
			getVideo: (id: string) => {
				const video: Video | undefined = getState().videos.find((v: Video): boolean => v.id === id);
				if (!video) {
					return undefined;
				}
				return video;
			},
			updateVideo: (id, param) => {
				const updated: Video[] = getState().videos.map((v) => {
					if (v.id === id) {
						return {...v, ...param, id: id};
					}
					return v;
				});
				setState({videos: updated});
			},
			removeVideos: (ids) => {
				const updated: Video[] = getState().videos.filter((v) => !ids.includes(v.id!));
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
