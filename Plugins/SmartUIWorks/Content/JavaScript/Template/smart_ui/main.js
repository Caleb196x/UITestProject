"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Components = require("./components");
const puerts_1 = require("puerts");
const react_umg_1 = require("react-umg");
let coreWidget = puerts_1.argv.getByName("CoreWidget");
react_umg_1.ReactUMG.init(coreWidget);
function Main() {
    return react_umg_1.ReactUMG.render(React.createElement(Components.MainComponent, null));
}
Main();
// todo: call release when js file exits
react_umg_1.ReactUMG.release();
//# sourceMappingURL=main.js.map