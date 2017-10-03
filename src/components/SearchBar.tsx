import * as React from 'react';
import { KeyboardEvent } from 'react';

export interface Props {
    isFocused: boolean;
    onChange: (query: string) => void;
    onFocus: () => void;
}

class SearchBar extends React.Component<Props, object> {
    $input: HTMLInputElement|null;

    constructor(props: Props) {
        super(props);
        this.$input = null;
    }

    render() {
        const {isFocused, onChange, onFocus} = this.props;
        const onKeyPress = function (event: KeyboardEvent<HTMLInputElement>) {
            if (event.key === 'Enter') {
                onChange((event.target as HTMLInputElement).value);
            }
        };

        return (
            <input
                type='text'
                autoFocus={isFocused}
                placeholder='Search'
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                ref={(input) => this.$input = input}
            />
        );
    }

    componentDidUpdate() {
        if (this.$input !== null) {
            if (this.props.isFocused) {
                this.$input.focus();
            }
        }
    }

    componentWillUnmount() {
        this.$input = null;
    }
}

export default SearchBar;
