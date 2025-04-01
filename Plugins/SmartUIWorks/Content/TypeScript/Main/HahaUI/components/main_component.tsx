import * as React from 'react';
import { Props } from 'reactUMG';
import './style.css';
import face from '@assets/face.png';
import { FlexStyleTest } from './tests/flex_style.test';
import { ColorTest } from './tests/color.test';
import { BackgroundPositionTest } from './tests/bg_position_img.test';

interface State {
    username: string;
    password: string;
}

export class MainComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        
        // 初始化状态
        this.state = {
          username: '输入用户名',
          password: '输入密码',
        };
    }
      // 渲染方法
      render() {
        return <BackgroundPositionTest />
    }
}