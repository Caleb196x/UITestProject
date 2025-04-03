import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import * as UE from 'ue';

export const CanvasUIExample = () => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#ff4757');
    const [rotation, setRotation] = useState(0);
  
    const Container: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: '2rem',
        backgroundColor: 'rgba(7, 227, 33, 0.4)',
        minHeight: '200px',
        width: '600px',
        height: '300px',
        justifySelf: 'center', alignSelf: 'top'
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log('canvas', canvas);
        const native = canvas.nativePtr as UE.Widget;
        console.log('native', native);
        native.SetRenderTranslation(new UE.Vector2D(50, 20));
        //const ctx = canvas.getContext('2d');
        
        // 设置Canvas实际像素尺寸
        // canvas.width = 400;
        // canvas.height = 300;

        // 绘制函数
        const draw = () => {
            console.log('draw');

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // // 保存当前画布状态
        // ctx.save();
        
        // // 移动到画布中心
        // ctx.translate(canvas.width/2, canvas.height/2);
        // ctx.rotate(rotation * Math.PI / 180);
        
        // // 绘制旋转矩形
        // ctx.fillStyle = color;
        // ctx.fillRect(-75, -75, 150, 150);
        
        // // 绘制文字
        // ctx.font = '16px Arial';
        // ctx.fillStyle = 'white';
        // ctx.textAlign = 'center';
        // ctx.fillText('Rotating Square', 0, 0);
        
        // // 恢复画布状态
        // ctx.restore();
        };

        draw();
    }, [color, rotation]);

    const handleColorChange = () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        setColor(randomColor);
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 45) % 360);
    };

    return (
        <div>

            <div style={Container}>
                <canvas ref={canvasRef}>
                    <span style={{color: 'red'}}>canvas test</span>
                    <span style={{offsetAnchor: 'bottom fill', left: '20px'}}>canvas center text</span>
                    <button onClick={handleColorChange} style={{offsetAnchor: 'bottom center', bottom: '-20px'}}>
                        Change Color
                    </button>
                </canvas>
            </div>
        
        
            <div style={{display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'space-between'}}>
                <button onClick={handleColorChange} style={{ marginRight: '1rem' }}>
                    Change Color
                </button>

                <button onClick={handleRotate}>
                    Rotate 45°
                </button>
            </div>
        </div>
    );
};