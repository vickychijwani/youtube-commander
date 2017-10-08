// @flow
import * as React from 'react';
import {ProgressBar} from 'react-player-controls';
import './PlayerOverlay.css';

export type Props = {
    progress: number,
    duration: number,
}

type State = {}

class PlayerOverlay extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        const {progress, duration} = this.props;
        return (
            <div className='VideoOverlay'>
                <ProgressBar
                    className='ProgressBar'
                    isSeekable={true}
                    currentTime={progress}
                    totalTime={duration}
                />
            </div>
        );
    }
}

export default PlayerOverlay;
