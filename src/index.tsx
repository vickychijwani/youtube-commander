import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import utils from './utils';
import { Video } from './typings/model';
import Launcher from './components/Launcher';
import PlayerWindow, { Props as PlayerProps } from './components/PlayerWindow';

// create-react-app currently doesn't support multiple HTML files
// which is why we use a URL param as a workaround
// https://github.com/facebookincubator/create-react-app/issues/1084

declare const URL: {
    new(url: Location): URL;
};
const urlParams = (new URL(document.location)).searchParams;

// weird syntax because Webpack messes with module loading
// https://github.com/electron/electron/issues/9920
declare const window: {
    require: Function;
};
let ipcRenderer: { send: Function, on: Function };
try {
    ipcRenderer = window.require('electron').ipcRenderer;
} catch (e) {
    // we're in a browser
    ipcRenderer = { send: () => {}, on: () => {} };
    urlParams.set('root', 'launcher');
}

const $root = document.getElementById('root') as HTMLElement;
const rootWidget = urlParams.get('root');
switch (rootWidget) {
    case 'launcher':
        utils.loadGoogleAPIs(() => ReactDOM.render(
            <Launcher onSelect={(video) => ipcRenderer.send('add-to-queue', video)}/>,
            $root));
        break;
    case 'player':
        // TODO move this into application-wide state using Flux+Immutable or something similar
        // TODO also see this: https://github.com/samiskin/redux-electron-store
        const playerState: PlayerProps = {
            queue: [],
            playing: true,
            currentIndex: 0,
            currentTimestamp: 0,
            volume: 100,
        };
        ipcRenderer.on('add-to-queue', (_: object, video: Video) => {
            playerState.queue.push(video);
            ReactDOM.render(<PlayerWindow {...playerState}/>, $root);
        });
        break;
    default:
        throw new Error(`Unexpected value ${rootWidget} for parameter 'root'`);
}
