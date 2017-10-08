import * as React from 'react';
import VideoPlayer from './VideoPlayer';
import { Video } from '../typings/model';

export interface Props {
    queue: Video[];             // video queue (NOTE: items in the queue are NOT consumed but kept around)
    playing: boolean;           // is it playing?
    currentIndex: number;       // index of currently-playing video
    currentTimestamp: number;   // current video timestamp in seconds
    volume: number;             // volume percentage
}

class PlayerWindow extends React.Component<Props, object> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {queue, currentIndex} = this.props;
        return (
            <VideoPlayer id={queue[currentIndex].id}/>
        );
    }
}

export default PlayerWindow;
