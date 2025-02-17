"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UE = require("ue");
const puerts_1 = require("puerts");
function WaitLatentActionState(state) {
    return new Promise((resolve, reject) => {
        state.LatentActionCallback.Bind(() => {
            state.LatentActionCallback.Unbind();
            resolve();
        });
    });
}
//用React来写UI
let coreWidget = puerts_1.argv.getByName("CoreWidget");
// let world = gameInstance.GetWorld();
async function asyncTest() {
    let latentActionState = new UE.LatentActionState();
    // UE.KismetSystemLibrary.Delay(world, 5, latentActionState.GetLatentActionInfo());
    // await WaitLatentActionState(latentActionState);
    console.log("remove from viewport after 5s.");
    // root.removeFromViewport();
}
// asyncTest().catch((reason) => console.log("catch " + reason));
//# sourceMappingURL=UsingReactUMG.js.map