import * as React from 'react';
import { Props, CanvasPanel, VerticalBox, HorizontalBox, 
    TextBlock, EditableText, Button, CanvasPanelSlot } 
from 'react-umg';
import * as UE from 'ue';

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

    ButtonStyle: UE.ButtonStyle();

    render() {
        return <CanvasPanel >
            <VerticalBox Slot={this.SlotOfVerticalBox}>
                <HorizontalBox>
                    <TextBlock Text='Username: '/>
                    <EditableText Text={this.state.username} OnTextChanged={(text) => {this.setState({username: text})}} ></EditableText>
                </HorizontalBox>
                <HorizontalBox>
                <Button OnClicked={() => this.handleLogin()}>
                    {'Login'}
                </Button>
                </HorizontalBox>
                <div className={style.container}></div>
            </VerticalBox>
        </CanvasPanel>
    }
}