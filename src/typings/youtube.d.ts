import { Thumbnail } from './model';

export interface SearchResult {
    kind: 'youtube#searchResult';
    etag: string;
    id: {
        kind: string,
        videoId: string,
        channelId: string,
        playlistId: string,
    };
    snippet: {
        title: string,
        description: string,
        publishedAt: string,        // datetime str like "2013-06-10T15:40:54.000Z"
        channelId: string,
        channelTitle: string,
        thumbnails: {
            'default': Thumbnail,   // video: 120x90, channel: 88x88
            medium: Thumbnail,      // video: 320x180, channel: 240x240
            high: Thumbnail,        // video: 480x360, channel: 800x800
            standard?: Thumbnail,   // video: 640x480
            maxres?: Thumbnail,     // video: 1280x720
        },
    };
}
