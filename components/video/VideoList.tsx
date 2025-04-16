import {Video} from "~/domain/Video";
import {FlashList, FlashListProps} from "@shopify/flash-list";
import React from "react";
import VideoCard from "~/components/video/VideoCard";

export function VideoList({
	                          videos = [],
	                          listProps,
	                          containerClassName
                          }: VideoListProps) {
	return (
		<FlashList
			data={videos}
			renderItem={({item}) => (
				<VideoCard video={item}/>
			)}
			estimatedItemSize={140}
			keyExtractor={(item, index) => index.toString()}
			className={containerClassName}
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			contentContainerClassName={"pt-3"}
			bounces={false}
			bouncesZoom={false}
			overScrollMode={"never"}
			alwaysBounceVertical={false}
			alwaysBounceHorizontal={false}
			{...listProps}
		/>
	)
}

export interface VideoListProps {
	videos: Video[];
	listProps?: FlashListProps<Video>;
	containerClassName?: string;
}
