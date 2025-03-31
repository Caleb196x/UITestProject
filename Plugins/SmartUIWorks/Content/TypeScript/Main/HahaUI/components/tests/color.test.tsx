import * as React from 'react';

interface ColorTestProps {}

export class ColorTest extends React.Component<ColorTestProps> {
    constructor(props: ColorTestProps) {
        super(props);
    }
    
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ backgroundColor: 'red', margin: '20px' }}>
                    <span>red background</span>
                </div>
                <div style={{ backgroundColor: 'saddlebrown', color: 'darkorchid', margin: '20px' }}>
                    <span>green background and darkorchid content</span>
                </div>
                <div style={{ backgroundColor: 'rgb(0, 0, 255)', margin: '20px' }}>
                    <span>blue background with rgb(0, 0, 255)</span>
                </div>
                <div style={{ backgroundColor: 'rgba(135, 206, 235, 0.5)', margin: '20px' }}>
                    <span>grey background with rgba(135, 206, 235, 0.5)</span>
                </div>
                <div style={{ backgroundColor: 'hsl(113, 86.50%, 29.00%)', margin: '20px' }}>
                    <span>gree background with hsl(113, 86.50%, 29.00%)</span>
                </div>
                <div style={{ backgroundColor: 'hsla(58, 82.00%, 48.00%, 0.71)', margin: '20px' }}>
                    <span>yellow background with hsla(58, 82.00%, 48.00%, 0.71)</span>
                </div>
                <div style={{ backgroundColor: '#17faf0', margin: '20px' }}>
                    <span>cyan background with #17faf0</span>
                </div>
            </div>
        );
    }
    
}
