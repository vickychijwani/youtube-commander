import * as React from 'react';

export interface Props {
    id: string;
}

function Video({id}: Props) {
    return (
        <div>
            <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                className='video'
                frameBorder='0'
                allowFullScreen={true}
            />
        </div>
    );
}

export default Video;
