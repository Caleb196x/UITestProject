"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderWrapper = void 0;
exports.setupSliderCommonProps = setupSliderCommonProps;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const color_parser_1 = require("./parser/color_parser");
const brush_parser_1 = require("./parser/brush_parser");
function setupSliderCommonProps(slider, props) {
    if (!props || !slider)
        return;
    const valueConvertKeyMap = {
        'value': 'Value',
        'stepSize': 'StepSize',
        'locked': 'Locked',
        'useMouseStep': 'MouseUsesStep',
        'controllerLock': 'RequiresControllerLock',
        'focusable': 'IsFocusable'
    };
    const colorKeyMap = {
        'sliderBarColor': 'SliderBarColor',
        'sliderThumbColor': 'SliderHandleColor',
    };
    const styleKeyMap = {
        'normalBarBackground': 'NormalBarImage',
        'hoverBarBackground': 'HoveredBarImage',
        'disabledBarBackground': 'DisabledBarImage',
        'normalThumbBackground': 'NormalThumbImage',
        'hoveredThumbBackground': 'HoveredThumbImage',
        'disabledThumbBackground': 'DisabledThumbImage'
    };
    const eventKeyMap = {
        'onValueChanged': 'OnValueChanged',
        'onMouseCaptureBegin': 'OnMouseCaptureBegin',
        'onMouseCaptureEnd': 'OnMouseCaptureEnd',
        'onControllerCaptureBegin': 'OnControllerCaptureBegin',
        'onControllerCaptureEnd': 'OnControllerCaptureEnd',
    };
    for (const key in this.props) {
        if (valueConvertKeyMap[key]) {
            slider[valueConvertKeyMap[key]] = props[key];
        }
        else if (colorKeyMap[key]) {
            const color = (0, color_parser_1.parseColor)(props[key]);
            slider[colorKeyMap[key]] = new UE.LinearColor(color.r, color.g, color.b, color.a);
        }
        else if (styleKeyMap[key]) {
            slider.WidgetStyle[styleKeyMap[key]] = (0, brush_parser_1.parseBrush)(props[key]);
        }
        else if (key === 'barThickness') {
            slider.WidgetStyle.BarThickness = props[key];
        }
        if (typeof this.props[key] === 'function') {
            if (eventKeyMap[key]) {
                slider[eventKeyMap[key]].Add(props[key]);
            }
            else if (key === 'valueBinding') {
                slider.ValueDelegate.Bind(props[key]);
            }
        }
    }
}
class SliderWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const slider = new UE.Slider();
        this.commonPropertyInitialized(slider);
        setupSliderCommonProps(slider, this.props);
        const minValue = this.props?.minValue;
        if (minValue) {
            slider.MinValue = minValue;
        }
        const maxValue = this.props?.maxValue;
        if (maxValue) {
            slider.MaxValue = maxValue;
        }
        const indentHandle = this.props?.indentHandle;
        if (indentHandle) {
            slider.IndentHandle = indentHandle;
        }
        const orientation = this.props?.orientation;
        if (orientation) {
            switch (orientation) {
                case 'horizontal':
                    slider.Orientation = UE.EOrientation.Orient_Horizontal;
                    break;
                case 'vertical':
                    slider.Orientation = UE.EOrientation.Orient_Vertical;
                    break;
                default:
                    slider.Orientation = UE.EOrientation.Orient_Horizontal;
                    break;
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(slider);
        return slider;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const slider = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.SliderWrapper = SliderWrapper;
//# sourceMappingURL=slider.js.map