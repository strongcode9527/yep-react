---
order: 0
title: 基础用法
description:
---

```js
import React from 'react';
import {Message} from '@jdcfe/yep-react';

class Demo extends React.PureComponent {
  render() {
    const aStyle = {
      display: 'inline-block',
      border: 'solid 1px #eee',
      padding: '10px',
      margin: '10px 10px',
    };
    return (
      <div>
        <Message tipType="error">电话号码无效</Message>
        <br />
        <Message tipType="warn">
          <p>
            <b style={{color: 'red'}}>注意：</b>小心熊出没
          </p>
          <p>光头强要小心啦！</p>
        </Message>
        <Message tipType="error" duration={3000} position="fix-top">
          顶部通知，3秒后消失
        </Message>
        <Message
          position="fix-bottom"
          ref={message2 => {
            this.message2 = message2;
          }}
        >
          底部通知
        </Message>
        <a
          style={aStyle}
          onClick={() => {
            this.message2.showMessage();
          }}
        >
          显示底部通知
        </a>
        <a
          style={aStyle}
          onClick={() => {
            this.message2.closeMessage();
          }}
        >
          关闭底部通知
        </a>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
