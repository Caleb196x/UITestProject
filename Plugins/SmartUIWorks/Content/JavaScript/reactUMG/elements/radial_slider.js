"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadialSliderWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const color_parser_1 = require("./parser/color_parser");
const slider_1 = require("./slider");
class RadialSliderWrapper extends common_wrapper_1.ComponentWrapper {
    valueConvertKeyMap = {
        'defaultValue': 'CustomDefaultValue',
        'thumbStartAngle': 'SliderHandleStartAngle',
        'thumbEndPointAngle': 'SliderHandleEndAngle',
        'thumbAngularOffset': 'AngularOffset',
        'showSliderThumb': 'ShowSliderHandle',
        'showSliderHand': 'ShowSliderHand'
    };
    colorKeyMap = {
        'sliderProgressColor': 'SliderProgressColor',
        'backgroundColor': 'CenterBackgroundColor',
    };
    constructor(type, props) {
        super();
        this.props = props;
        this.typeName = type;
    }
    convertToWidget() {
        const radialSlider = new UE.RadialSlider();
        this.commonPropertyInitialized(radialSlider);
        (0, slider_1.setupSliderCommonProps)(radialSlider, this.props);
        for (const key in this.props) {
            if (this.valueConvertKeyMap[key]) {
                radialSlider[this.valueConvertKeyMap[key]] = this.props[key];
            }
            else if (this.colorKeyMap[key]) {
                const color = (0, color_parser_1.parseColor)(this.props[key]);
                radialSlider[this.colorKeyMap[key]] = new UE.LinearColor(color.r, color.g, color.b, color.a);
            }
            else if (key === 'valueTags') {
                this.props[key].map((tag) => radialSlider.ValueTags.Add(tag));
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(radialSlider);
        return radialSlider;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const radialSlider = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.RadialSliderWrapper = RadialSliderWrapper;
//# sourceMappingURL=radial_slider.js.map