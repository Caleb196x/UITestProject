"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpineUIExample = void 0;
const React = require("react");
const ui_xinzhangjie_json_1 = require("../../assets/ui_xinzhangjie.json");
const reactUMG_1 = require("reactUMG");
const react_1 = require("react");
const SpineUIExample = () => {
    const spineRef = (0, react_1.useRef)(null);
    const [index, setIndex] = (0, react_1.useState)(2);
    const anims = ['enter', 'idle', 'attack', 'death'];
    const handleChangeAnimation = () => {
        setIndex((prevIndex) => {
            console.log('change animation ' + anims[prevIndex] + ' ' + prevIndex);
            spineRef.current?.nativePtr.SetAnimation(0, anims[prevIndex], true);
            const newIndex = (prevIndex + 1) % anims.length;
            console.log('new index: ' + newIndex);
            return newIndex;
        });
    };
    return (React.createElement("canvas", null,
        React.createElement(reactUMG_1.Spine, { ref: spineRef, style: { width: '400px', height: '400px',
                justifySelf: 'center', positionAnchor: 'center center' }, skel: ui_xinzhangjie_json_1.default, initAnimation: 'enter' }),
        React.createElement("button", { style: { positionAnchor: 'center center', top: '-20px', left: '-50px' }, onClick: handleChangeAnimation }, "Change Animation")));
};
exports.SpineUIExample = SpineUIExample;
//# sourceMappingURL=spine.test.js.map