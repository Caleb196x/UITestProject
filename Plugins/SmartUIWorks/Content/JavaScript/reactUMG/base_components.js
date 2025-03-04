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
                onChangeEvent({ 'target': { 'value': SelectedItem } });
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
        // todo@Caleb196x: update style
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
    OnClickedCallback;
    OnPressedCallback;
    OnReleasedCallback;
    OnHoveredCallback;
    OnUnHoveredCallback;
    OnFocusCallback;
    OnBlurCallback;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        let button = new UE.Button();
        let onClick = this.props['onClick'];
        if (typeof onClick == 'function') {
            this.OnClickedCallback = onClick;
            button.OnClicked.Add(onClick);
        }
        let onMouseDown = this.props['onMouseDown'];
        if (typeof onMouseDown == 'function') {
            this.OnPressedCallback = onMouseDown;
            button.OnPressed.Add(onMouseDown);
        }
        let onMouseUp = this.props['onMouseUp'];
        if (typeof onMouseUp == 'function') {
            this.OnReleasedCallback = onMouseUp;
            button.OnReleased.Add(onMouseUp);
        }
        let onMouseEnter = this.props['onMouseEnter'];
        if (typeof onMouseEnter == 'function') {
            this.OnHoveredCallback = onMouseEnter;
            button.OnHovered.Add(onMouseEnter);
        }
        let onMouseLeave = this.props['onMouseLeave'];
        if (typeof onMouseLeave == 'function') {
            this.OnUnHoveredCallback = onMouseLeave;
            button.OnUnhovered.Add(onMouseLeave);
        }
        let onFocus = this.props['onFocus'];
        if (typeof onFocus == 'function') {
            this.OnFocusCallback = onFocus;
            button.OnHovered.Add(onFocus);
        }
        let onBlur = this.props['onBlur'];
        if (typeof onBlur == 'function') {
            this.OnBlurCallback = onBlur;
            button.OnUnhovered.Add(onBlur);
        }
        let disabled = this.props['disabled'];
        if (disabled) {
            button.bIsEnabled = false;
        }
        super.convertCSSToWidget(button);
        return button;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propsChange = false;
        let button = widget;
        // todo@Caleb196x: update style
        for (var key in newProps) {
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (oldProp != newProp) {
                switch (key) {
                    case 'onClick':
                        if (typeof newProp === 'function') {
                            button.OnClicked.Remove(this.OnClickedCallback);
                            this.OnClickedCallback = newProp;
                            button.OnClicked.Add(this.OnClickedCallback);
                        }
                        break;
                    case 'onMouseDown':
                        if (typeof newProp === 'function') {
                            button.OnPressed.Remove(this.OnPressedCallback);
                            this.OnPressedCallback = newProp;
                            button.OnPressed.Add(this.OnPressedCallback);
                        }
                        break;
                    case 'onMouseUp':
                        if (typeof newProp === 'function') {
                            button.OnReleased.Remove(this.OnReleasedCallback);
                            this.OnReleasedCallback = newProp;
                            button.OnReleased.Add(this.OnReleasedCallback);
                        }
                        break;
                    case 'onMouseEnter':
                        if (typeof newProp === 'function') {
                            button.OnHovered.Remove(this.OnHoveredCallback);
                            this.OnHoveredCallback = newProp;
                            button.OnHovered.Add(this.OnHoveredCallback);
                        }
                        break;
                    case 'onMouseLeave':
                        if (typeof newProp === 'function') {
                            button.OnUnhovered.Remove(this.OnUnHoveredCallback);
                            this.OnUnHoveredCallback = newProp;
                            button.OnUnhovered.Add(this.OnUnHoveredCallback);
                        }
                        break;
                    case 'onFocus':
                        if (typeof newProp === 'function') {
                            button.OnHovered.Remove(this.OnFocusCallback);
                            this.OnFocusCallback = newProp;
                            button.OnHovered.Add(this.OnFocusCallback);
                        }
                        break;
                    case 'onBlur':
                        if (typeof newProp === 'function') {
                            button.OnUnhovered.Remove(this.OnBlurCallback);
                            this.OnBlurCallback = newProp;
                            button.OnUnhovered.Add(this.OnBlurCallback);
                        }
                        break;
                    case 'disabled':
                        button.bIsEnabled = !newProp;
                        break;
                    // Add other properties to update if needed
                    default:
                        break;
                }
            }
        }
        return propsChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class inputWrapper extends ComponentWrapper {
    textChangeCallback;
    checkboxChangeCallback;
    propertySetters;
    eventSetters;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.setupPropertySetters();
        this.setupEventSetters();
    }
    setupPropertySetters() {
        this.propertySetters = {
            'placeholder': (widget, props) => {
                let textInput = widget;
                let placeHolder = props['placeholder'];
                if (placeHolder) {
                    textInput.SetHintText(placeHolder);
                }
            },
            'defaultValue': (widget, props) => {
                let textInput = widget;
                let defaultValue = props['defaultValue'];
                if (defaultValue) {
                    textInput.SetText(defaultValue);
                }
            },
            'disabled': (widget, props) => {
                let textInput = widget;
                let disabled = props['disabled'];
                if (disabled) {
                    textInput.SetIsEnabled(false);
                }
            },
            'readOnly': (widget, props) => {
                let textInput = widget;
                let readOnly = props['readOnly'];
                if (readOnly) {
                    textInput.SetIsReadOnly(true);
                }
            },
            'checked': (widget, props) => {
                let checkbox = widget;
                let checked = props['checked'];
                if (checked) {
                    checkbox.SetIsChecked(true);
                }
            }
        };
    }
    setupEventSetters() {
        this.eventSetters = {
            'onChange': (widget, props, update) => {
                if (widget instanceof UE.EditableText) {
                    let textInput = widget;
                    let onChange = props['onChange'];
                    if (typeof onChange === 'function') {
                        if (update) {
                            textInput.OnTextChanged.Remove(this.textChangeCallback);
                        }
                        this.textChangeCallback = (text) => { onChange({ 'target': { 'value': text } }); };
                        textInput.OnTextChanged.Add(this.textChangeCallback);
                    }
                }
                else if (widget instanceof UE.CheckBox) {
                    let checkbox = widget;
                    let onChange = props['onChange'];
                    if (typeof onChange === 'function') {
                        if (update) {
                            checkbox.OnCheckStateChanged.Remove(this.checkboxChangeCallback);
                        }
                        this.checkboxChangeCallback = (isChecked) => { onChange({ 'target': { 'checked': isChecked } }); };
                        checkbox.OnCheckStateChanged.Add(this.checkboxChangeCallback);
                    }
                }
            }
        };
    }
    initOrUpdateWidgetProperties(initPropsName, widget, propsValue, isUpdate) {
        for (let propName of initPropsName) {
            if (propName in this.propertySetters) {
                this.propertySetters[propName](widget, propsValue);
            }
            if (propName in this.eventSetters) {
                this.eventSetters[propName](widget, propsValue, isUpdate);
            }
        }
    }
    convertToWidget() {
        let inputType = this.props['type'];
        if (!inputType) {
            inputType = 'text';
        }
        let returnWidget;
        if (inputType == 'text') {
            let textInput = new UE.EditableText();
            this.initOrUpdateWidgetProperties(['onChange', 'placeholder', 'defaultValue', 'disabled', 'readOnly'], textInput, this.props, false);
            returnWidget = textInput;
        }
        else if (inputType == 'checkbox') {
            let checkbox = new UE.CheckBox();
            this.initOrUpdateWidgetProperties(['onChange', 'checked'], checkbox, this.props, false);
            returnWidget == checkbox;
        }
        else if (inputType == 'password') {
            let passwordInput = new UE.EditableText();
            passwordInput.SetIsPassword(true);
            this.initOrUpdateWidgetProperties(['onChange', 'defaultValue', 'readOnly'], passwordInput, this.props, false);
            returnWidget = passwordInput;
        }
        return returnWidget;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propsChange = false;
        let oldType = oldProps['type'];
        let newType = newProps['type'];
        if (oldType != newType) {
            console.error('Cannot change input type');
            return propsChange;
        }
        // todo@Caleb196x: update style
        for (var key in newProps) {
            if (key == 'type')
                continue;
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (oldProp != newProp) {
                if (newType == 'text' && widget instanceof UE.EditableText) {
                    this.initOrUpdateWidgetProperties(['onChange', 'placeholder', 'defaultValue', 'disabled', 'readOnly'], widget, newProps, true);
                }
                else if (newType == 'checkbox' && widget instanceof UE.CheckBox) {
                    this.initOrUpdateWidgetProperties(['onChange', 'checked'], widget, this.props, true);
                }
                else if (newType == 'password' && widget instanceof UE.EditableText) {
                    this.initOrUpdateWidgetProperties(['onChange', 'defaultValue', 'readOnly'], widget, this.props, true);
                }
                propsChange = true;
            }
        }
        return propsChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class ProgressBarWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        let progressBar = new UE.ProgressBar();
        let progressVal = this.props['value'] || 0.0; // Default to 0 if not provided
        let maxVal = this.props['max'] || 100.0; // Default to false if not provided
        let precent = progressVal / maxVal;
        progressBar.SetPercent(precent);
        return progressBar;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propsChange = false;
        let progressBar = widget;
        let oldVal = oldProps['value'];
        let newVal = newProps['value'];
        let newMaxVal = newProps['max'];
        if (oldVal != newVal) {
            let precent = newVal / newMaxVal;
            progressBar.SetPercent(precent);
            propsChange = true;
        }
        // todo@Caleb196x: update style
        return propsChange;
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
class TextareaWrapper extends ComponentWrapper {
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
const baseComponentsMap = {
    // base
    "select": SelectWrapper,
    "option": SelectWrapper,
    "button": ButtonWrapper,
    "textarea": TextareaWrapper,
    "progress": ProgressBarWrapper,
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
    "input": inputWrapper,
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
    }
    else if (propsChange) {
        UE.UMGManager.SynchronizeWidgetProperties(widget);
    }
    return propsChange;
}
;
function convertEventToWidgetDelegate(wrapper, reactPropName, originCallback) {
    return wrapper.convertReactEventToWidgetEvent(reactPropName, originCallback);
}
//# sourceMappingURL=base_components.js.map