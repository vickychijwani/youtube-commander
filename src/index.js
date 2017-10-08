// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import utils from './utils';
import Launcher from './components/Launcher';
import PlayerWindow from './components/PlayerWindow';
import type {SearchResult} from './typings/model';
import type {Props as PlayerProps} from './components/PlayerWindow';

// create-react-app currently doesn't support multiple HTML files
// which is why we use a URL param as a workaround
// https://github.com/facebookincubator/create-react-app/issues/1084
// $FlowFixMe
const urlParams = (new URL(document.location)).searchParams;

let ipcRenderer;
try {
    ipcRenderer = window.require('electron').ipcRenderer;
} catch (e) {
    // we're in a browser
    ipcRenderer = { send: (_, __) => {}, on: (_, __) => {} };
    urlParams.set('root', 'launcher');
}

const $root = document.getElementById('root');
const rootWidget = urlParams.get('root');
switch (rootWidget) {
    case 'launcher':
        utils.loadGoogleAPIs(() => ReactDOM.render(
            <Launcher onSelect={(video) => ipcRenderer.send('add-to-queue', video)}/>,
            $root));
        break;
    case 'player':
        const renderPlayer = () => ReactDOM.render(<PlayerWindow {...playerState}/>, $root);
        // TODO move this into application-wide state using Flux+Immutable or something similar
        // TODO also see this: https://github.com/samiskin/redux-electron-store
        const playerState: PlayerProps = {
            queue: [],
            playing: true,
            currentIndex: 0,
            currentTimestamp: 0,
            currentDuration: 0,
            volume: 100,
            onProgress: seconds => {
                playerState.currentTimestamp = seconds;
                renderPlayer();
            },
            onDuration: seconds => {
                playerState.currentDuration = seconds;
                renderPlayer();
            }
        };
        ipcRenderer.on('add-to-queue', (_, video: SearchResult) => {
            playerState.queue.push(video);
            renderPlayer();
        });
        break;
    default:
        throw new Error(`Unexpected value ${rootWidget} for parameter 'root'`);
}
