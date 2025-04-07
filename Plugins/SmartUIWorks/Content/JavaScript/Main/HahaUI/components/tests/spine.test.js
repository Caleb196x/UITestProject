"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpineUIExample = void 0;
const React = require("react");
const raptor_pro_json_1 = require("../../assets/raptor-pro.json");
const raptor_atlas_1 = require("../../assets/raptor.atlas");
const reactUMG_1 = require("reactUMG");
const SpineUIExample = () => {
    return (React.createElement("canvas", null,
        React.createElement(reactUMG_1.Spine, { style: { width: '400px', height: '400px', justifySelf: 'center', positionAnchor: 'center center' }, skel: raptor_pro_json_1.default, atlas: raptor_atlas_1.default })));
};
exports.SpineUIExample = SpineUIExample;
//# sourceMappingURL=spine.test.js.map