"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacerWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
class SpacerWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const spacer = new UE.Spacer();
        this.commonPropertyInitialized(spacer);
        const size = this.props?.size;
        if (size) {
            spacer.Size = new UE.Vector2D(size.x, size.y);
        }
        UE.UMGManager.SynchronizeWidgetProperties(spacer);
        return spacer;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const spacer = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.SpacerWrapper = SpacerWrapper;
//# sourceMappingURL=spacer.js.map