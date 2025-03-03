"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWrapper = void 0;
exports.CreateReactComponentWrapper = CreateReactComponentWrapper;
exports.createUMGWidgetFromReactComponent = createUMGWidgetFromReactComponent;
exports.updateUMGWidgetPropertyUsingReactComponentProperty = updateUMGWidgetPropertyUsingReactComponentProperty;
exports.convertEventToWidgetDelegate = convertEventToWidgetDelegate;
const UE = require("ue");
const puerts = require("puerts");
class ComponentWrapper {
    typeName;
    props;
    convertCSSToWidget(widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle the style property as needed
            const style = this.props.style;
            // Apply the style to the ComboBox or handle it accordingly
        }
        return undefined;
    }
}
exports.ComponentWrapper = ComponentWrapper;
;
class SelectWrapper extends ComponentWrapper {
    onChangeCallback;
    propsReMapping;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.propsReMapping = {
            'disabled': 'bIsEnabled',
            'onChange': 'OnSelectionChanged',
            'defaultValue': 'SelectedOption'
        };
    }
    convertToWidget() {
        if (this.typeName == "option") {
            console.log("Do not create anything for option");
            return null;
        }
        // combox
        let comboBox = new UE.ComboBoxString;
        // get properties of select
        let children = this.props['children'];
        let defaultValue = this.props['defaultValue'];
        let disabled = this.props['disabled'];
        // let multiple = this.props['multiple'];
        let onChangeEvent = this.props['onChange'];
        if (disabled) {
            comboBox.bIsEnabled = false;
        }
        // add default options
        // fixme crash here
        // let defaultOptions = UE.NewArray<UE.BuiltinString>(children.length);
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let option = child['type'];
            if (option == 'option') {
                let actualValue = child['props']['value'];
                let text = child['props']['children'];
                if (actualValue != null) {
                    text = actualValue;
                }
                comboBox.DefaultOptions.Add(text);
                comboBox.AddOption(text);
            }
        }
        if (typeof onChangeEvent == 'function') {
            this.onChangeCallback = (SelectedItem, SelectionType) => {
                onChangeEvent({ 'target': SelectedItem });
            };
            comboBox.OnSelectionChanged.Add(this.onChangeCallback);
        }
        comboBox.SelectedOption = defaultValue;
        super.convertCSSToWidget(comboBox);
        return comboBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propChange = false;
        let comboBox = widget;
        if (this.typeName == "option") {
            console.log("Do not update anything for option");
            return false;
        }
        for (var key in newProps) {
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (oldProp != newProp) {
                if (key == 'children') {
                    // change children items
                    let oldChildNum = oldProp.length;
                    let newChildNum = newProp.length;
                    if (oldChildNum > newChildNum) {
                        let removeItems;
                        for (let i = 0; i < oldChildNum; i++) {
                            if (oldProp[i] in newProp) {
                                continue;
                            }
                            else {
                                let actualValue = oldProp['value'];
                                let text = oldProp['children'];
                                if (actualValue != null) {
                                    text = actualValue;
                                }
                                removeItems.push(text);
                            }
                        }
                        for (var item in removeItems) {
                            comboBox.RemoveOption(item);
                        }
                    }
                    else if (oldChildNum < newChildNum) {
                        let addItems;
                        for (let i = 0; i < newChildNum; i++) {
                            if (newProp[i] in oldProp) {
                                continue;
                            }
                            else {
                                let actualValue = newProp['value'];
                                let text = newProp['children'];
                                if (actualValue != null) {
                                    text = actualValue;
                                }
                                addItems.push(text);
                            }
                        }
                        for (var item in addItems) {
                            comboBox.AddOption(item);
                        }
                    }
                }
                else if (typeof newProp === 'function' && key == 'onChange') {
                    comboBox.OnSelectionChanged.Remove(this.onChangeCallback);
                    this.onChangeCallback = (SelectedItem, SelectionType) => {
                        newProp({ 'target': { 'value': SelectedItem } });
                    };
                    comboBox.OnSelectionChanged.Add(this.onChangeCallback);
                }
                else {
                    updateProps[this.propsReMapping[key]] = newProp;
                }
                propChange = true;
            }
        }
        return propChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ButtonWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class inputWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ContainerWrapper extends ComponentWrapper {
    children;
    constructor(type, props) {
        super();
        this.children = [];
    }
    convertToWidget() {
        return undefined;
    }
    addChild(child) {
        this.children.push(child);
    }
    getChildren() {
        return this.children;
    }
    render() {
        console.log("Rendering container with children:", this.children);
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ProgressBarWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ImageWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class RichTextBlockWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ListViewWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class TextBlockWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
const baseComponentsMap = {
    // base
    "select": SelectWrapper,
    "option": SelectWrapper,
    "button": "ButtonWrapper",
    "textarea": "MultiLineEditableTextWrapper",
    "progress": "ProgressBarWrapper",
    "img": "ImageWrapper",
    // 列表
    "ul": "ListViewWrapper",
    "li": "ListViewItemWrapper",
    // 富文本
    "article": "RichTextBlockWrapper",
    "code": "RichTextBlockWrapper",
    "mark": "RichTextBlockWrapper",
    "a": "RichTextBlockWrapper",
    // input
    "input": "inputWrapper",
    // Text
    "span": "TextBlockWrapper",
    "p": "TextBlockWrapper",
    "text": "TextBlockWrapper",
    // container
    "div": "containerWrapper",
    "view": "containerWrapper",
    "canvas": "CanvasPanelWrapper",
};
function isKeyOfRecord(key, record) {
    return key in record;
}
function isEmpty(record) {
    return Object.keys(record).length === 0;
}
function CreateReactComponentWrapper(typeName, props) {
    if (isKeyOfRecord(typeName, baseComponentsMap)) {
        if (typeof baseComponentsMap[typeName] == 'string') {
            return undefined;
        }
        let wrapper = new baseComponentsMap[typeName](typeName, props);
        if (wrapper instanceof ComponentWrapper) {
            return wrapper;
        }
    }
    return undefined;
}
function createUMGWidgetFromReactComponent(wrapper) {
    if (wrapper) {
        return wrapper.convertToWidget();
    }
    return undefined;
}
;
function updateUMGWidgetPropertyUsingReactComponentProperty(widget, wrapper, oldProps, newProps) {
    let propsChange = false;
    let updateProps = {};
    if (wrapper) {
        propsChange = wrapper.updateWidgetProperty(widget, oldProps, newProps, updateProps);
    }
    if (propsChange && !isEmpty(updateProps)) {
        puerts.merge(widget, updateProps);
        UE.UMGManager.SynchronizeWidgetProperties(widget);
    }
    return propsChange;
}
;
function convertEventToWidgetDelegate(wrapper, reactPropName, originCallback) {
    return wrapper.convertReactEventToWidgetEvent(reactPropName, originCallback);
}
//# sourceMappingURL=base_components.js.map