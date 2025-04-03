"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasUIExample = void 0;
const React = require("react");
const react_1 = require("react");
const UE = require("ue");
const CanvasUIExample = () => {
    const canvasRef = (0, react_1.useRef)(null);
    const [color, setColor] = (0, react_1.useState)('#ff4757');
    const [rotation, setRotation] = (0, react_1.useState)(0);
    const Container = {
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
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        console.log('canvas', canvas);
        const native = canvas.nativePtr;
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
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setColor(randomColor);
    };
    const handleRotate = () => {
        setRotation(prev => (prev + 45) % 360);
    };
    return (React.createElement("div", null,
        React.createElement("div", { style: Container },
            React.createElement("canvas", { ref: canvasRef },
                React.createElement("span", { style: { color: 'red' } }, "canvas test"),
                React.createElement("span", { style: { offsetAnchor: 'bottom fill', left: '20px' } }, "canvas center text"),
                React.createElement("button", { onClick: handleColorChange, style: { offsetAnchor: 'bottom center', bottom: '-20px' } }, "Change Color"))),
        React.createElement("div", { style: { display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-between' } },
            React.createElement("button", { onClick: handleColorChange, style: { marginRight: '1rem' } }, "Change Color"),
            React.createElement("button", { onClick: handleRotate }, "Rotate 45\u00B0"))));
};
exports.CanvasUIExample = CanvasUIExample;
//# sourceMappingURL=canvas.test.js.map