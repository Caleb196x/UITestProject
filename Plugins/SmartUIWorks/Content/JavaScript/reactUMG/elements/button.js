"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const brush_parser_1 = require("./parser/brush_parser");
const color_parser_1 = require("./parser/color_parser");
const common_utils_1 = require("./common_utils");
class ButtonWrapper extends common_wrapper_1.ComponentWrapper {
    useReactButton = true;
    eventCallbacks = {
        onClick: undefined,
        onMouseDown: undefined,
        onMouseUp: undefined,
        onMouseEnter: undefined,
        onMouseLeave: undefined,
        onFocus: undefined,
        onBlur: undefined
    };
    eventMappings = {
        onClick: { event: 'OnClicked', handler: 'onClick' },
        onMouseDown: { event: 'OnPressed', handler: 'onMouseDown' },
        onMouseUp: { event: 'OnReleased', handler: 'onMouseUp' },
        onMouseEnter: { event: 'OnHovered', handler: 'onMouseEnter' },
        onMouseLeave: { event: 'OnUnhovered', handler: 'onMouseLeave' },
        onFocus: { event: 'OnHovered', handler: 'onFocus' },
        onBlur: { event: 'OnUnhovered', handler: 'onBlur' }
    };
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.useReactButton = this.typeName === 'button';
    }
    setupEventHandler(button, eventName, handler) {
        if (typeof handler === 'function') {
            const mapping = this.eventMappings[eventName];
            this.eventCallbacks[mapping.handler] = handler;
            button[mapping.event].Add(handler);
        }
    }
    removeEventHandler(button, eventName) {
        const mapping = this.eventMappings[eventName];
        const callback = this.eventCallbacks[mapping.handler];
        if (callback) {
            button[mapping.event].Remove(callback);
        }
    }
    initReactButton(button) {
        // Setup all event handlers
        for (const eventName in this.eventMappings) {
            this.setupEventHandler(button, eventName, this.props[eventName]);
        }
        // Handle disabled state
        if (this.props?.disabled) {
            button.bIsEnabled = false;
        }
        // background 
        const buttonStyle = this.props?.style;
        if (buttonStyle) {
            const textColor = buttonStyle?.textColor;
            if (textColor) {
                const rgba = (0, color_parser_1.parseColor)(textColor);
                button.ColorAndOpacity.R = rgba.r;
                button.ColorAndOpacity.G = rgba.g;
                button.ColorAndOpacity.B = rgba.b;
                button.ColorAndOpacity.A = rgba.a;
            }
            const background = buttonStyle?.background;
            if (background) {
                const result = (0, common_utils_1.parseBackgroundProps)(background);
                if (result?.image) {
                    button.WidgetStyle.Normal = result.image;
                }
                if (result?.color) {
                    const rgba = (0, color_parser_1.parseColor)(result.color);
                    button.BackgroundColor.R = rgba.r;
                    button.BackgroundColor.G = rgba.g;
                    button.BackgroundColor.B = rgba.b;
                    button.BackgroundColor.A = rgba.a;
                }
            }
            const backgroundImage = buttonStyle?.backgroundImage;
            let hasBackgroundImage = false;
            if (backgroundImage) {
                button.WidgetStyle.Normal = (0, common_utils_1.parseBackgroundImage)(backgroundImage, buttonStyle?.backgroundSize);
                hasBackgroundImage = true;
            }
            const backgroundColor = buttonStyle?.backgroundColor;
            if (backgroundColor) {
                const rgba = (0, color_parser_1.parseColor)(backgroundColor);
                button.BackgroundColor.R = rgba.r;
                button.BackgroundColor.G = rgba.g;
                button.BackgroundColor.B = rgba.b;
                button.BackgroundColor.A = rgba.a;
            }
            const backgroundRepeat = buttonStyle?.backgroundRepeat;
            if (backgroundRepeat && hasBackgroundImage) {
                button.WidgetStyle.Normal = (0, common_utils_1.parseBackgroundRepeat)(backgroundRepeat, button.WidgetStyle.Normal);
            }
            const padding = buttonStyle?.padding;
            if (padding) {
                button.WidgetStyle.NormalPadding = (0, common_utils_1.convertMargin)(padding, buttonStyle);
            }
        }
    }
    initNativeButton(button) {
        const brushKeyMap = {
            'background': 'Normal',
            'hoveredBackground': 'Hovered',
            'pressedBackground': 'Pressed',
            'disabledBackground': 'Disabled'
        };
        const colorKeyMap = {
            'textColor': 'ColorAndOpacity',
            'backgroundColor': 'BackgroundColor'
        };
        const paddingKeyMap = {
            'normalPadding': 'NormalPadding',
            'pressedPadding': 'PressedPadding',
        };
        const soundKeyMap = {
            'pressedSound': 'PressedSlateSound',
            'hoveredSound': 'HoveredSlateSound',
        };
        const eventKeyMap = {
            'onClick': 'OnClicked',
            'onPressed': 'OnPressed',
            'onReleased': 'OnReleased',
            'onHovered': 'OnHovered',
            'onUnhovered': 'OnUnhovered',
        };
        for (const key in this.props) {
            const value = this.props[key];
            if (brushKeyMap[key]) {
                button.WidgetStyle[brushKeyMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (colorKeyMap[key]) {
                const rgba = (0, color_parser_1.parseColor)(value);
                button[colorKeyMap[key]].R = rgba.r;
                button[colorKeyMap[key]].G = rgba.g;
                button[colorKeyMap[key]].B = rgba.b;
                button[colorKeyMap[key]].A = rgba.a;
            }
            else if (paddingKeyMap[key]) {
                button[paddingKeyMap[key]] = (0, common_utils_1.convertMargin)(value, {});
            }
            else if (soundKeyMap[key]) {
                // todo@Caleb196x: 添加sound
            }
            else if (eventKeyMap[key]) {
                button[eventKeyMap[key]].Add(value);
            }
            else if (key === 'focusable') {
                button.IsFocusable = value;
            }
        }
    }
    convertToWidget() {
        const button = new UE.Button();
        if (this.useReactButton) {
            this.initReactButton(button);
        }
        else {
            this.initNativeButton(button);
        }
        this.commonPropertyInitialized(button);
        UE.UMGManager.SynchronizeWidgetProperties(button);
        return button;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propsChange = false;
        const button = widget;
        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];
            if (oldProp === newProp)
                continue;
            propsChange = true;
            if (key in this.eventMappings) {
                if (typeof newProp === 'function') {
                    this.removeEventHandler(button, key);
                    this.setupEventHandler(button, key, newProp);
                }
            }
            else if (key === 'disabled') {
                button.bIsEnabled = !newProp;
            }
        }
        this.commonPropertyInitialized(widget);
        UE.UMGManager.SynchronizeWidgetProperties(button);
        return propsChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.ButtonWrapper = ButtonWrapper;
//# sourceMappingURL=button.js.map