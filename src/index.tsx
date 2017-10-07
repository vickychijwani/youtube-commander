import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import utils from './utils';
import Launcher from './components/Launcher';
import Player from './components/Player';

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
            <Launcher onSelect={(videoId) => ipcRenderer.send('play-video', videoId)}/>,
            $root));
        break;
    case 'player':
        ipcRenderer.on('play-video', (_: object, videoId: string) => {
            ReactDOM.render(<Player videoId={videoId}/>, $root);
        });
        break;
    default:
        throw new Error(`Unexpected value ${rootWidget} for parameter 'root'`);
}
