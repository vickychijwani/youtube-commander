declare module 'scroll-to-element' {
    export interface ScrollOptions {
        offset?: number;    // > 0 means downwards, < 0 means upwards
        ease?: string;      // any value from https://github.com/component/ease
        duration?: number;  // animation duration
        align?: 'top' | 'middle' | 'bottom';
    }

    export default function scrollToElement(elem: string, options?: ScrollOptions): void;
}

declare module 'scroll-to' {
    export default function scrollTo(x: number, y: number): void;
}
