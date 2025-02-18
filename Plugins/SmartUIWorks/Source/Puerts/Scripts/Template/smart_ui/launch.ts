import * as UE from 'ue'
import { Main } from "./main";
import { argv } from 'puerts';

let bridgeCaller = (argv.getByName("BridgeCaller") as UE.JsBridgeCaller);

// let callerName = coreWidget.GetWidgetName();
// let bridgeCaller = new UE.JsBridgeCaller();
bridgeCaller.MainCaller.Bind(Main);

// UE.JsBridgeCaller.RegisterAllocatedBrideCaller(callerName, bridgeCaller);
