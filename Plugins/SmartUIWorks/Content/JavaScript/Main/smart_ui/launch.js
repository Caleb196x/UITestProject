"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UE = require("ue");
const main_1 = require("./main");
const puerts_1 = require("puerts");
let coreWidget = puerts_1.argv.getByName("CoreWidget");
let callerName = coreWidget.GetWidgetName();
let bridgeCaller = new UE.JsBridgeCaller();
bridgeCaller.MainCaller.Bind(main_1.Main);
UE.JsBridgeCaller.RegisterAllocatedBrideCaller(callerName, bridgeCaller);
//# sourceMappingURL=launch.js.map