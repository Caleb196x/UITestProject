"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class ButtonWrapper extends common_wrapper_1.ComponentWrapper {
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
    convertToWidget() {
        const button = new UE.Button();
        // Setup all event handlers
        for (const eventName in this.eventMappings) {
            this.setupEventHandler(button, eventName, this.props[eventName]);
        }
        // Handle disabled state
        if (this.props?.disabled) {
            button.bIsEnabled = false;
        }
        this.commonPropertyInitialized(button);
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
        return propsChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.ButtonWrapper = ButtonWrapper;
//# sourceMappingURL=button.js.map