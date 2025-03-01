"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = Main;
const React = require("react");
const Components = require("./components/main_component");
const reactUMG_1 = require("reactUMG");
function Main(coreWidget) {
    console.log("running smart ui main");
    reactUMG_1.ReactUMG.init(coreWidget);
    return reactUMG_1.ReactUMG.render(React.createElement(Components.MainComponent, null));
}
//# sourceMappingURL=main.js.map