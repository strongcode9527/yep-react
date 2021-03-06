import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import noop from '../_utils/noop';
// TODO 兼容检查
export default class Upload extends PureComponent {
  static propTypes = {
    // 已上传的图片列表
    files: PropTypes.arrayOf(PropTypes.object),

    size: PropTypes.string,

    addImage: PropTypes.func,

    removeImage: PropTypes.func,

    // 是否支持多选
    // multiple: PropTypes.bool,
  };

  static defaultProps = {
    files: [],
    size: '75px',
    addImage: noop,
    removeImage: noop,
    // multiple: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.fileChange = this.fileChange.bind(this);
  }

  addImagePriv(imgItem) {
    this.props.addImage(imgItem);
  }

  removeImagePriv(index) {
    this.props.removeImage(index);
  }

  fileChange({target}) {
    const file = target.files[0];

    if (file.size > 500 * 1024) {
      throw new Error('图片超过500k规定大小');
    }

    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      if (!dataUrl) {
        return;
      }

      this.addImagePriv({
        url: dataUrl,
      });
    };

    reader.readAsDataURL(file);

    this.input.value = '';
  }

  render() {
    const {files, size} = this.props;
    const wrapperCls = classNames('Yep-upload-wrapper');
    return (
      <div className={wrapperCls}>
        {files.map((imgItem, index) => (
          /* eslint-disable react/no-array-index-key */
          <div className="upload-flex-item" key={index}>
            <div
              className="upload-flex-item-del"
              onClick={() => {
                this.removeImagePriv(index);
              }}
            />
            <div
              className="upload-flex-item-img"
              style={{width: size, height: size, backgroundImage: `url(${imgItem.url})`}}
            />
          </div>
        ))}
        <div className="upload-flex-item upload-add">
          <div className="upload-add-picker" style={{width: size, height: size}}>
            <input
              ref={input => {
                this.input = input;
              }}
              type="file"
              accept="image/*"
              onChange={this.fileChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
