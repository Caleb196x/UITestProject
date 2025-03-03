"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const puerts_1 = require("puerts");
let bridgeCaller = puerts_1.argv.getByName("BridgeCaller");
let coreWidget = puerts_1.argv.getByName("CoreWidget");
bridgeCaller.MainCaller.Bind(main_1.Main);
coreWidget.ReleaseJsEnv();
//# sourceMappingURL=launch.js.map