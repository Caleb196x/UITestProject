"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidationBoxWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class InvalidationBoxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const invalidationBox = new UE.InvalidationBox();
        this.commonPropertyInitialized(invalidationBox);
        const cache = this.props?.cache;
        if (cache) {
            invalidationBox.SetCanCache(cache);
        }
        return invalidationBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const overlay = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.InvalidationBoxWrapper = InvalidationBoxWrapper;
//# sourceMappingURL=invalidation_box.js.map