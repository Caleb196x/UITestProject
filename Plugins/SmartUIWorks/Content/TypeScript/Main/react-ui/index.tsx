import * as React from 'react';
import { VerticalBox, CanvasPanel, ReactUMG, CanvasPanelSlot, Button, HorizontalBox,/*, TextureImage*/ 
TextBlock,
EditableText,
Root} from 'reactUMG';
import {StatusBar} from './ui-components'
// import './Login.css'; // 你可以创建一个CSS文件来美化界面
interface Props {
    names: string[];
}

interface State {
    names: string[];
    buttonTextureIndex: 0 | 1;
}

interface StateLogin {
    username: string;
    password: string;
}

let SlotOfVerticalBox: CanvasPanelSlot = {
    LayoutData: {
        Offsets: {
            Left: 120,
            Top: 120,
            Right: 480,
            Bottom: 80
        }
    }
}

class Hello extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        names: props.names,
        buttonTextureIndex : 0,
      };
    }
    render() {
        return (
            <CanvasPanel>
                <VerticalBox Slot={SlotOfVerticalBox}>
                    <HorizontalBox>
                    <button onMouseEnter={() => this.setState({buttonTextureIndex: 1})} onMouseLeave={() => this.setState({buttonTextureIndex: 0})} >
                        {this.state.buttonTextureIndex == 0 ? 'normal' : 'hovered'}
                    </button>
                    </HorizontalBox>
                    {this.state.names.map((name, idx) => <StatusBar name={name} key={idx}/>)}
                </VerticalBox>
            </CanvasPanel>
        );
    }
}

let SlotOfVerticalBox2: CanvasPanelSlot = {
    LayoutData: {
        Offsets: {
            Left: 800,
            Top: 120,
            Right: 0,
            Bottom: 80
        }
    }
}

class Hello2 extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        names: props.names,
        buttonTextureIndex : 0,
      };
    }
    render() {
        return (
            <CanvasPanel>
                <VerticalBox Slot={SlotOfVerticalBox2}>
                    <HorizontalBox>
                    <button onMouseEnter={() => this.setState({buttonTextureIndex: 1})} onMouseLeave={() => this.setState({buttonTextureIndex: 0})} >
                        {this.state.buttonTextureIndex == 0 ? 'normal' : 'hovered'}
                    </button>
                    </HorizontalBox>
                    {this.state.names.map((name, idx) => <StatusBar name={name} key={idx}/>)}
                </VerticalBox>
            </CanvasPanel>
        );
    }
}

let SlotOfVerticalBoxOfLogin: CanvasPanelSlot = {
    LayoutData: {
        Offsets: {
            Left: 420,
            Top: 500,
            Right: 180,
            Bottom: 100
        }
    }
}
class Login extends React.Component<Props, StateLogin>{

    constructor(props: Props) {
        super(props);
        this.state = {
            username : 'liumingyuan',
            password : '',
        };
      }

    

    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
    };

    render() {
        return <CanvasPanel >
            <VerticalBox Slot={SlotOfVerticalBoxOfLogin}>
                <HorizontalBox>
                    <TextBlock Text='Username: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                <button onClick={() => this.handleLogin()}>
                    {'Login'}
                </button>
                </HorizontalBox>
            </VerticalBox>  
        </CanvasPanel>
    }
}

let SlotOfVerticalBoxOfLogin2: CanvasPanelSlot = {
    LayoutData: {
        Offsets: {
            Left: 620,
            Top: 500,
            Right: 180,
            Bottom: 100
        }
    }
}

class Login2 extends React.Component<Props, StateLogin>{

    constructor(props: Props) {
        super(props);
        this.state = {
            username : 'liumingyuan',
            password : '',
        };
      }

    

    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
    };

    render() {
        return <CanvasPanel >
            <VerticalBox Slot={SlotOfVerticalBoxOfLogin2}>
                <HorizontalBox>
                    <TextBlock Text='Username: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                <button onClick={() => this.handleLogin()}>
                    {'Login'}
                </button>
                </HorizontalBox>
            </VerticalBox>
        </CanvasPanel>
    }
}

export function Load() : Root{
    return ReactUMG.render(
        <CanvasPanel>
            <Hello names={["Health:", "Energy:"]}/>
            <Login names={["login"]}/>
        </CanvasPanel>

    );
};

export function HelloLoad() : Root{
    return ReactUMG.render(
        <CanvasPanel>
            <Hello2 names={["ABC:", "EFG:"]}/>
            <Login2 names={["login"]}/>
        </CanvasPanel>

    );
};
