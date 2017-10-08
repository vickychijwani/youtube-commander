// @flow
import * as React from 'react';
import './VideoGrid.css';
import type {SearchResult} from '../typings/model';

export type Props = {
    items: SearchResult[],
    activeIndex: number,
    onActivate: (index: number) => void,
}

function VideoGrid(props: Props) {
    const {items, activeIndex, onActivate} = props;
    return (
        <div className='VideoGrid'>
            {items.map((item, index) => (
                <div
                    key={item.id.videoId}
                    id={`item${index}`}
                    className={`item ${activeIndex === index ? 'active' : ''}`}
                    onClick={event => onActivate(index)}
                >
                    <div className='thumb-container'>
                        <img className='thumb' src={item.snippet.thumbnails.medium.url} alt=''/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VideoGrid;
