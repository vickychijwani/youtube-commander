import * as React from 'react';
import * as yt from '../typings/youtube';
import './VideoGrid.css';

export interface SearchResult {
    id: string;
    type: string;
    thumbnails: {
        'default': yt.Thumbnail,   // video: 120x90, channel: 88x88
        medium: yt.Thumbnail,      // video: 320x180, channel: 240x240
        high: yt.Thumbnail,        // video: 480x360, channel: 800x800
        standard?: yt.Thumbnail,   // video: 640x480
        maxres?: yt.Thumbnail,     // video: 1280x720
    };
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
}

export interface Props {
    items: SearchResult[];
    activeIndex: number;
    onActivate: (index: number) => void;
}

function VideoGrid(props: Props) {
    const {items, activeIndex, onActivate} = props;
    return (
        <div className='VideoGrid'>
            {items.map((item, index) => (
                <div
                    key={item.id}
                    id={`item${index}`}
                    className={`item ${activeIndex === index ? 'active' : ''}`}
                    onClick={event => onActivate(index)}
                >
                    <div className='thumb-container'>
                        <img className='thumb' src={item.thumbnails.medium.url} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VideoGrid;
