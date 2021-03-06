// @flow
import secrets from './secrets';

// noinspection ES6ConvertVarToLetConst
declare var gapi: any;

const utils = {
    loadGoogleAPIs: (callback: Function) => {
        gapi.load('client', () => {
            gapi.client.init({
                'apiKey': secrets.YOUTUBE_API_KEY,
                // Your API key will be automatically added to the Discovery Document URLs.
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
                // clientId and scope are optional if auth is not required.
                // 'clientId': secrets.YOUTUBE_CLIENT_ID,
                // 'scope': 'profile',
            }).then(callback);
        });
    },

    debounce: (fn: Function, delay: number) => {
        let timer;
        return function (...args: any) {
            clearTimeout(timer);
            timer = window.setTimeout(() => fn(...args), delay);
        };
    },
};

export default utils;
