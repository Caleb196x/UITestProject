"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeBoxWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const common_utils_1 = require("./common_utils");
class SizeBoxWrapper extends common_wrapper_1.ComponentWrapper {
    keyMap = {
        'width': 'WidthOverride',
        'height': 'HeightOverride',
        'minWidth': 'MinDesiredWidth',
        'minHeight': 'MinDesiredHeight',
        'maxWidth': 'MaxDesiredWidth',
        'maxHeight': 'MaxDesiredHeight',
        'minAspectRatio': 'MinAspectRatio',
        'maxAspectRatio': 'MaxAspectRatio',
    };
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const sizeBox = new UE.SizeBox();
        this.commonPropertyInitialized(sizeBox);
        if (this.props) {
            for (const key in this.props) {
                if (this.keyMap[key]) {
                    const value = this.props[key];
                    if (typeof value === 'number') {
                        sizeBox[this.keyMap[key]] = value;
                    }
                    else if (typeof value === 'string') {
                        if (key == 'minAspectRatio' || key == 'maxAspectRatio') {
                            sizeBox[this.keyMap[key]] = (0, common_utils_1.parseAspectRatio)(value);
                        }
                        else {
                            sizeBox[this.keyMap[key]] = (0, common_utils_1.safeParseFloat)(value);
                        }
                    }
                }
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(sizeBox);
        return sizeBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const overlay = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.SizeBoxWrapper = SizeBoxWrapper;
//# sourceMappingURL=sizebox.js.map