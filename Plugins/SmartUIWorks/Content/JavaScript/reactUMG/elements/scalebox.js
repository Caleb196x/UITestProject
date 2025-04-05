"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleBoxWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class ScaleBoxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    parseStretch(stretch, scale) {
        let stretchType = UE.EStretch.None;
        switch (stretch) {
            case 'contain':
                stretchType = UE.EStretch.ScaleToFit;
                break;
            case 'cover':
                stretchType = UE.EStretch.ScaleToFill;
                break;
            case 'fill':
                stretchType = UE.EStretch.Fill;
                break;
            case 'scale-y':
                stretchType = UE.EStretch.ScaleToFitY;
                break;
            case 'scale-x':
                stretchType = UE.EStretch.ScaleToFitX;
                break;
            case 'custom':
                stretchType = UE.EStretch.UserSpecified;
                break;
        }
        if (scale && stretch === 'custom') {
            return {
                Stretch: stretchType,
                UserSpecifiedScale: scale
            };
        }
        return {
            Stretch: stretchType
        };
    }
    convertToWidget() {
        const scaleBox = new UE.ScaleBox();
        this.commonPropertyInitialized(scaleBox);
        const stretch = this.props?.stretch;
        const scale = this.props?.scale;
        if (stretch) {
            const { Stretch, UserSpecifiedScale } = this.parseStretch(stretch, scale);
            scaleBox.SetStretch(Stretch);
            if (UserSpecifiedScale) {
                scaleBox.SetUserSpecifiedScale(UserSpecifiedScale);
            }
        }
        return scaleBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const overlay = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.ScaleBoxWrapper = ScaleBoxWrapper;
//# sourceMappingURL=scalebox.js.map