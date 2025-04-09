"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiveWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
class RiveWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const Rive = new UE.ReactRiveWidget();
        this.commonPropertyInitialized(Rive);
        const riveFile = this.props?.rive;
        if (riveFile) {
            Rive.SetRiveFile(UE.UMGManager.LoadRiveFile(Rive, riveFile));
        }
        const initStateMachine = this.props?.initStateMachine;
        if (initStateMachine && initStateMachine !== '') {
            Rive.SetStateMachine(initStateMachine);
        }
        const RiveReady = this.props?.onRiveReady;
        if (RiveReady) {
            Rive.OnRiveReady.Add(RiveReady);
        }
        return Rive;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const Rive = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.RiveWrapper = RiveWrapper;
//# sourceMappingURL=rive.js.map