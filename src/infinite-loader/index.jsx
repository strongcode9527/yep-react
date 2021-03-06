import React, {PureComponent} from 'react';
import throttle from 'lodash/throttle';
import type {InfiniteLoaderPropTypes} from './types';

export default class InfiniteLoader extends PureComponent<InfiniteLoaderPropTypes> {
  static defaultProps = {
    pullDownToRefreshContent: <h3>Pull down to refresh</h3>,
    releaseToRefreshContent: <h3>Release to refresh</h3>,
    pullDownToRefreshThreshold: 100,
    disableBrowserPullToRefresh: true,
    style: {},
    className: 'Yep-infinite-loader',
  };

  constructor(props) {
    super();
    this.state = {
      showLoader: false,
      lastScrollTop: 0,
      actionTriggered: false,
      pullToRefreshThresholdBreached: false,
    };
    // variables to keep track of pull down behaviour
    this.startY = 0;
    this.currentY = 0;
    this.dragging = false;
    // will be populated in componentDidMount
    // based on the height of the pull down element
    this.maxPullDownDistance = 0;

    this.onScrollListener = this.onScrollListener.bind(this);
    this.throttledOnScrollListener = throttle(this.onScrollListener, 150).bind(this);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.getScrollableTarget = this.getScrollableTarget.bind(this);
  }

  componentDidMount() {
    this._scrollableNode = this.getScrollableTarget();
    this.el = this.props.height ? this._infScroll : this._scrollableNode || window;
    this.el.addEventListener('scroll', this.throttledOnScrollListener);

    if (typeof this.props.initialScrollY === 'number' && this.el.scrollHeight > this.props.initialScrollY) {
      this.el.scrollTo(0, this.props.initialScrollY);
    }

    if (this.props.pullDownToRefresh) {
      this.el.addEventListener('touchstart', this.onStart);
      this.el.addEventListener('touchmove', this.onMove);
      this.el.addEventListener('touchend', this.onEnd);

      this.el.addEventListener('mousedown', this.onStart);
      this.el.addEventListener('mousemove', this.onMove);
      this.el.addEventListener('mouseup', this.onEnd);

      // get BCR of pullDown element to position it above
      this.maxPullDownDistance = this._pullDown.firstChild.getBoundingClientRect().height;
      this.forceUpdate();

      if (typeof this.props.refreshFunction !== 'function') {
        throw new Error(
          `Mandatory prop "refreshFunction" missing.
          Pull Down To Refresh functionality will not work
          as expected.'`
        );
      }
    }
  }

  componentWillUnmount() {
    this.el.removeEventListener('scroll', this.throttledOnScrollListener);

    if (this.props.pullDownToRefresh) {
      this.el.removeEventListener('touchstart', this.onStart);
      this.el.removeEventListener('touchmove', this.onMove);
      this.el.removeEventListener('touchend', this.onEnd);

      this.el.removeEventListener('mousedown', this.onStart);
      this.el.removeEventListener('mousemove', this.onMove);
      this.el.removeEventListener('mouseup', this.onEnd);
    }
  }

  componentWillReceiveProps(props) {
    // do nothing when dataLength is unchanged
    if (this.props.dataLength === props.dataLength) return;

    // update state when new data was sent in
    this.setState({
      showLoader: false,
      actionTriggered: false,
      pullToRefreshThresholdBreached: false,
    });
  }

  getScrollableTarget() {
    if (this.props.scrollableTarget instanceof HTMLElement) return this.props.scrollableTarget;
    if (typeof this.props.scrollableTarget === 'string') {
      return document.getElementById(this.props.scrollableTarget);
    }
    if (this.props.scrollableTarget === null) {
      console.warn(`You are trying to pass scrollableTarget but it is null. This might
        happen because the element may not have been added to DOM yet.
      `);
    }
    return null;
  }

  onStart(evt) {
    if (this.state.lastScrollTop) return;

    this.dragging = true;
    this.startY = evt.pageY || evt.touches[0].pageY;
    this.currentY = this.startY;

    this._infScroll.style.willChange = 'transform';
    this._infScroll.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
  }

  onMove(evt) {
    if (!this.dragging) return;
    this.currentY = evt.pageY || evt.touches[0].pageY;

    // user is scrolling down to up
    if (this.currentY < this.startY) return;

    if (this.currentY - this.startY >= this.props.pullDownToRefreshThreshold) {
      this.setState({
        pullToRefreshThresholdBreached: true,
      });
    }

    // so you can drag upto 1.5 times of the maxPullDownDistance
    if (this.currentY - this.startY > this.maxPullDownDistance * 1.5) return;

    this._infScroll.style.overflow = 'visible';
    this._infScroll.style.transform = `translate3d(0px, ${this.currentY - this.startY}px, 0px)`;
  }

  onEnd(evt) {
    this.startY = 0;
    this.currentY = 0;

    this.dragging = false;

    if (this.state.pullToRefreshThresholdBreached) {
      this.props.refreshFunction && this.props.refreshFunction();
    }

    requestAnimationFrame(() => {
      this._infScroll.style.overflow = 'auto';
      this._infScroll.style.transform = 'none';
      this._infScroll.style.willChange = 'none';
    });
  }

  isElementAtBottom(target, scrollThreshold = 0.8) {
    const clientHeight =
      target === document.body || target === document.documentElement ? window.screen.availHeight : target.clientHeight;

    return target.scrollTop + clientHeight >= scrollThreshold * target.scrollHeight;
  }

  onScrollListener(event) {
    if (typeof this.props.onScroll === 'function') {
      // Execute this callback in next tick so that it does not affect the
      // functionality of the library.
      setTimeout(() => this.props.onScroll(event), 0);
    }

    const target =
      this.props.height || this._scrollableNode
        ? event.target
        : document.documentElement.scrollTop
          ? document.documentElement
          : document.body;

    // return immediately if the action has already been triggered,
    // prevents multiple triggers.
    if (this.state.actionTriggered) return;

    const atBottom = this.isElementAtBottom(target, this.props.scrollThreshold);

    // call the `next` function in the props to trigger the next data fetch
    if (atBottom && this.props.hasMore) {
      this.setState({actionTriggered: true, showLoader: true});
      this.props.loadMore();
    }
    this.setState({lastScrollTop: target.scrollTop});
  }

  render() {
    const {
      className,
      style,
      pullDownToRefresh,
      hasChildren,
      children,
      height,
      releaseToRefreshContent,
      pullDownToRefreshContent,
      hasMore,
      endMessage,
      loader,
    } = this.props;
    const componentStyle = {
      height: height || 'auto',
      //overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      ...style,
    };
    const hasChild = hasChildren || !!(children && children.length);

    // because heighted infiniteScroll visualy breaks
    // on drag down as overflow becomes visible
    const outerDivStyle = pullDownToRefresh && height ? {overflow: 'auto'} : {};
    return (
      <div style={outerDivStyle}>
        <div className={className} ref={infScroll => (this._infScroll = infScroll)} style={componentStyle}>
          {pullDownToRefresh && (
            <div style={{position: 'relative'}} ref={pullDown => (this._pullDown = pullDown)}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: -1 * this.maxPullDownDistance,
                }}
              >
                {!this.state.pullToRefreshThresholdBreached && pullDownToRefreshContent}
                {this.state.pullToRefreshThresholdBreached && releaseToRefreshContent}
              </div>
            </div>
          )}
          {children}
          {!this.state.showLoader && !hasChild && hasMore && loader}
          {this.state.showLoader && hasMore && loader}
          {!hasMore && endMessage}
        </div>
      </div>
    );
  }
}
