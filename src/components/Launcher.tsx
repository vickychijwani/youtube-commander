import * as React from 'react';
import { KeyboardEvent } from 'react';
import scrollToElement from 'scroll-to-element';

import SearchBar from './SearchBar';
import VideoGrid from './VideoGrid';
import utils from '../utils';
import { Video } from '../typings/model';
import * as yt from '../typings/youtube';

import './Launcher.css';

// tslint:disable-next-line
declare const gapi: any;

export interface Props {
    onSelect: (video: Video) => void;
}

interface State {
    activeIndex: number;
    searchText: string;
    searchResults: Video[];
}

class Launcher extends React.Component<Props, State> {
    private static SEARCH_DELAY = 500;
    private static ITEM_SCROLL_OFFSET = parseInt(getComputedStyle(document.body)
        .getPropertyValue('--padding-normal').trim(), 10);
    private scheduleSearch: (searchText: string) => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            activeIndex: 0,
            searchText: '',
            searchResults: [],
        };
        this.scheduleSearch = utils.debounce(this.search, Launcher.SEARCH_DELAY).bind(this);
    }

    render() {
        const {searchText, searchResults, activeIndex} = this.state;
        return (
            <div
                className='Launcher'
                tabIndex={0}
                onKeyDown={this.onKeyDown}
                ref={$el => $el && $el.focus()}
            >
                <SearchBar text={searchText}>
                    <div className='tip'>
                        <kbd>arrow keys</kbd>: navigate<span className='separator'> • </span>
                        <kbd>enter</kbd>: add to queue<span className='separator'> • </span>
                        <kbd>ctrl+enter</kbd>: play now<span className='separator'> • </span>
                        <kbd>tab</kbd>: options
                    </div>
                </SearchBar>
                <VideoGrid
                    items={searchResults}
                    activeIndex={activeIndex}
                    onActivate={(index) => this.setState({activeIndex: index})}
                />
            </div>
        );
    }

    onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        /* Events for search bar */
        // this is a giant hack to detect printable characters so they can be forwarded to SearchBar
        if (event.key.length === 1) {
            this.setSearchText(this.state.searchText + event.key);
        } else if (event.key === 'Backspace') {
            this.setSearchText(this.state.searchText.slice(0, -1));
        }

        /* Events for search results */
        // tslint:disable-next-line
        else if (event.key === 'ArrowDown') {
            this.focusNextItem();
        } else if (event.key === 'ArrowUp') {
            this.focusPreviousItem();
        } else if (event.key === 'Enter') {
            this.props.onSelect(this.state.searchResults[this.state.activeIndex]);
        } else {
            return;
        }
        event.preventDefault();
    }

    setSearchText(searchText: string) {
        this.setState({searchText},
            () => this.scheduleSearch(this.state.searchText));
    }

    search = (searchText: string) => {
        searchText = searchText.trim();
        if (!searchText) {
            this.setState({ searchResults: [] });
            return;
        }
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
            q: searchText,
            maxResults: 12
        }).then((r: { result: { items: yt.SearchResult[] } }) => {
            if (searchText !== this.state.searchText) {
                // search text has changed, throw away the results...
                return;
            }
            const searchResults = r.result.items.map(ytItemToVideo);
            this.setState({
                searchResults,
                activeIndex: (searchResults.length > 0) ? 0 : -1
            });
        });
    }

    focusNextItem() {
        const nextIndex = this.state.activeIndex + 1;
        const maxIndex = this.state.searchResults.length - 1;
        const activeIndex = Math.min(nextIndex, maxIndex);
        Launcher.scrollToItem(activeIndex);
        this.setState({activeIndex});
    }

    focusPreviousItem() {
        const prevIndex = this.state.activeIndex - 1;
        const activeIndex = Math.max(prevIndex, 0);
        Launcher.scrollToItem(activeIndex);
        this.setState({activeIndex});
    }

    static scrollToItem(index: number) {
        scrollToElement(`#item${index}`, {
            align: 'bottom',
            offset: Launcher.ITEM_SCROLL_OFFSET,
            duration: 200,
        });
    }
}

export default Launcher;
