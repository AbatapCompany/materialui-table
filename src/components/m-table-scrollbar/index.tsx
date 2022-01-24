import React from 'react';
import DoubleScrollbar from 'react-double-scrollbar';
import { ScrollbarProps } from './models';

export default function (props: ScrollbarProps): JSX.Element {
    const [divRef, setRef] = React.useState<HTMLDivElement>();
    const [cellFixedStyle, setCellFixedStyle] = React.useState('');

    const setDivRef = (ref: HTMLDivElement) => {
        if (ref && ref.children[0] && ref.children[0].children && ref.children[0].children[0]) {
            setRef(ref);
        }
    };

    if (divRef) {
        let left = 0;
        const headerRows = divRef.children[0].children[0].children.length;
        const firstRowChildren = divRef.children[0].children[0].children[headerRows - 1].children;

        let style = '';
        for (let i = 0; i < firstRowChildren.length; ++i) {
            const item = firstRowChildren[i] as HTMLElement;
            if (item.className.indexOf('cell-fixed') !== -1) {
                style += `#${props.tableId} .cell-fixed:nth-child(${i + 1}) { left: ${left}px; } `;
                left += item.offsetWidth;
            }
        }
        if (style !== '' && style !== cellFixedStyle) {
            setCellFixedStyle(style);
        }
    }

    if (props.double) {
        return (
            <DoubleScrollbar>
                {props.children}
            </DoubleScrollbar>
        );
    }
    else {
        return (
            <div ref={setDivRef} style={{ overflowX: 'auto' }} >
                {props.children}
                {cellFixedStyle !== '' && <style>{cellFixedStyle}</style>}
            </div>
        );
    }
}
