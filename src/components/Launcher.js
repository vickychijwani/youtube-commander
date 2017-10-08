// @flow
import * as React from 'react';
import scrollToElement from 'scroll-to-element';

import SearchBar from './SearchBar';
import VideoGrid from './VideoGrid';
import utils from '../utils';
import type {SearchResult} from '../typings/model';

import './Launcher.css';

export type Props = {
    onSelect: (video: SearchResult) => void,
}

type State = {
    activeIndex: number,
    searchText: string,
    searchResults: SearchResult[],
}

class Launcher extends React.Component<Props, State> {
    static SEARCH_DELAY = 500;
    // $FlowFixMe
    static ITEM_SCROLL_OFFSET = parseInt(getComputedStyle(document.body)
        .getPropertyValue('--padding-normal').trim(), 10);
    scheduleSearch: (searchText: string) => void;

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

    onKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        /* Events for search bar */
        // this is a giant hack to detect printable characters so they can be forwarded to SearchBar
        if (event.key.length === 1) {
            this.setSearchText(this.state.searchText + event.key);
        } else if (event.key === 'Backspace') {
            this.setSearchText(this.state.searchText.slice(0, -1));
        }

        /* Events for search results */
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
            this.setState({searchResults: []});
            return;
        }
        // $FlowFixMe
        gapi.client.youtube.search.list({   // eslint-disable-line
            part: 'snippet',
            q: searchText,
            maxResults: 12
        }).then(({result: {items}}) => {
            if (searchText !== this.state.searchText) {
                // search text has changed, throw away the results...
                return;
            }
            this.setState({
                searchResults: items,
                activeIndex: (items.length > 0) ? 0 : -1
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
