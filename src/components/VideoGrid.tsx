import * as React from 'react';
import './VideoGrid.css';
import { Video } from '../typings/model';

export interface Props {
    items: Video[];
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
                        <img className='thumb' src={item.thumbnails.medium.url}/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VideoGrid;
