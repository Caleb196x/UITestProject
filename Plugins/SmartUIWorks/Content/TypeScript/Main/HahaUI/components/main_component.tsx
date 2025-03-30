import * as React from 'react';
import { Props, CanvasPanel, VerticalBox, HorizontalBox, 
    TextBlock, EditableText, Button, CanvasPanelSlot, SizeBox } 
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
        return  <canvas>
                    <div style={{display: 'flex', 
                        flexDirection: 'row', justifyContent: 'space-between', 
                        top: '100px', left: '100px', width: '200px', height: '50px',
                    }}>
                        <TextBlock ref={this.textblock_ref} Text='Username: '/>
                        <EditableText 
                            Text={this.state.username} 
                            OnTextChanged={(text) => {this.setState({username: text})}}></EditableText>
                    </div>
                    <div style={{display: 'flex', 
                        flexDirection: 'column', justifyContent: 'space-between',
                        top: '200px', left: '400px', 
                        width: '200px', height: '100px', objectFit: 'contain'
                    }}>
                        <Button OnClicked={() => this.handleLogin()}>
                        {'Login'}
                        </Button>
                        <StatusBar name={'Healthy: '} initialPercent={60}></StatusBar>
                    </div>
                    <div>
                        <input type='text' value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})} 
                                placeholder='输入内容...' aria-label='用户名' required/>
                        <button style={this.buttonStyle} onClick={()=>this.handleLogin()}>测试原生按钮</button>
                        
                    </div>
                    <div style={{
                        display: 'flex', flexDirection: 'row', 
                        alignItems: 'center', justifyContent: 'center',
                        offsetAnchor: 'top center', top: '250px', 
                        transform: 'rotate3d(1, 1, 1, 45deg)', 
                        positionX: 100, positionY: 100,
                        objectFit: 'contain', visibility: 'visible', 
                        gridRow: '1 / 3', gridColumn: '1 / 3', disable: true
                    }}>
                        <select style={{backgroundPosition: 'center', 
                            alignSelf: 'flex-end', 
                            backgroundRepeat: 'no-repeat'}} 
                            defaultValue={"C"} 
                            onChange={(e)=>{console.log("onChange: ", e.target)}}>
                            <option value={"A"}>a</option>
                            <option value={"B"}>b</option>
                            <option value={"C"}>c</option>
                            <option value={"D"}>d</option>
                        </select>

                        <img src={face} style={{width: '100px', height: '100px'}}/>

                        <progress style={{alignSelf: 'stretch'}} 
                        value={this.state.progressVal} max={100}>
                            进度条
                        </progress>
                        <button style={{objectFit: 'contain', alignSelf: 'end'}} 
                            onClick={()=>{this.setState({progressVal: Math.min(this.state.progressVal + 5, 100)})}}>
                            增加进度
                        </button>
                        <button style={{objectFit: 'contain', alignSelf: 'start'}} 
                            onClick={()=>{this.setState({progressVal: Math.max(this.state.progressVal - 5, 0)})}}>
                            减少进度
                        </button>

                        <div style={{overflow: 'scroll', 
                            backgroundImage: `url(${face})`,
                            scrollbarWidth: 'auto', scrollPadding: '5px', 
                            alignSelf: 'start', width: '100px', height: '30px', 
                            positionAnchor: 'top left',  
                            objectFit: 'contain', flexFlow: 'row wrap'
                        }}>
                            <text style={{width: '100%', height: '100%'}}>scroll-1</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-2</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-3</text>
                        </div>
                    </div>
                    <div className='container'>
                        <button>This is a placeholder button</button>
                        <div className='scrollbox'>
                            <text style={{width: '100%', height: '100%'}}>scroll-1</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-2</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-3</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-4</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-5</text>
                            <text style={{width: '100%', height: '100%'}}>scroll-6 🎮</text>
                        </div>
                    </div>
        </canvas>

    }
}