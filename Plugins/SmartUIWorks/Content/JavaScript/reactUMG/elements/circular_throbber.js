"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularThrobberWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
class CircularThrobberWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    valueConvertKeyMap = {
        'radius': 'Radius',
        'pieces': 'NumberOfPieces',
        'period': 'Period',
        'enableRadius': 'bEnableRadius',
    };
    convertToWidget() {
        const circularThrobber = new UE.CircularThrobber();
        this.commonPropertyInitialized(circularThrobber);
        for (const key in this.props) {
            if (this.valueConvertKeyMap[key]) {
                circularThrobber[this.valueConvertKeyMap[key]] = this.props[key];
            }
            else if (key === 'image') {
                circularThrobber.Image = (0, brush_parser_1.parseBrush)(this.props[key]);
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(circularThrobber);
        return circularThrobber;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const circularThrobber = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.CircularThrobberWrapper = CircularThrobberWrapper;
//# sourceMappingURL=circular_throbber.js.map