// @flow
import * as React from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';

export type Props = {
    id: string,
    onProgress: (seconds: number) => any,
    onDuration: (seconds: number) => any,
    // children will be put into an overlay div
    children?: React.Node,
}

function VideoPlayer({id, onProgress, onDuration, children}: Props) {
    return (
        <div className='VideoPlayer'>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                playing={true}
                onProgress={({playedSeconds}) => onProgress(playedSeconds)}
                onDuration={onDuration}
            />
            <div className='overlay'>
                {children}
            </div>
        </div>
    );
}

export default VideoPlayer;
