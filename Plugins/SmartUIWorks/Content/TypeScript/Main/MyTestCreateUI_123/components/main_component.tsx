import * as React from 'react';
import { Props, CanvasPanel, VerticalBox, HorizontalBox, 
    TextBlock, EditableText, Button, CanvasPanelSlot } 
from 'reactUMG';
import { StatusBar } from './status_bar_compoennt';
import './style.css';
import face from '../assets/face.png';

interface State {
    username: string;
    password: string;
    progressVal: number;
}

export class MainComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: 'test.name',
            password: '',
            progressVal: 0.0,
        };
    }

    
    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
        this.textblock_ref.current.nativePtr.SetText('你好啊, ' + this.state.username);
        // this.css.color = '#0f13';
    };

    SlotOfVerticalBox: CanvasPanelSlot = {
        LayoutData: {
            Offsets: {
                Left: 120,
                Top: 100,
                Right: 180,
                Bottom: 100
            }
        }
    }

    textblock_ref = React.createRef<TextBlock>();
    css: React.CSSProperties;

    buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      };
      
    
    render() {
        return <VerticalBox >
                <HorizontalBox>
                    <TextBlock ref={this.textblock_ref} Text='Username: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                <Button OnClicked={() => this.handleLogin()} RenderTransform={{Translation: {X: 100, Y: 100}}}>
                    {'Login'}
                </Button>
                <StatusBar name={'Healthy: '} initialPercent={60}></StatusBar>
                </HorizontalBox>
                <HorizontalBox>
                    <input type='text' value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})} 
                                placeholder='输入内容...' aria-label='用户名' required/>
                    <button style={this.buttonStyle} onClick={()=>this.handleLogin()}>测试原生按钮</button>
                </HorizontalBox>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <select style={{alignSelf: 'flex-start'}} defaultValue={"C"} onChange={(e)=>{console.log("onChange: ", e.target)}}>
                        <option value={"A"}>a</option>
                        <option value={"B"}>b</option>
                        <option value={"C"}>c</option>
                        <option value={"D"}>🎮 d</option>
                    </select>

                    <img src={face} style={{width: '100%', height: '100%'}}/>

                    <progress style={{alignSelf: 'stretch'}} value={this.state.progressVal} max={100}>
                        进度条
                    </progress>
                    <button style={{alignSelf: 'end'}} onClick={()=>{this.setState({progressVal: Math.min(this.state.progressVal + 5, 100)})}}>增加进度</button>
                    <button style={{alignSelf: 'satrt'}} onClick={()=>{this.setState({progressVal: Math.max(this.state.progressVal - 5, 0)})}}>减少进度</button>
                    <div style={{overflow: 'scroll', scrollbarWidth: 'thin', scrollPadding: '5px', justifyContent: 'space-between'}}>
                        <text style={{width: '100%', height: '100%'}}>scroll-1</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-2</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-3</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-4</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-5</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-6</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-7</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-8</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-9</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-10</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-11</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-12</text>
                        <text style={{width: '100%', height: '100%'}}>scroll-13</text>
                    </div>
                </div>
                <div className='container'>
                    <div className='item'>1</div>
                    <div className='item'>2</div>
                    <div className='item'>3</div>
                </div>

            </VerticalBox>
    }
}