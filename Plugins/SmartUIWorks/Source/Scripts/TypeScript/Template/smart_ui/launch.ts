import * as UE from 'ue'
import { Main } from "./main";
import { argv } from 'puerts';

let bridgeCaller = (argv.getByName("BridgeCaller") as UE.JsBridgeCaller);

bridgeCaller.MainCaller.Bind(Main);
