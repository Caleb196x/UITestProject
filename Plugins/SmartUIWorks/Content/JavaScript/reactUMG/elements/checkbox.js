"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
const common_utils_1 = require("./common_utils");
const color_parser_1 = require("./parser/color_parser");
class CheckboxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.props = props;
        this.typeName = type;
    }
    setupCheckboxStyle(checkbox) {
        const checkboxStyle = this.props?.checkboxStyle;
        if (!checkboxStyle) {
            return;
        }
        const imageStyleMap = {
            'uncheckedBackground': 'UncheckedImage',
            'uncheckedHoveredBackground': 'UncheckedHoveredImage',
            'uncheckedPressedBackground': 'UncheckedPressedImage',
            'checkedBackground': 'CheckedImage',
            'checkedHoveredBackground': 'CheckedHoveredImage',
            'checkedPressedBackground': 'CheckedPressedImage',
            'undeterminedBackground': 'UndeterminedImage',
            'undeterminedHoveredBackground': 'UndeterminedHoveredImage',
            'undeterminedPressedBackground': 'UndeterminedPressedBrush',
            'normalBackground': 'BackgroundImage',
            'normalHoveredBackground': 'BackgroundHoveredImage',
            'normalPressedBackground': 'BackgroundPressedImage',
        };
        const soundMap = {
            'checkSound': 'CheckedSlateSound',
            'uncheckSound': 'UncheckedSlateSound',
            'hoveredSound': 'HoveredSlateSound',
        };
        for (const [key, value] of Object.entries(checkboxStyle)) {
            if (imageStyleMap[key]) {
                checkbox.WidgetStyle[imageStyleMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (soundMap[key]) {
                // todo@Caleb196x: 需要解析sound
                checkbox.WidgetStyle[soundMap[key]] = {};
            }
            else if (key === 'padding') {
                checkbox.WidgetStyle.Padding = (0, common_utils_1.convertMargin)(value, checkboxStyle);
            }
            else if (key === 'color') {
                const rgba = (0, color_parser_1.parseColor)(value);
                checkbox.WidgetStyle.ForegroundColor.SpecifiedColor.R = rgba.r;
                checkbox.WidgetStyle.ForegroundColor.SpecifiedColor.G = rgba.g;
                checkbox.WidgetStyle.ForegroundColor.SpecifiedColor.B = rgba.b;
                checkbox.WidgetStyle.ForegroundColor.SpecifiedColor.A = rgba.a;
            }
            else if (key === 'type') {
                switch (value) {
                    case 'checkbox':
                        checkbox.WidgetStyle.CheckBoxType = UE.ESlateCheckBoxType.CheckBox;
                        break;
                    case 'toggle':
                        checkbox.WidgetStyle.CheckBoxType = UE.ESlateCheckBoxType.ToggleButton;
                        break;
                    case 'default':
                    default:
                        checkbox.WidgetStyle.CheckBoxType = UE.ESlateCheckBoxType.CheckBox;
                        break;
                }
            }
        }
    }
    convertToWidget() {
        const checkbox = new UE.CheckBox();
        this.commonPropertyInitialized(checkbox);
        this.setupCheckboxStyle(checkbox);
        const checked = this.props?.checked;
        if (checked) {
            checkbox.SetIsChecked(checked);
        }
        const stateBinding = this.props?.checkStateBinding;
        if (stateBinding && typeof stateBinding === 'function') {
            checkbox.CheckedStateDelegate.Bind(stateBinding);
        }
        UE.UMGManager.SynchronizeWidgetProperties(checkbox);
        return checkbox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
}
exports.CheckboxWrapper = CheckboxWrapper;
//# sourceMappingURL=checkbox.js.map