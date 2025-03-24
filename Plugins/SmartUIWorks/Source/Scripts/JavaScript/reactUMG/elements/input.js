"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class InputWrapper extends common_wrapper_1.ComponentWrapper {
    textChangeCallback;
    checkboxChangeCallback;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    handleTextChange(widget, onChange) {
        if (this.textChangeCallback) {
            widget.OnTextChanged.Remove(this.textChangeCallback);
        }
        this.textChangeCallback = (text) => onChange({ target: { value: text } });
        widget.OnTextChanged.Add(this.textChangeCallback);
    }
    handleCheckboxChange(widget, onChange) {
        if (this.checkboxChangeCallback) {
            widget.OnCheckStateChanged.Remove(this.checkboxChangeCallback);
        }
        this.checkboxChangeCallback = (isChecked) => onChange({ target: { checked: isChecked } });
        widget.OnCheckStateChanged.Add(this.checkboxChangeCallback);
    }
    setupTextInput(widget, props) {
        const { placeholder, defaultValue, disabled, readOnly, onChange } = props;
        if (placeholder)
            widget.SetHintText(placeholder);
        if (defaultValue)
            widget.SetText(defaultValue);
        if (disabled)
            widget.SetIsEnabled(false);
        if (readOnly)
            widget.SetIsReadOnly(true);
        if (typeof onChange === 'function')
            this.handleTextChange(widget, onChange);
    }
    setupCheckbox(widget, props) {
        const { checked, onChange } = props;
        if (checked)
            widget.SetIsChecked(true);
        if (typeof onChange === 'function')
            this.handleCheckboxChange(widget, onChange);
    }
    convertToWidget() {
        const inputType = this.props.type || 'text';
        let widget;
        if (inputType === 'checkbox') {
            widget = new UE.CheckBox();
            this.setupCheckbox(widget, this.props);
        }
        else {
            widget = new UE.EditableText();
            if (inputType === 'password') {
                widget.SetIsPassword(true);
            }
            this.setupTextInput(widget, this.props);
        }
        this.commonPropertyInitialized(widget);
        return widget;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        if (oldProps.type !== newProps.type) {
            console.error('Cannot change input type');
            return false;
        }
        const type = newProps.type || 'text';
        let changed = false;
        if (type === 'checkbox' && widget instanceof UE.CheckBox) {
            if (oldProps.checked !== newProps.checked || oldProps.onChange !== newProps.onChange) {
                this.setupCheckbox(widget, newProps);
                changed = true;
            }
        }
        else if (widget instanceof UE.EditableText) {
            const props = ['placeholder', 'defaultValue', 'disabled', 'readOnly', 'onChange'];
            for (const prop of props) {
                if (oldProps[prop] !== newProps[prop]) {
                    this.setupTextInput(widget, newProps);
                    changed = true;
                    break;
                }
            }
        }
        if (changed) {
            this.commonPropertyInitialized(widget);
        }
        return changed;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.InputWrapper = InputWrapper;
//# sourceMappingURL=input.js.map