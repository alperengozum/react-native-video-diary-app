
export interface Video {
	name?: string;
	uri?: string;
	description?: string;
	id?: string;
}

export interface VideoState {
	videos: Video[];
	getVideo: (id: string) => Video | undefined;
	addVideo: (video: Video) => Video;
	updateVideo: (id: string, param: Partial<Video>) => void;
	removeVideos: (ids: (string)[]) => void;
}
