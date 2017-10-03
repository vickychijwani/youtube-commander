import * as React from 'react';
import Video from './Video';

export interface Props {
    videoId: string;
}

export interface State {

}

class Player extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const {videoId} = this.props;
        return (
            <Video id={videoId}/>
        );
    }
}

export default Player;
