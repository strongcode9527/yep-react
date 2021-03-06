import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import noop from '../_utils/noop';

export default class NavBar extends PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    leftIcon: PropTypes.node,
    leftContent: PropTypes.node,
    onLeftClick: PropTypes.func,
    close: PropTypes.bool,
    onCloseClick: PropTypes.func,
    rightContent: PropTypes.node,
    share: PropTypes.node,
    onRightClick: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'Yep-nav-bar',
    style: {},
    leftIcon: <Icon type="arrow-back" size="xs" />,
    //rightContent: <Icon type="lego_gengduo" />,
    onLeftClick: noop,
    onCloseClick: noop,
    onRightClick: noop,
  };

  constructor() {
    super();
  }

  render() {
    const {
      prefixCls,
      className,
      style,
      children,
      onLeftClick,
      leftIcon,
      leftContent,
      close,
      onCloseClick,
      rightContent,
      share,
      onRightClick,
    } = this.props;
    const cls = classNames(prefixCls, className);
    return (
      <div className={cls} style={style}>
        <div className={`${prefixCls}-left`} role="button">
          {leftIcon && (
            <span className={`${prefixCls}-left-icon`} onClick={onLeftClick}>
              {leftIcon}
            </span>
          )}
          <span className={`${prefixCls}-left-content`} onClick={onLeftClick}>
            {leftContent}
          </span>
          {close && (
            <div onClick={onCloseClick} className={`${prefixCls}-left-close`}>
              关闭
            </div>
          )}
        </div>

        <div className={`${prefixCls}-title`}>{children}</div>

        <div className={`${prefixCls}-right`}>
          {share && <span className={`${prefixCls}-right-share`}>{share}</span>}
          {rightContent && (
            <span className={`${prefixCls}-right-content`} onClick={onRightClick}>
              {rightContent}
            </span>
          )}
        </div>
      </div>
    );
  }
}
