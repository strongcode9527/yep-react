import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Scratch extends PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    scratchImgUrl: PropTypes.string,
    resPercent: PropTypes.number,
    resCallback: PropTypes.func,
    children: PropTypes.element,
  };

  static defaultProps = {
    prefixCls: 'Yep-scratch',
    style: {},
    scratchImgUrl: 'http://img12.360buyimg.com/uba/jfs/t20377/335/194083123/261/85331804/5b02899bN0571f2a7.png',
  };

  constructor() {
    super();
    this.state = {
      isAreaShow: true,
      isArea2Show: false,
    };
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  componentDidMount() {
    const wrap_canvas = document.getElementById('wrap_canvas');
    const icanvas = document.getElementById('myCanvas');
    // if (wrap_canvas && icanvas) {
    const iwidth = wrap_canvas.clientWidth;
    const iheight = wrap_canvas.clientHeight;

    icanvas.width = iwidth;
    icanvas.height = iheight;

    // var drawMode = false;

    let context = icanvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // context.fillStyle = 'rgb(193,193,193)';
    // context.fillRect(0, 0, iwidth, iheight);
    let imgObj = new Image();
    imgObj.crossOrigin = 'Anonymous';
    imgObj.src = this.props.scratchImgUrl;
    //待图片加载完后，将其显示在canvas上
    imgObj.onload = function() {
      context.drawImage(imgObj, 0, 0, iwidth, iheight); //this即是imgObj,保持图片的原始大小：470*480
      //ctx.drawImage(this, 0, 0,1024,768); //改变图片的大小到1024*768

      // 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。(源图像：刮痕区域，目标图像：带图片的初始canvas)
      context.globalCompositeOperation = 'destination-out';
    };
    // context.font = '24px 微软雅黑';
    // context.fillStyle = '#454444';
    // var txt = '刮这里';

    // context.fillText(txt, iwidth / 2 - context.measureText(txt).width / 2, iheight / 2 + 9);
    // context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 30;
    // }
  }

  touchStart(e) {
    var icanvas = document.getElementById('myCanvas');
    var context = icanvas.getContext('2d');
    context.beginPath();
    var rect = icanvas.getBoundingClientRect();
    context.moveTo(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    // $("#area2").show();
  }

  touchMove(e) {
    // $icanvas.off('touchmove');
    e.persist();
    this.setState({
      isArea2Show: true,
    });
    // var e = event;
    var icanvas = document.getElementById('myCanvas');
    var context = icanvas.getContext('2d');

    // if (this.state.down) {
    var rect = icanvas.getBoundingClientRect();

    context.lineTo(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    context.stroke();
    // }
    var iwidth = wrap_canvas.clientWidth;
    var iheight = wrap_canvas.clientHeight;
    var imgData = context.getImageData(0, 0, iwidth, iheight),
      pixles = imgData.data,
      transPixs = [];
    for (var i = 0, j = pixles.length; i < j; i += 4) {
      var a = pixles[i + 3];
      if (a < 128) {
        transPixs.push(i);
      }
    }
    if (
      ((transPixs.length / (pixles.length / 4)) * 100).toFixed(2) >
      (this.props.resPercent >= 0 ? this.props.resPercent : 60)
    ) {
      this.props.resCallback();
      this.setState({
        isAreaShow: false,
      });
    }
    e.preventDefault && e.preventDefault();
    e.returnValue = false;
    e.stopPropagation && e.stopPropagation();
    return false;
  }

  touchEnd() {
    // $icanvas.off('touchend');
    // this.setState({
    //   down: false,
    // });
  }

  render() {
    const {prefixCls, className, style} = this.props;
    const cls = classNames(prefixCls, className);
    return (
      <div className={cls} style={style}>
        {this.state.isAreaShow && (
          <div className="area" id="wrap_canvas">
            <canvas
              id="myCanvas"
              onTouchStart={this.touchStart}
              onTouchMove={this.touchMove}
              onTouchEnd={this.touchEnd}
            />
          </div>
        )}
        {this.state.isArea2Show && (
          <div className="area2" id="area2">
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}
