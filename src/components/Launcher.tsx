import * as React from 'react';
import './Launcher.css';

import SearchBar from './SearchBar';
import VideoList, { SearchResult } from './VideoList';
import * as yt from '../typings/youtube';
import { KeyboardEvent } from 'react';

// tslint:disable-next-line
declare const gapi: any;

export interface Props {
    onSelect: (videoId: string) => void;
}

interface State {
    // -1 if the search bar is focused, else the index of the focused search result
    focusedItem: number;
    searchResults: SearchResult[];
}

class Launcher extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            focusedItem: -1,
            searchResults: []
        };
    }

    render() {
        const {onSelect} = this.props;
        return (
            <div className='App' tabIndex={0} onKeyDown={this.onKeyDown}>
                <SearchBar
                    isFocused={this.state.focusedItem === -1}
                    onChange={this.search}
                    onFocus={() => this.setState({focusedItem: -1})}
                />
                <VideoList
                    items={this.state.searchResults}
                    focusedItem={this.state.focusedItem}
                    onFocus={(index) => this.setState({focusedItem: index})}
                    onSelect={onSelect}
                />
            </div>
        );
    }

    onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown') {
            this.focusNextItem();
        } else if (event.key === 'ArrowUp') {
            this.focusPreviousItem();
        }
    }

    search = (query: string) => {
        const ytItemToVideo = (item: yt.SearchResult) => ({
            id: item.id.videoId,
            type: item.id.kind.replace('youtube#', ''),
            thumbnails: item.snippet.thumbnails,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
        });
        gapi.client.youtube.search.list({
            part: 'snippet',
            q: query,
            maxResults: 10
        }).then((r: { result: { items: yt.SearchResult[] } }) => {
            const searchResults = r.result.items.map(ytItemToVideo);
            this.setState({searchResults});
        });
    }

    focusNextItem() {
        const nextIndex = this.state.focusedItem + 1;
        const maxIndex = this.state.searchResults.length - 1;
        this.setState({focusedItem: Math.min(nextIndex, maxIndex)});
    }

    focusPreviousItem() {
        const prevIndex = this.state.focusedItem - 1;
        const minIndex = -1;    // not 0 because the search bar itself is considered to be at index -1
        this.setState({focusedItem: Math.max(prevIndex, minIndex)});
    }
}

export default Launcher;
