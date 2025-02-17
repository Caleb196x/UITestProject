import * as UE from 'ue'
import { Main } from "./main";
import { argv } from 'puerts';

let coreWidget = (argv.getByName("CoreWidget") as UE.SmartUICoreWidget);

let callerName = coreWidget.GetWidgetName();
let bridgeCaller = new UE.JsBridgeCaller();
bridgeCaller.MainCaller.Bind(Main);

UE.JsBridgeCaller.RegisterAllocatedBrideCaller(callerName, bridgeCaller);
