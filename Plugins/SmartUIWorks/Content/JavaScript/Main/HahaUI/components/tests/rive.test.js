"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiveUIExample = void 0;
const React = require("react");
const reactUMG_1 = require("reactUMG");
const react_1 = require("react");
const dance_riv_1 = require("../../assets/dance.riv");
const RiveUIExample = () => {
    const riveRef = (0, react_1.useRef)(null);
    return (React.createElement("canvas", null,
        React.createElement(reactUMG_1.Rive, { ref: riveRef, style: { width: '400px', height: '400px',
                justifySelf: 'center', positionAnchor: 'center center' }, rive: dance_riv_1.default })));
};
exports.RiveUIExample = RiveUIExample;
//# sourceMappingURL=rive.test.js.map