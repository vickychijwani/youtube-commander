// @flow
import * as React from 'react';
import './SearchBar.css';

export type Props = {
    text: string,
    children?: React.Node,
}

function SearchBar({text, children}: Props) {
    return (
        <div className='SearchBar'>
            <pre className='input'>
                {text}
            </pre>
            {children}
        </div>
    );
}

export default SearchBar;
