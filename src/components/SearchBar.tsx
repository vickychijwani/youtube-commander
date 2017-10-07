import * as React from 'react';
import './SearchBar.css';

export interface Props {
    text: string;
    // tslint:disable-next-line
    children?: any;
}

function SearchBar({text, children}: Props) {
    return (
        <div className='SearchBar'>
            <pre className='input'>
                {text}
            </pre>
            {...children}
        </div>
    );
}

export default SearchBar;
