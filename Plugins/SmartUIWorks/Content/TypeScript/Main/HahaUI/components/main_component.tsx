import * as React from 'react';
import { Props, CanvasPanel, VerticalBox, HorizontalBox, 
    TextBlock, EditableText, Button, CanvasPanelSlot } 
from 'reactUMG';
import {EButtonClickMethod} from 'ue';
import face from '../assets/face.png';

interface State {
    username: string;
    password: string;
}

export class MainComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    
    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
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
    
    render() {
        return <CanvasPanel >
            <VerticalBox Slot={this.SlotOfVerticalBox}>
                <HorizontalBox>
                    <TextBlock Text='用户名: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                    <Button OnClicked={() => this.handleLogin()} ClickMethod={EButtonClickMethod.MouseDown}>
                        {'登录'}
                    </Button>
                </HorizontalBox>
                <HorizontalBox>
                    <select onChange={(e) => this.handleLogin()} defaultValue={'test1'}>
                        <option>test1</option>
                        <option>test2</option>
                    </select>
                    <textarea onSubmit={(e)=>{console.log(e.target)}}></textarea>
                </HorizontalBox>
                <HorizontalBox>
                    <button onClick={()=>{console.log("hello")}} 
                            onMouseDown={()=>{console.log("mouse down and press")}} 
                            onMouseUp={()=>{console.log("mouse up and release")}}
                            onMouseEnter={()=>{console.log("mouse enter")}}
                            onMouseLeave={()=>{console.log("mouse leave")}}
                            title='hello'>
                                {'原生按钮'}
                    </button>
                    <p>这是一个富文本嵌入测试<mark>高亮文字</mark>文本结束了！<strong>嵌套加粗</strong></p>
                </HorizontalBox>
                <HorizontalBox>
                    <img src={face} width={512} height={512}/>
                    <textarea defaultValue={'默认内容'} placeholder='请输入多行内容...' 
                            onChange={(e)=>{console.log("on change: " + e.target.value)}} 
                            onSubmit={(e) => {console.log("on submit: " + e.target)}}
                            onBlur={(e)=>{console.log("on blur: " + e.target.value)}}></textarea>
                    <div style={{backgroundImage: 'url(face.png)', backgroundSize: 'cover', backgroundPosition: 'center', 
                        width: '512px', height: '512px', justifyContent: 'stretch', padding: '10px', gap: '10px'}}>

                    </div>
                </HorizontalBox>
                <HorizontalBox>
                    <ul>
                        <li>
                            <button onClick={()=>{console.log('button1 click')}}>按钮1</button>
                        </li>
                        <li>
                            <button onClick={()=>{console.log('button2 click')}}>按钮2</button>
                        </li>
                        <li>
                            <button onClick={()=>{console.log('button3 click')}}>按钮3</button>
                        </li>
                        <li>
                            <button onClick={()=>{console.log('button4 click')}}>按钮4</button>
                        </li>
                    </ul>
                </HorizontalBox>

            </VerticalBox>

            {/* <div style={{ 
                width: 100, 
                height: "200px", 
                backgroundColor: "lightblue",
                border: "2px solid darkblue"
                }}>
                    内联样式示例
            </div>
            <view className='test.container'></view> */}
        </CanvasPanel>
    }
}