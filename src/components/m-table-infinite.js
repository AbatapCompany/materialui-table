import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useScroll from 'ahooks/es/useScroll';
import useSize from 'ahooks/es/useSize';

export const MTableInfinite = (props) => {

  const threshold = props.threshold ?? props.maxBodyHeight * 1.5;

  const containerRef = useRef(null);
  const scroll = useScroll(containerRef);

  const contentRef = useRef(null);
  const sizes = useSize(contentRef);

  const [isScrolled, setScrolled] = useState(false);
  const nextPage = props.currentPage + 1;

  useEffect(() => {
    if (
      props.paging === 'infinite' &&
      sizes.height > props.maxBodyHeight &&
      props.pageSize * nextPage < props.totalCount &&
      scroll.top > props.maxBodyHeight
    ) {
      if (sizes.height - (scroll.top + props.maxBodyHeight) < threshold) {
        if (!isScrolled) {
          setScrolled(true);
          props.onChangePage(undefined, nextPage);
        }
      } else {
        setScrolled(false);
      }
    }
  }, [scroll.top, sizes.height]);

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
};

MTableInfinite.propTypes = {
  paging: PropTypes.oneOf(['classic', 'infinite', 'disabled']),
  maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  threshold: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
  onChangePage: PropTypes.func,
};

export default MTableInfinite;
