import * as UE from 'ue'
import {argv} from 'puerts';
import {ReactUMG} from 'react-umg';

function WaitLatentActionState(state: UE.LatentActionState) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        state.LatentActionCallback.Bind(() => {
            state.LatentActionCallback.Unbind();
            resolve();
        });
    });
}

//用React来写UI
let coreWidget = (argv.getByName("CoreWidget") as UE.SmartUICoreWidget);
// let world = gameInstance.GetWorld();

async function asyncTest() {

    let latentActionState = new UE.LatentActionState();
    // UE.KismetSystemLibrary.Delay(world, 5, latentActionState.GetLatentActionInfo());
    // await WaitLatentActionState(latentActionState);
    console.log("remove from viewport after 5s.")
    // root.removeFromViewport();
}

// asyncTest().catch((reason) => console.log("catch " + reason));
