import * as React from 'react';
import { Props, CanvasPanel, VerticalBox, HorizontalBox, 
    TextBlock, EditableText, Button, CanvasPanelSlot } 
from 'reactUMG';
import { StatusBar } from './status_bar_compoennt';
import { ButtonSlot, ButtonStyle, LinearColor, ESlateColorStylingMode, Margin} from 'ue';

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
        return <CanvasPanel >
            <VerticalBox Slot={this.SlotOfVerticalBox}>
                <HorizontalBox>
                    <TextBlock ref={this.textblock_ref} Text='Username: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                <Button OnClicked={() => this.handleLogin()}>
                    {'Login'}
                </Button>
                <StatusBar name={'Healthy: '} initialPercent={60}></StatusBar>
                </HorizontalBox>
                <HorizontalBox>
                    <input type='text' value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})} 
                                placeholder='输入内容...' aria-label='用户名' required/>
                    <button style={this.buttonStyle} onClick={()=>this.handleLogin()}>测试原生按钮</button>
                </HorizontalBox>
                <HorizontalBox>
                    <select defaultValue={"C"} onChange={(e)=>{console.log("onChange: ", e.target)}}>
                        <option value={"A"}>a</option>
                        <option value={"B"}>b</option>
                        <option value={"C"}>c</option>
                        <option value={"D"}>d</option>
                    </select>

                <progress value={this.state.progressVal} max={100}>
                    进度条
                </progress>
                <button onClick={()=>{this.setState({progressVal: Math.min(this.state.progressVal + 5, 100)})}}>增加进度</button>
                <button onClick={()=>{this.setState({progressVal: Math.max(this.state.progressVal - 5, 0)})}}>减少进度</button>
                </HorizontalBox>
            </VerticalBox>
        </CanvasPanel>
    }
}