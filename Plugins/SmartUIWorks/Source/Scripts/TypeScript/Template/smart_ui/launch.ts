import * as UE from 'ue'
import { Main } from "./main";
import { argv } from 'puerts';

let bridgeCaller = (argv.getByName("BridgeCaller") as UE.JsBridgeCaller);
let coreWidget = (argv.getByName("CoreWidget") as UE.SmartUICoreWidget);
bridgeCaller.MainCaller.Bind(Main);
coreWidget.ReleaseJsEnv();
