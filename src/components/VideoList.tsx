import * as React from 'react';
import * as yt from '../typings/youtube';
import { KeyboardEvent } from 'react';

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
    focusedItem: number;
    onFocus: (itemIndex: number) => void;
    onSelect: (videoId: string) => void;
}

const TAB_INDEX_RANDOM_OFFSET = 78; // to avoid clashing with tabindex on other elements outside this component
class VideoList extends React.Component<Props, object> {
    $results: HTMLElement[];

    constructor(props: Props) {
        super(props);
        this.$results = [];
    }

    render() {
        const {items, onFocus} = this.props;
        return (
            <div>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        tabIndex={index + TAB_INDEX_RANDOM_OFFSET}
                        ref={($div) => this.$results[index] = $div!}
                        onFocus={() => onFocus(index)}
                        onKeyPress={(event) => this.onKeyPress(event, item.id)}
                    >
                        <img src={item.thumbnails.default.url}/>
                        <div>{item.title}</div>
                    </div>
                ))}
            </div>
        );
    }

    componentDidUpdate() {
        const focusedItem = this.props.focusedItem;
        if (focusedItem in this.$results) {
            this.$results[focusedItem].focus();
        }
    }

    onKeyPress = (event: KeyboardEvent<HTMLElement>, videoId: string) => {
        if (event.key === 'Enter') {
            this.props.onSelect(videoId);
        }
    }

    componentWillUnmount() {
        this.$results = [];
    }
}

export default VideoList;
