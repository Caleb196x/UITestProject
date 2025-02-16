import * as UE from 'ue'
import {argv} from 'puerts';
import {ReactUMG} from 'react-umg'
import * as UI from './react-ui';

function WaitLatentActionState(state: UE.LatentActionState) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        state.LatentActionCallback.Bind(() => {
            state.LatentActionCallback.Unbind();
            resolve();
        });
    });
}

//用React来写UI
// let gameInstance = (argv.getByName("GameInstance") as UE.GameInstance);
// let world = gameInstance.GetWorld();

// async function asyncTest() {
//     ReactUMG.init(world);
//     let root = UI.HelloLoad();
//     let latentActionState = new UE.LatentActionState();
//     UE.KismetSystemLibrary.Delay(world, 5, latentActionState.GetLatentActionInfo());
//     await WaitLatentActionState(latentActionState);
//     console.log("remove from viewport after 5s.")
//     // root.removeFromViewport();
// }

// asyncTest().catch((reason) => console.log("catch " + reason));

console.log("UsingReactUMG2")