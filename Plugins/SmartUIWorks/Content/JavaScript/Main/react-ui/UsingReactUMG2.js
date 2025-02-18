"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function WaitLatentActionState(state) {
    return new Promise((resolve, reject) => {
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
console.log("UsingReactUMG2");
//# sourceMappingURL=UsingReactUMG2.js.map