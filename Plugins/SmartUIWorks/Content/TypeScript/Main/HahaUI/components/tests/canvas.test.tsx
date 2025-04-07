import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import * as UE from 'ue';

export const CanvasUIExample = () => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#ff4757');
    const [rotation, setRotation] = useState(0);
    const [translation, setTranslation] = useState({x: 0, y: 0});
  
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
        justifySelf: 'center', alignSelf: 'top',
        aspectRatio: '16/9',
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const native = canvas.nativePtr as UE.Widget;
        native.SetRenderTransformAngle(rotation);
        native.SetRenderTranslation(new UE.Vector2D(translation.x, translation.y));
    }, [color, rotation, translation]);

    const handleColorChange = () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        setColor(randomColor);
        
    };

    const handleTranslate = () => {
        setTranslation(prev => ({x: prev.x + 10, y: prev.y + 10}));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 45) % 360);
    };

    return (
        <div>

            <div style={Container} >
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
                <button title='change canvas translation' onClick={handleTranslate} style={{ marginRight: '1rem' }}>
                    Change location
                </button>

                <button title='rotate canvas' onClick={handleRotate}>
                    Rotate 45°
                </button>
            </div>
        </div>
    );
};