"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeZoneWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class SafeZoneWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const safeZone = new UE.SafeZone();
        this.commonPropertyInitialized(safeZone);
        const padLeft = this.props?.padLeft;
        if (padLeft) {
            safeZone.PadLeft = padLeft;
        }
        const padRight = this.props?.padRight;
        if (padRight) {
            safeZone.PadRight = padRight;
        }
        const padTop = this.props?.padTop;
        if (padTop) {
            safeZone.PadTop = padTop;
        }
        const padBottom = this.props?.padBottom;
        if (padBottom) {
            safeZone.PadBottom = padBottom;
        }
        UE.UMGManager.SynchronizeWidgetProperties(safeZone);
        return safeZone;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const safeZone = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.SafeZoneWrapper = SafeZoneWrapper;
//# sourceMappingURL=safezone.js.map