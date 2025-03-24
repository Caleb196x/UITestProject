"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
// Component wrapper implementations
class SelectWrapper extends common_wrapper_1.ComponentWrapper {
    onChangeCallback;
    propsReMapping = {
        'disabled': 'bIsEnabled',
        'onChange': 'OnSelectionChanged',
        'defaultValue': 'SelectedOption'
    };
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    setupChangeHandler(comboBox, onChange) {
        if (typeof onChange === 'function') {
            this.onChangeCallback = (selectedItem, selectionType) => {
                onChange({ target: { value: selectedItem } });
            };
            comboBox.OnSelectionChanged.Add(this.onChangeCallback);
        }
    }
    addOptions(comboBox, children) {
        for (const child of children) {
            if (child.type === 'option') {
                const text = child.props.value ?? child.props.children;
                comboBox.DefaultOptions.Add(text);
                comboBox.AddOption(text);
            }
        }
    }
    handleChildrenUpdate(comboBox, oldChildren, newChildren) {
        const oldChildNum = oldChildren.length;
        const newChildNum = newChildren.length;
        if (oldChildNum > newChildNum) {
            this.removeOptions(comboBox, oldChildren, newChildren);
        }
        else if (oldChildNum < newChildNum) {
            this.addNewOptions(comboBox, oldChildren, newChildren);
        }
    }
    removeOptions(comboBox, oldChildren, newChildren) {
        const removeItems = [];
        for (let i = 0; i < oldChildren.length; i++) {
            if (oldChildren[i] in newChildren)
                continue;
            const text = oldChildren['value'] ?? oldChildren['children'];
            removeItems.push(text);
        }
        for (const item of removeItems) {
            comboBox.RemoveOption(item);
        }
    }
    addNewOptions(comboBox, oldChildren, newChildren) {
        const addItems = [];
        for (let i = 0; i < newChildren.length; i++) {
            if (newChildren[i] in oldChildren)
                continue;
            const text = newChildren['value'] ?? newChildren['children'];
            addItems.push(text);
        }
        // todo@Caleb196x: update style
        for (const item of addItems) {
            comboBox.AddOption(item);
        }
    }
    convertToWidget() {
        if (this.typeName === "option")
            return null;
        const comboBox = new UE.ComboBoxString();
        const { children, defaultValue, disabled, onChange } = this.props;
        if (disabled)
            comboBox.bIsEnabled = false;
        this.addOptions(comboBox, children);
        this.setupChangeHandler(comboBox, onChange);
        comboBox.SelectedOption = defaultValue;
        this.parseStyleToWidget(comboBox);
        this.commonPropertyInitialized(comboBox);
        return comboBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        if (this.typeName === "option") {
            console.log("Do not update anything for option");
            return false;
        }
        let propChange = false;
        const comboBox = widget;
        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];
            if (oldProp === newProp)
                continue;
            propChange = true;
            if (key === 'children') {
                this.handleChildrenUpdate(comboBox, oldProps[key], newProps[key]);
            }
            else if (key === 'onChange' && typeof newProp === 'function') {
                comboBox.OnSelectionChanged.Remove(this.onChangeCallback);
                this.setupChangeHandler(comboBox, newProp);
            }
            else {
                updateProps[this.propsReMapping[key]] = newProp;
            }
        }
        this.commonPropertyInitialized(widget);
        return propChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.SelectWrapper = SelectWrapper;
//# sourceMappingURL=selector.js.map