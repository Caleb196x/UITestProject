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
    const [translation, setTranslation] = (0, react_1.useState)({ x: 0, y: 0 });
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
        justifySelf: 'center', alignSelf: 'top',
        aspectRatio: '16/9',
    };
    (0, react_1.useEffect)(() => {
        //const ctx = canvas.getContext('2d');
        // 设置Canvas实际像素尺寸
        // canvas.width = 400;
        // canvas.height = 300;
        const canvas = canvasRef.current;
        const native = canvas.nativePtr;
        native.SetRenderTransformAngle(rotation);
        native.SetRenderTranslation(new UE.Vector2D(translation.x, translation.y));
    }, [color, rotation, translation]);
    const handleColorChange = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setColor(randomColor);
    };
    const handleTranslate = () => {
        setTranslation(prev => ({ x: prev.x + 10, y: prev.y + 10 }));
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
            React.createElement("button", { title: 'change canvas translation', onClick: handleTranslate, style: { marginRight: '1rem' } }, "Change location"),
            React.createElement("button", { title: 'rotate canvas', onClick: handleRotate }, "Rotate 45\u00B0"))));
};
exports.CanvasUIExample = CanvasUIExample;
//# sourceMappingURL=canvas.test.js.map