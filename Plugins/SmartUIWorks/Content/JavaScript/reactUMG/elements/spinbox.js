"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinBoxWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
const common_utils_1 = require("./common_utils");
const color_parser_1 = require("./parser/color_parser");
class SpinBoxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    valueConvertKeyMap = {
        'value': 'Value',
        'minValue': 'MinValue',
        'maxValue': 'MaxValue',
        'minSliderValue': 'MinSliderValue',
        'maxSliderValue': 'MaxSliderValue',
        'minFractionDigits': 'MinFractionDigits',
        'maxFractionDigits': 'MaxFractionDigits',
        'useDeltaSnap': 'bAlwaysUsesDeltaSnap',
        'enableSlider': 'bEnableSlider',
        'deltaValue': 'Delta',
        'sliderExponent': 'SliderExponent',
        'minDesiredWidth': 'MinDesiredWidth',
        'clearKeyboardFocusOnCommit': 'ClearKeyboardFocusOnCommit',
        'selectAllTextOnFocus': 'SelectAllTextOnCommit',
        'foregroundColor': 'ForegroundColor',
    };
    eventKeyMap = {
        'onValueChanged': 'OnValueChanged',
        'onValueCommitted': 'OnValueCommitted',
        'onBeginSliderMovement': 'OnBeginSliderMovement',
        'onEndSliderMovement': 'OnEndSliderMovement',
    };
    styleKeyMap = {
        'arrowBackground': 'ArrowImage',
        'normalBackground': 'BackgroundBrush',
        'activeBackground': 'ActiveBackgroundBrush',
        'hoveredBackground': 'HoveredBackgroundBrush',
        'activeFillBackground': 'ActiveFillBrush',
        'hoveredFillBackground': 'HoveredFillBrush',
        'inactiveFillBackground': 'InactiveFillBrush',
    };
    paddingKeyMap = {
        'textPadding': 'TextPadding',
        'insetPadding': 'InsetPadding',
    };
    colorKeyMap = {
        'foregroundColor': 'ForegroundColor',
    };
    convertToWidget() {
        const spinBox = new UE.SpinBox();
        this.commonPropertyInitialized(spinBox);
        for (const key in this.props) {
            if (this.valueConvertKeyMap[key]) {
                spinBox[this.valueConvertKeyMap[key]] = this.props[key];
            }
            else if (this.eventKeyMap[key] && typeof this.props[key] === 'function') {
                spinBox[this.eventKeyMap[key]].Add(this.props[key]);
            }
            else if (this.styleKeyMap[key]) {
                spinBox.WidgetStyle[this.styleKeyMap[key]] = (0, brush_parser_1.parseBrush)(this.props[key]);
            }
            else if (this.paddingKeyMap[key]) {
                spinBox.WidgetStyle[this.paddingKeyMap[key]] = (0, common_utils_1.convertMargin)(this.props[key], {});
            }
            else if (this.colorKeyMap[key]) {
                const rgba = (0, color_parser_1.parseColor)(this.props[key]);
                spinBox.WidgetStyle[this.colorKeyMap[key]] = new UE.LinearColor(rgba.r, rgba.g, rgba.b, rgba.a);
            }
            else if (key === 'textAlign') {
                switch (this.props[key]) {
                    case 'left':
                        spinBox.Justification = UE.ETextJustify.Left;
                        break;
                    case 'right':
                        spinBox.Justification = UE.ETextJustify.Right;
                        break;
                    case 'center':
                        spinBox.Justification = UE.ETextJustify.Center;
                        break;
                    default:
                        spinBox.Justification = UE.ETextJustify.Left;
                        break;
                }
            }
            else if (key === 'keyboardType') {
                switch (this.props[key]) {
                    case 'number':
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.Number;
                        break;
                    case 'web':
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.Web;
                        break;
                    case 'email':
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.Email;
                        break;
                    case 'password':
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.Password;
                        break;
                    case 'alpha-numberic':
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.AlphaNumeric;
                        break;
                    default:
                        spinBox.KeyboardType = UE.EVirtualKeyboardType.Default;
                        break;
                }
            }
            else if (key === 'valueBinding') {
                spinBox.ValueDelegate.Bind(this.props[key]);
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(spinBox);
        return spinBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const spinBox = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.SpinBoxWrapper = SpinBoxWrapper;
//# sourceMappingURL=spinbox.js.map