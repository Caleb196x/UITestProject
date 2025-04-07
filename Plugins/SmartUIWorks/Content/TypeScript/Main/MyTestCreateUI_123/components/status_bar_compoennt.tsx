import * as React from 'react';
import { Button, HorizontalBox, TextBlock, ProgressBar, HorizontalBoxSlot } from 'reactUMG';
import {LinearColor} from 'ue'
// import styles from './styles.module.css';

export interface Props {
    name: string;
    initialPercent?: number;
}

interface State {
    percent: number;
}

let SlotOfProgressBar: HorizontalBoxSlot = {
    Size: {
        Value: 100,
        SizeRule: 1
    },
    Padding: {
        Left: 100,
        Right: 10,
    },
}

export class StatusBar extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
  
      if ((props.initialPercent || 0) < 0) {
        throw new Error('initialPercent < 0');
      }
  
      this.state = {
        percent: props.initialPercent || 0.5
      };
    }

    get color(): Partial<LinearColor> {
        return {R: 1 - this.state.percent , G: 0, B: this.state.percent};
    }
  
    onIncrement = () => this.setState({percent: this.state.percent + 0.01});
    onDecrement = () => this.setState({percent: this.state.percent - 0.01});
    onNativeClick = () => console.log('native button clicked');
    
    render() {
        return (
            <HorizontalBox Slot={SlotOfProgressBar}>
                <TextBlock Text={`${this.props.name}(${this.state.percent.toFixed(2)})`}/>
                <ProgressBar precent={this.state.percent}/>
                <button onClick={this.onIncrement}>+</button>
                <button onClick={this.onDecrement}>-</button>
                <TextBlock Text={'热重载测试_叽叽咋咋'} />
            </HorizontalBox>
        );
    }
}