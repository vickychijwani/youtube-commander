import * as React from 'react';
import ReactPlayer from 'react-player';

export interface Props {
    id: string;
}

function VideoPlayer({id}: Props) {
    return (
        <div>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                playing={true}
            />
        </div>
    );
}

export default VideoPlayer;
