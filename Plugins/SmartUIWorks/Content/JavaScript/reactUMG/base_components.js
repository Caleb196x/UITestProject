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
    parseStyleToWidget(widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle the style property as needed
            const style = this.props.style;
            // Apply the style to the ComboBox or handle it accordingly
        }
        return undefined;
    }
    commonPropertyInitialized(widget) {
        if (this.props.hasOwnProperty('title')) {
            let title = this.props['title'];
            widget.SetToolTipText(title);
        }
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
        super.parseStyleToWidget(comboBox);
        this.commonPropertyInitialized(comboBox);
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
        this.commonPropertyInitialized(widget);
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
        super.parseStyleToWidget(button);
        this.commonPropertyInitialized(button);
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
        this.commonPropertyInitialized(widget);
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
                        if (update && this.checkboxChangeCallback) {
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
                        if (update && this.checkboxChangeCallback) {
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
        this.commonPropertyInitialized(returnWidget);
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
        this.commonPropertyInitialized(widget);
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
        this.commonPropertyInitialized(progressBar);
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
        this.commonPropertyInitialized(widget);
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
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        // 关键问题：如何解决图片导入的问题
        // 功能设想
        // 1. 使用import image from '图片路径'的方式导入一张图片，image在UE中的类型为UTexture， 可以直接设置到img标签的src属性中
        // 2. 在img标签的src属性中写入图片路径，在创建对应widget时再导入图片
        // 
        // 实现思路：
        // 1. hook ts的import逻辑，实现导入流程
        // 2. hook js的require逻辑，实现图片的导入；只导入一次，以及通过hash值对比文件是否发生变化，如果发生变化，重新导入
        // 3. 图片导入时，首先读取图片数据，调用ImportFileAsTexture2D API来创建UTexture（创建后是否能够将UTexture保存为本地uasset资产文件？）（思考如何做异步和批量导入，做性能优化）
        // 4. 读取img的标签属性，例如src, width, height
        let imageWidgt = new UE.Image();
        let srcImage = this.props['src'];
        if (typeof srcImage == 'string') {
            // todo@Caleb196x: 如果是网络图片，则需要先下载到本地，同时还要加入缓存，防止每次都下载
            let fullpath = srcImage;
            // todo@Caleb196x: 获取文件全路径，判断文件是否存在
            let texture = UE.KismetRenderingLibrary.ImportFileAsTexture2D(null, fullpath);
            // todo@Caleb196x: 将texture加入全局缓存，如果是相同路径，直接读缓存数据
            if (texture) {
                imageWidgt.SetBrushFromTexture(texture, true);
            }
        }
        else if (srcImage) {
            imageWidgt.SetBrushFromTexture(srcImage, true);
        }
        // todo@Caleb196x: 在style中去设置width和height
        // todo@Caleb196x: 
        let width = this.props['width'];
        let height = this.props['height'];
        return imageWidgt;
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
    richTextSupportTag = ['a', 'code', 'mark', 'article', 'strong', 'em', 'del'];
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    shouldUseRichTextBlock(children) {
        if (typeof children == 'string')
            return false;
        for (var key in children) {
            let value = children[key];
            if (typeof value == 'string') {
                continue;
            }
            if (this.richTextSupportTag.includes(value['type'])) {
                return true;
            }
        }
        return false;
    }
    stringfyPropsToString(prop) {
        if (typeof prop === 'string')
            return prop;
        const children = prop.children
            .map(child => this.stringfyPropsToString(child))
            .join('');
        return `<${prop.type}>${children}</>`;
    }
    convertToWidget() {
        // 对所有text类型的组件均有效：
        // 1. 如果text中child标签中包含或者自身就是<a>, <code>, <mark>，<article> 那么就走rich text block的逻辑
        // 2. 如果text中只有文本数据，那么就走text block的逻辑。（所以判断的逻辑需要写一个单独的判断函数）
        // 3. 如果是rich text block，需要将孩子标签转换为RichTextStyle支持的标签格式并进行处理；
        // 4. 提前创建RichTextStyle资产，在ts中load，然后赋给RichTextBlock
        // 5. todo@Caleb196x: 暂时不处理文本中嵌入img的情况
        // 6. todo@Caleb196x: 可能涉及到修改某个标签的RichTextStyle的情况
        let childs = this.props['children'];
        if (this.shouldUseRichTextBlock(childs)) {
            let richTextWidget = new UE.RichTextBlock();
            let styleSetDataTableClass = UE.Class.Load('/Game/NewDataTable.NewDataTable_C');
            let styleSetDataTable = UE.NewObject(styleSetDataTableClass);
            let richText = '';
            for (var child in childs) {
                richText += this.stringfyPropsToString(child);
            }
            console.log("rich text: ", richText);
            richTextWidget.SetText(richText);
            // todo@Caleb196x: 根据标签中的样式内容，修改对应标签的RichTextStyle
            richTextWidget.SetTextStyleSet(styleSetDataTable);
            return richTextWidget;
        }
        else {
            let textWidget = new UE.TextBlock();
            let text = this.props['children'];
            if (typeof text === 'string') {
                textWidget.SetText(text);
            }
            console.log("text: ", text);
            // todo@Caleb196x: 设置text的样式
            return textWidget;
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let propsChange = false;
        let richTextWidget = widget;
        for (var key in newProps) {
            if (key == 'type')
                continue;
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (oldProp != newProp && key == 'children') { // fixme@Caleb196x: 这里比较可能会失效
                let richText = '';
                for (var child in newProp) {
                    richText += this.stringfyPropsToString(child);
                }
                console.log("rich text when update widget property: ", richText);
                richTextWidget.SetText(richText);
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
class ListViewWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        if (this.typeName == 'li') {
            return null;
        }
        let list = new UE.ListView();
        let listItems = this.props['children'];
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
    propertySetters;
    eventSetters;
    onTextChange;
    onTextSubmit;
    onLostFocus;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.setupPropertySetters();
        this.setupEventSetters();
    }
    setupPropertySetters() {
        this.propertySetters = {
            'value': (widget) => {
                let textVal = this.props['value'];
                if (textVal) {
                    widget.SetText(textVal);
                }
            },
            'defaultValue': (widget) => {
                let textVal = this.props['value'];
                if (textVal) {
                    widget.SetText(textVal);
                }
            },
            'placeholder': (widget) => {
                let placeholder = this.props['placeholder'];
                if (placeholder) {
                    widget.SetHintText(placeholder);
                }
            },
            'readOnly': (widget) => {
                let readOnly = this.props['readOnly'];
                if (readOnly) {
                    widget.SetIsReadOnly(readOnly);
                }
            },
            'disabled': (widget) => {
                let disabled = this.props['disabled'];
                if (disabled) {
                    widget.SetIsEnabled(!disabled);
                }
            },
        };
    }
    setupEventSetters() {
        this.eventSetters = {
            'onChange': (widget, update) => {
                let onChange = this.props['onChange'];
                if (onChange) {
                    if (update && this.onTextChange) {
                        widget.OnTextChanged.Remove(this.onTextChange);
                    }
                    this.onTextChange = (Text) => { onChange({ 'target': { 'value': Text } }); };
                    widget.OnTextChanged.Add(this.onTextChange);
                }
            },
            'onSubmit': (widget, update) => {
                let onSubmit = this.props['onSubmit'];
                if (onSubmit) {
                    if (update && this.onTextSubmit) {
                        widget.OnTextCommitted.Remove(this.onTextSubmit);
                    }
                    this.onTextSubmit = (Text, commitMethod) => {
                        if (commitMethod == UE.ETextCommit.Default) {
                            onSubmit({ 'target': Text });
                        }
                    };
                    widget.OnTextCommitted.Add(this.onTextSubmit);
                }
            },
            'onBlur': (widget, update) => {
                let onBlur = this.props['onBlur'];
                if (onBlur) {
                    if (update && this.onLostFocus) {
                        widget.OnTextCommitted.Remove(this.onLostFocus);
                    }
                    this.onLostFocus = (Text, commitMethod) => {
                        if (commitMethod == UE.ETextCommit.OnUserMovedFocus) {
                            onBlur({ 'target': { 'value': Text } });
                        }
                    };
                    widget.OnTextCommitted.Add(this.onLostFocus);
                }
            },
        };
    }
    convertToWidget() {
        let multiLineText = new UE.MultiLineEditableText();
        this.propertySetters['value'](multiLineText);
        this.propertySetters['defaultValue'](multiLineText);
        this.propertySetters['placeholder'](multiLineText);
        this.propertySetters['readOnly'](multiLineText);
        this.propertySetters['disabled'](multiLineText);
        this.eventSetters['onChange'](multiLineText, false);
        this.eventSetters['onSubmit'](multiLineText, false);
        this.eventSetters['onBlur'](multiLineText, false);
        return multiLineText;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        let multiLine = widget;
        let propsChange = false;
        for (var key in newProps) {
            if (key in this.propertySetters) {
                let oldProp = oldProps[key];
                let newProp = newProps[key];
                if (oldProp != newProp) {
                    this.propertySetters[key](multiLine);
                    propsChange = true;
                }
            }
            if (key in this.eventSetters) {
                let oldProp = oldProps[key];
                let newProp = newProps[key];
                if (oldProp != newProp) {
                    this.eventSetters[key](multiLine, true);
                    propsChange = true;
                }
            }
        }
        return propsChange;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
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
    "img": ImageWrapper,
    // 列表
    "ul": "ListViewWrapper",
    "li": "ListViewWrapper",
    // 富文本
    "article": TextBlockWrapper,
    "code": TextBlockWrapper,
    "mark": TextBlockWrapper,
    "a": TextBlockWrapper,
    "strong": TextBlockWrapper,
    "em": TextBlockWrapper,
    "del": TextBlockWrapper,
    // input
    "input": inputWrapper,
    // Text
    "span": TextBlockWrapper,
    "p": TextBlockWrapper,
    "text": TextBlockWrapper,
    "label": TextBlockWrapper,
    "h1": TextBlockWrapper,
    "h2": TextBlockWrapper,
    "h3": TextBlockWrapper,
    "h4": TextBlockWrapper,
    "h5": TextBlockWrapper,
    "h6": TextBlockWrapper,
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