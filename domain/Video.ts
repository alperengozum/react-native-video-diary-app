
export interface Video {
	name?: string;
	uri?: string;
	description?: string;
}

export interface VideoState {
	videos: Video[];
	addVideo: (video: Video) => Video;
	updateVideo: (id: string, param: Partial<Video>) => void;
	removeVideos: (ids: (string)[]) => void;
}
