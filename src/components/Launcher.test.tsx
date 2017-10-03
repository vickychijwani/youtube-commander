import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Launcher from './Launcher';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Launcher onSelect={() => { return; }}/>, div);
});
