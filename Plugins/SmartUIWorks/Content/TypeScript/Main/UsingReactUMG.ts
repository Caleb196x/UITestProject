import * as UE from 'ue'
import {argv} from 'puerts';
import {ReactUMG} from 'react-umg'
import * as UI from './react-ui';

//用React来写UI
let world = (argv.getByName("GameInstance") as UE.GameInstance).GetWorld();
ReactUMG.init(world);
UI.Load();