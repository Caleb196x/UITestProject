"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrobberWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
class ThrobberWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    valueConvertKeyMap = {
        'pieces': 'NumberOfPieces',
        'animationHorizontal': 'bAnimationHorizontal',
        'animationVertical': 'bAnimationVertical',
        'animationOpacity': 'bAnimationOpacity',
    };
    convertToWidget() {
        const throbber = new UE.Throbber();
        this.commonPropertyInitialized(throbber);
        for (const key in this.props) {
            if (this.valueConvertKeyMap[key]) {
                throbber[this.valueConvertKeyMap[key]] = this.props[key];
            }
            else if (key === 'image') {
                throbber.Image = (0, brush_parser_1.parseBrush)(this.props[key]);
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(throbber);
        return throbber;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const throbber = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.ThrobberWrapper = ThrobberWrapper;
//# sourceMappingURL=throbber.js.map