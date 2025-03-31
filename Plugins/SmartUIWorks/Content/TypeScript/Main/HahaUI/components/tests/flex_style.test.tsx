import * as React from 'react';

interface FlexStyleTestProps {}

export class FlexStyleTest extends React.Component<FlexStyleTestProps> {
    constructor(props: FlexStyleTestProps) {
        super(props);
    }

    containerStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    };

    headerStyle = {
        display: 'flex',
        flexDirection: 'row' as const,
        alignSelf: 'center',
        justifySelf: 'center',
        width: '800px',
        height: '100px',
    }

    contentStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        width: '800px',
        height: '800px',
    }

    buttonBorderStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignSelf: 'center',
        width: '800px',
        height: '200px',
        margin: '10px 20px 10px 20px',
        flex: 1
    }

    render() {
        return <div style={this.containerStyle}>
            <div style={this.headerStyle}>
                <h1 style={{alignSelf: 'center'}}>这是一个标题: 测试flex容器兼容性</h1>
            </div>
            <div style={this.contentStyle}>
                <div style={this.buttonBorderStyle}>
                    <button style={{alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(9, 216, 9, 1)'}}>开始游戏</button>
                    <button style={{alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgb(201, 39, 174)'}}>开始游戏</button>
                </div>
                <div style={this.buttonBorderStyle}>
                    <button style={{alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(179, 77, 14, 1)'}}>继续游戏</button>
                </div>
                <div style={this.buttonBorderStyle}>
                    <button style={{alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(114, 112, 111, 1)'}}>游戏设置</button>
                </div>
                <div style={this.buttonBorderStyle}>
                    <button style={{alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(13, 8, 4, 1)'}}>游戏帮助</button>
                </div>
            </div>
        </div>
    }
}