import React, { useEffect, useRef, useState } from 'react';

import useScroll from 'ahooks/lib/useScroll';
import useSize from 'ahooks/lib/useSize';
import { MTableInfiniteProps } from './models';

export default function(props: MTableInfiniteProps): JSX.Element {

    const maxBodyHeight = typeof props.maxBodyHeight === 'string'
        ? +props.maxBodyHeight.replace(/\D+/, '')
        : props.maxBodyHeight;

    const threshold = props.threshold ? props.threshold : maxBodyHeight * 1.5;

    const containerRef = useRef(null);
    const scroll = useScroll(containerRef);

    const contentRef = useRef(null);
    const sizes = useSize(contentRef);

    const [isScrolled, setScrolled] = useState(false);
    const nextPage = props.currentPage + 1;

    useEffect(() => {
        if (
            props.paging === 'infinite' &&
            typeof sizes?.height === 'number' &&
            typeof scroll?.top === 'number' &&
            sizes.height > props.maxBodyHeight &&
            props.pageSize * nextPage < props.totalCount &&
            scroll.top > props.maxBodyHeight
        ) {
            if (sizes.height - (scroll.top + maxBodyHeight) < threshold) {
                if (!isScrolled) {
                    setScrolled(true);
                    props.onPageChange(nextPage);
                }
            } else {
                setScrolled(false);
            }
        }
    }, [scroll?.top, sizes?.height]);

    if (props.paging === 'infinite') {
        return (
            <div ref={containerRef} style={{ maxHeight: props.maxBodyHeight, overflowY: 'auto' }}>
                <div ref={contentRef}>
                    {props.children}
                </div>
            </div>
        );
    }
    else {
        return (
            <>
                {props.children}
            </>
        );
    }
}
