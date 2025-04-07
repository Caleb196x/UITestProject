"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboBoxWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
const common_utils_1 = require("./common_utils");
const color_parser_1 = require("./parser/color_parser");
class ComboBoxWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.props = props;
        this.typeName = type;
    }
    setupOptions(comboBox) {
        const options = this.props?.options;
        if (options) {
            comboBox.ClearOptions();
            options.forEach((option) => {
                comboBox.DefaultOptions.Add(option);
                comboBox.AddOption(option);
            });
        }
        const selectedOption = this.props?.selectedOption;
        if (selectedOption) {
            comboBox.SetSelectedOption(selectedOption);
        }
    }
    setupComboBoxStyle(comboBox) {
        const comboBoxStyle = this.props?.comboBoxStyle;
        if (!comboBoxStyle) {
            return;
        }
        const styleMap = {
            'backgroundImage': 'Normal',
            'hoveredBackgroundImage': 'Hovered',
            'pressedBackgroundImage': 'Pressed',
            'disabledBackgroundImage': 'Disabled',
            'downArrowBackground': 'DownArrow',
        };
        const soundMap = {
            'pressedSound': 'PressedSlateSound',
            'selectionChangeSound': 'SelectionChangeSlateSound',
        };
        const paddingMap = {
            'rowPadding': 'MenuRowPadding',
            'downArrowPadding': 'DownArrowPadding',
        };
        for (const [key, value] of Object.entries(comboBoxStyle)) {
            if (styleMap[key]) {
                comboBox.WidgetStyle.ComboButtonStyle.ButtonStyle[styleMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (soundMap[key]) {
                // todo@Caleb196x: 需要解析sound
                comboBox.WidgetStyle[soundMap[key]] = {};
            }
            else if (paddingMap[key]) {
                comboBox.WidgetStyle[paddingMap[key]] = (0, common_utils_1.convertMargin)(value, comboBoxStyle);
            }
            else if (key === 'downArrowBackground') {
                comboBox.WidgetStyle.ComboButtonStyle.DownArrowImage = (0, brush_parser_1.parseBrush)(value);
            }
            else if (key === 'downArrowPadding') {
                comboBox.WidgetStyle.ComboButtonStyle.DownArrowPadding = (0, common_utils_1.convertMargin)(value, comboBoxStyle);
            }
            else if (key === 'downArrowAlign') {
                switch (value) {
                    case 'left':
                    case 'top':
                        comboBox.WidgetStyle.ComboButtonStyle.DownArrowAlign = UE.EVerticalAlignment.VAlign_Top;
                        break;
                    case 'right':
                    case 'bottom':
                        comboBox.WidgetStyle.ComboButtonStyle.DownArrowAlign = UE.EVerticalAlignment.VAlign_Bottom;
                        break;
                    case 'center':
                        comboBox.WidgetStyle.ComboButtonStyle.DownArrowAlign = UE.EVerticalAlignment.VAlign_Center;
                        break;
                    default:
                        comboBox.WidgetStyle.ComboButtonStyle.DownArrowAlign = UE.EVerticalAlignment.VAlign_Top;
                        break;
                }
            }
        }
    }
    setupComboBoxScrollBarStyle(comboBox) {
        const comboBoxScrollBarStyle = this.props?.comboBoxScrollBarStyle;
        if (!comboBoxScrollBarStyle) {
            return;
        }
        const styleMap = {
            'horizontalBackground': 'HorizontalBackgroundImage',
            'verticalBackground': 'VerticalBackgroundImage',
            'normalThumb': 'NormalThumbImage',
            'hoveredThumb': 'HoveredThumbImage',
            'draggedThumb': 'DraggedThumbImage',
        };
        for (const [key, value] of Object.entries(comboBoxScrollBarStyle)) {
            if (styleMap[key]) {
                comboBox.ScrollBarStyle[styleMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (key === 'thickness') {
                comboBox.ScrollBarStyle.Thickness = value;
            }
        }
    }
    setupComboBoxItemStyle(comboBox) {
        const comboBoxItemStyle = this.props?.comboBoxItemStyle;
        if (!comboBoxItemStyle) {
            return;
        }
        const styleMap = {
            'activeBackground': 'ActiveBrush',
            'activeHoveredBackground': 'ActiveHoveredBrush',
            'focusedBackground': 'SelectorFocusedBrush',
            'inactiveBackground': 'InactiveBrush',
            'inactiveHoveredBackground': 'InactiveHoveredBrush',
            'menuRowBackground': 'MenuRowBrush',
            'evenMenuRowBackground': 'EvenMenuRowBrush',
            'oddMenuRowBackground': 'OddMenuRowBrush',
        };
        const colorMap = {
            'textColor': 'TextColor',
            'selectedTextColor': 'SelectedTextColor',
        };
        for (const [key, value] of Object.entries(comboBoxItemStyle)) {
            if (styleMap[key]) {
                // fixme@Caleb196x: 需要处理styleMap[key]不存在的情况
                comboBox.ItemStyle[styleMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (colorMap[key]) {
                const rgba = (0, color_parser_1.parseColor)(value);
                comboBox.ItemStyle[colorMap[key]].SpecifiedColor.R = rgba.r;
                comboBox.ItemStyle[colorMap[key]].SpecifiedColor.G = rgba.g;
                comboBox.ItemStyle[colorMap[key]].SpecifiedColor.B = rgba.b;
                comboBox.ItemStyle[colorMap[key]].SpecifiedColor.A = rgba.a;
            }
        }
    }
    convertToWidget() {
        const comboBox = new UE.ComboBoxString();
        this.commonPropertyInitialized(comboBox);
        this.setupOptions(comboBox);
        this.setupComboBoxStyle(comboBox);
        this.setupComboBoxItemStyle(comboBox);
        this.setupComboBoxScrollBarStyle(comboBox);
        const valueMap = {
            'maxListHeight': 'MaxListHeight',
            'hasDownArrow': 'HasDownArrow',
            'enableGamepadNavigation': 'EnableGamepadNavigation',
        };
        const eventMap = {
            'onOpened': 'OnOpened',
            'onSelectionChanged': 'OnSelectionChanged',
        };
        for (const [key, value] of Object.entries(valueMap)) {
            if (valueMap[key]) {
                comboBox[valueMap[key]] = value;
            }
            else if (eventMap[key]) {
                comboBox[eventMap[key]].Add(value);
            }
            else if (key === 'contentPadding') {
                comboBox.ContentPadding = (0, common_utils_1.convertMargin)(value, this.props?.style);
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(comboBox);
        return comboBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return false;
    }
}
exports.ComboBoxWrapper = ComboBoxWrapper;
//# sourceMappingURL=combo_box.js.map