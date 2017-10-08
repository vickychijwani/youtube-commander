export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Video {
    id: string;
    type: string;
    thumbnails: {
        'default': Thumbnail,   // video: 120x90, channel: 88x88
        medium: Thumbnail,      // video: 320x180, channel: 240x240
        high: Thumbnail,        // video: 480x360, channel: 800x800
        standard?: Thumbnail,   // video: 640x480
        maxres?: Thumbnail,     // video: 1280x720
    };
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
}
