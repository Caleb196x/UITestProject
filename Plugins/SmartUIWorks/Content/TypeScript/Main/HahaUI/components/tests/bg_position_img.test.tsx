import * as React from 'react';
// import face from '@assets/face.png' // fixme@Caleb196x: 这种路径写法在require中无法加载
import face from '../../../assets/face.png'

interface BackgroundPositionTestProps {}

export class BackgroundPositionTest extends React.Component<BackgroundPositionTestProps> {
    constructor(props: BackgroundPositionTestProps) {
        super(props);
    }
    
    render() {
        return (
            <div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifySelf: 'center', alignSelf: 'center',
                width: '600px', height: '600px', backgroundColor: 'blanchedalmond'}}>
                <div style={{ 
                    backgroundImage: `url(${face})`, 
                    backgroundColor: '#45a0a0', 
                    backgroundSize: 'cover', width: '50px', height: '50px',
                    backgroundPosition: 'top left', color: 'rgba(87, 161, 3, 0.7)'}}>
                    <span>top left Position Test rgb(143, 3, 3)</span>
                </div>
                <div style={{ 
                    backgroundPosition: 'top center', backgroundColor: 'blue',
                    color: 'rgba(3, 27, 161, 0.7)'}}>
                    <span>top center Position Test</span>
                </div>
                <div style={{ 
                    backgroundPosition: 'top right',
                    color: 'rgba(203, 18, 11, 0.7)'}}>
                    <span>top right Position Test</span>
                </div>
                <div style={{ 
                    backgroundPosition: 'left right', backgroundColor: 'transparent',
                    color: 'rgba(186, 8, 240, 0.7)'}}>
                    <span>left right Position Test</span>
                </div>
                <div style={{ backgroundPosition: 'right center', color: 'rgba(23, 128, 144, 0.7)'}}>
                    <span>right center Position Test</span>
                </div>
                <div style={{ backgroundPosition: 'bottom', color: 'rgba(54, 177, 173, 0.7)'}}>
                    <span>bottom Position Test</span>
                </div>
                <div style={{ backgroundPosition: '2em 2em', color: 'rgba(82, 55, 55, 0.7)'}}>
                    <span>2em 2em Position Test</span>
                </div>
                <div style={{ backgroundPosition: 'left bottom 25px', backgroundColor: 'transparent',  color: 'rgba(176, 72, 72, 0.7)'}}>
                    <span>bottom 25px 10px Position Test</span>
                </div>
                <div style={{ backgroundPosition: 'center 2em right 2em', color: 'rgba(28, 28, 226, 0.7)'}}>
                    <span>center 2em right 2em Position Test</span>
                </div>
            </div>
            </div>
        );
    }
}
