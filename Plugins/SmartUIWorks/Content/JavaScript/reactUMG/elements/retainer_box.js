"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetainerBoxWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class RetainerBoxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const retainerBox = new UE.RetainerBox();
        this.commonPropertyInitialized(retainerBox);
        const retainRender = this.props?.retainRender;
        if (retainRender) {
            retainerBox.bRetainRender = retainRender;
        }
        const renderOnInvalidate = this.props?.renderOnInvalidate;
        if (renderOnInvalidate) {
            retainerBox.RenderOnInvalidation = renderOnInvalidate;
        }
        const renderOnPhase = this.props?.renderOnPhase;
        if (renderOnPhase) {
            retainerBox.RenderOnPhase = renderOnPhase;
        }
        const phase = this.props?.phase;
        if (phase) {
            retainerBox.Phase = phase;
        }
        const phaseCount = this.props?.phaseCount;
        if (phaseCount) {
            retainerBox.PhaseCount = phaseCount;
        }
        UE.UMGManager.SynchronizeWidgetProperties(retainerBox);
        return retainerBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const retainerBox = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.RetainerBoxWrapper = RetainerBoxWrapper;
//# sourceMappingURL=retainer_box.js.map