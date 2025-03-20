"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextareaWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class TextareaWrapper extends common_wrapper_1.ComponentWrapper {
    propertySetters = {
        'value': (widget, value) => value && widget.SetText(value),
        'defaultValue': (widget, value) => value && widget.SetText(value),
        'placeholder': (widget, value) => value && widget.SetHintText(value),
        'readOnly': (widget, value) => value && widget.SetIsReadOnly(value),
        'disabled': (widget, value) => value && widget.SetIsEnabled(!value)
    };
    eventHandlers = {
        'onChange': {
            event: 'OnTextChanged',
            setup: (widget, handler) => {
                const callback = (text) => handler({ target: { value: text } });
                widget.OnTextChanged.Add(callback);
                return callback;
            }
        },
        'onSubmit': {
            event: 'OnTextCommitted',
            setup: (widget, handler) => {
                const callback = (text, commitMethod) => {
                    if (commitMethod === UE.ETextCommit.Default) {
                        handler({ target: text });
                    }
                };
                widget.OnTextCommitted.Add(callback);
                return callback;
            }
        },
        'onBlur': {
            event: 'OnTextCommitted',
            setup: (widget, handler) => {
                const callback = (text, commitMethod) => {
                    if (commitMethod === UE.ETextCommit.OnUserMovedFocus) {
                        handler({ target: { value: text } });
                    }
                };
                widget.OnTextCommitted.Add(callback);
                return callback;
            }
        }
    };
    eventCallbacks = {};
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const widget = new UE.MultiLineEditableText();
        // Apply properties
        for (const [key, setter] of Object.entries(this.propertySetters)) {
            if (key in this.props) {
                setter(widget, this.props[key]);
            }
        }
        // Setup event handlers
        for (const [key, handler] of Object.entries(this.eventHandlers)) {
            if (typeof this.props[key] === 'function') {
                this.eventCallbacks[key] = handler.setup(widget, this.props[key]);
            }
        }
        return widget;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const multiLine = widget;
        let hasChanges = false;
        // Update properties
        for (const [key, setter] of Object.entries(this.propertySetters)) {
            if (oldProps[key] !== newProps[key]) {
                setter(multiLine, newProps[key]);
                hasChanges = true;
            }
        }
        // Update event handlers
        for (const [key, handler] of Object.entries(this.eventHandlers)) {
            if (oldProps[key] !== newProps[key]) {
                if (this.eventCallbacks[key]) {
                    const eventDelegate = multiLine[handler.event];
                    if (eventDelegate && typeof eventDelegate.Remove === 'function') {
                        eventDelegate.Remove(this.eventCallbacks[key]);
                    }
                }
                if (typeof newProps[key] === 'function') {
                    this.eventCallbacks[key] = handler.setup(multiLine, newProps[key]);
                }
                hasChanges = true;
            }
        }
        return hasChanges;
    }
}
exports.TextareaWrapper = TextareaWrapper;
//# sourceMappingURL=textarea.js.map