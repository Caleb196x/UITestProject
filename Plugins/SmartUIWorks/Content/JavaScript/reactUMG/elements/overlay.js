"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class OverlayWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const overlay = new UE.Overlay();
        this.commonPropertyInitialized(overlay);
        return overlay;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const overlay = widget;
        let propsChange = false;
        return propsChange;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
    }
}
exports.OverlayWrapper = OverlayWrapper;
//# sourceMappingURL=overlay.js.map