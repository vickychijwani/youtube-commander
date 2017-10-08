// @flow
import * as React from 'react';
import VideoPlayer from './VideoPlayer';
import PlayerOverlay from './PlayerOverlay';
import type {SearchResult} from '../typings/model';

export type Props = {
    queue: SearchResult[],      // video queue (NOTE: items in the queue are NOT consumed but kept around)
    playing: boolean,           // is it playing?
    currentIndex: number,       // index of currently-playing video
    currentTimestamp: number,   // current video timestamp in seconds
    currentDuration: number,    // duration of current video in seconds
    volume: number,             // volume percentage
    onProgress: (seconds: number) => any,
    onDuration: (seconds: number) => any,
}

type State = {}

class PlayerWindow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        const {queue, currentIndex, currentTimestamp, currentDuration, onProgress, onDuration} = this.props;
        const currentVideo = queue[currentIndex];
        return (
            <VideoPlayer
                id={currentVideo.id.videoId}
                onProgress={onProgress}
                onDuration={onDuration}
            >
                <PlayerOverlay
                    duration={currentDuration}
                    progress={currentTimestamp}
                />
            </VideoPlayer>
        );
    }
}

export default PlayerWindow;
