"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWrapper = void 0;
exports.CreateReactComponentWrapper = CreateReactComponentWrapper;
exports.createUMGWidgetFromReactComponent = createUMGWidgetFromReactComponent;
exports.updateUMGWidgetPropertyUsingReactComponentProperty = updateUMGWidgetPropertyUsingReactComponentProperty;
exports.convertEventToWidgetDelegate = convertEventToWidgetDelegate;
const UE = require("ue");
const puerts = require("puerts");
const css_converter_1 = require("./css_converter");
// Base abstract class for all component wrappers
class ComponentWrapper {
    typeName;
    props;
    parseStyleToWidget(widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle style property
            const style = this.props.style;
            // Apply style to widget
        }
        return undefined;
    }
    commonPropertyInitialized(widget) {
        if (this.props.hasOwnProperty('title')) {
            widget.SetToolTipText(this.props.title);
        }
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        // Default empty implementation
    }
}
exports.ComponentWrapper = ComponentWrapper;
// Factory function to create component wrappers
function createWrapper(WrapperClass, type, props) {
    return new WrapperClass(type, props);
}
// Component wrapper implementations
class SelectWrapper extends ComponentWrapper {
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
class ButtonWrapper extends ComponentWrapper {
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
        if (this.props.disabled) {
            button.bIsEnabled = false;
        }
        this.parseStyleToWidget(button);
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
class InputWrapper extends ComponentWrapper {
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
class ProgressBarWrapper extends ComponentWrapper {
    defaultProps = {
        value: 0.0,
        max: 100.0
    };
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = { ...this.defaultProps, ...props };
    }
    calculatePercent(value, max) {
        // Ensure max is not 0 to avoid division by zero
        max = max || this.defaultProps.max;
        // Clamp value between 0 and max
        value = Math.max(0, Math.min(value, max));
        return value / max;
    }
    updateProgressBar(progressBar, value, max) {
        const percent = this.calculatePercent(value, max);
        progressBar.SetPercent(percent);
    }
    convertToWidget() {
        const progressBar = new UE.ProgressBar();
        const { value, max } = this.props;
        this.updateProgressBar(progressBar, value, max);
        this.parseStyleToWidget(progressBar);
        this.commonPropertyInitialized(progressBar);
        return progressBar;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const progressBar = widget;
        let hasChanged = false;
        // Check if value or max have changed
        if (oldProps.value !== newProps.value || oldProps.max !== newProps.max) {
            this.updateProgressBar(progressBar, newProps.value, newProps.max);
            hasChanged = true;
        }
        // Update common properties if needed
        if (hasChanged) {
            this.parseStyleToWidget(progressBar);
            this.commonPropertyInitialized(progressBar);
        }
        return hasChanged;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
class ImageWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    loadTexture(src) {
        if (!src)
            return undefined;
        // Handle texture object directly
        if (typeof src !== 'string') {
            return src;
        }
        // todo@Caleb196x: 如果是网络图片，则需要先下载到本地，同时还要加入缓存，防止每次都下载
        // Import texture from file path
        const texture = UE.KismetRenderingLibrary.ImportFileAsTexture2D(null, src);
        return texture;
    }
    setImageBrush(image, texture) {
        if (!texture)
            return;
        image.SetBrushFromTexture(texture, true);
    }
    convertToWidget() {
        const image = new UE.Image();
        const texture = this.loadTexture(this.props.src);
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
        this.setImageBrush(image, texture);
        this.parseStyleToWidget(image);
        this.commonPropertyInitialized(image);
        return image;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const image = widget;
        let hasChanged = false;
        // Check if src has changed
        if (oldProps.src !== newProps.src) {
            const texture = this.loadTexture(newProps.src);
            this.setImageBrush(image, texture);
            hasChanged = true;
        }
        // Check if size has changed
        if (oldProps.width !== newProps.width || oldProps.height !== newProps.height) {
            // this.updateImageSize(image);
            hasChanged = true;
        }
        // Update common properties if needed
        if (hasChanged) {
            this.parseStyleToWidget(image);
            this.commonPropertyInitialized(image);
        }
        return hasChanged;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
class TextBlockWrapper extends ComponentWrapper {
    richTextSupportTags = ['a', 'code', 'mark', 'article', 'strong', 'em', 'del'];
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    isRichTextContent(content) {
        if (typeof content === 'string')
            return false;
        if (Array.isArray(content)) {
            return content.some(child => typeof child === 'object' &&
                this.richTextSupportTags.includes(child.type));
        }
        return typeof content === 'object' &&
            this.richTextSupportTags.includes(content.type);
    }
    convertToRichText(content) {
        if (typeof content === 'string')
            return content;
        if (Array.isArray(content)) {
            return content.map(child => this.convertToRichText(child)).join('');
        }
        const tag = content.type;
        const children = content.props.children;
        const childContent = this.convertToRichText(children);
        return `<${tag}>${childContent}</>`;
    }
    createRichTextBlock(content) {
        const richTextBlock = new UE.RichTextBlock();
        const styleSet = UE.DataTable.Find('/Game/NewDataTable.NewDataTable');
        const richText = this.convertToRichText(content);
        richTextBlock.SetText(richText);
        richTextBlock.SetTextStyleSet(styleSet);
        return richTextBlock;
    }
    createTextBlock(text) {
        const textBlock = new UE.TextBlock();
        textBlock.SetText(text);
        return textBlock;
    }
    convertToWidget() {
        const content = this.props.children;
        let widget;
        if (this.isRichTextContent(content)) {
            widget = this.createRichTextBlock(content);
        }
        else {
            widget = this.createTextBlock(typeof content === 'string' ? content : '');
        }
        this.commonPropertyInitialized(widget);
        return widget;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        if (!('children' in newProps) || newProps.children === oldProps.children) {
            return false;
        }
        const content = this.convertToRichText(newProps.children);
        if (widget instanceof UE.TextBlock) {
            widget.SetText(content);
        }
        else if (widget instanceof UE.RichTextBlock) {
            widget.SetText(content);
        }
        return true;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
class ListViewWrapper extends ComponentWrapper {
    listItemType;
    listView;
    listItems;
    widgetNameToObject;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.listItemType = '';
        this.listView = undefined;
        this.listItems = [];
        this.widgetNameToObject = {};
    }
    checkAllItemTypeIsSame() {
        let children = this.props.children;
        let itemType = '';
        for (var key in children) {
            let item = children[key]['props']['children'];
            let currItemType = item['type'];
            if (itemType === '') {
                itemType = currItemType;
            }
            if (itemType !== currItemType) {
                throw new Error('list item type must be same!');
            }
        }
        return itemType;
    }
    convertToWidget() {
        if (this.typeName === 'li') {
            // 读取children，如果是子标签，那么创建wrapper，然后调用convertToWidget创建对应的Widget
            if (typeof this.props.children === 'string') {
                let textWidget = new UE.TextBlock();
                textWidget.SetText(this.props.children);
                return textWidget;
            }
            else {
                let child = this.props.children;
                let childType = child['type'];
                if (this.listItemType === '') {
                    this.listItemType = childType;
                }
                if (this.listItemType !== childType) {
                    throw new Error('list item type must be same!');
                }
                let component = CreateReactComponentWrapper(childType, child.props);
                return component.convertToWidget();
            }
        }
        else if (this.typeName === 'ul') {
            this.listView = new UE.ListView();
            // check all items' type is the same
            let buttonClass = UE.UserWidget.Load('/Game/Button.Button');
            // this.listView.EntryWidgetClass = buttonClass.StaticClass();
            this.commonPropertyInitialized(this.listView);
            // todo@Caleb196x: support style
            return this.listView;
        }
        return undefined;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        if (childItemTypeName === this.listItemType) {
            this.listView.AddItem(childItem);
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        if (this.typeName === 'li') {
        }
        else if (this.typeName === 'ul') {
            // todo@Caleb196x: 增加或者删除Item，需要额外信息标记已添加了哪些Item
            // 1. 通过对比新旧props中item的数量
            // 2. 如果数量减少，找出新旧props中的item，然后删除
            // 3. 如果数量增加，找出新旧props中的item，然后添加
            let oldChildren = oldProps['children'];
            let newChildren = newProps['children'];
            if (oldChildren.length > newChildren.length) {
                // todo@Caleb196x: 删除
            }
            else if (oldChildren.length < newChildren.length) {
                // todo: 增加item
            }
        }
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
;
class TextareaWrapper extends ComponentWrapper {
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
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
var UMGContainerType;
(function (UMGContainerType) {
    UMGContainerType[UMGContainerType["ScrollBox"] = 0] = "ScrollBox";
    UMGContainerType[UMGContainerType["GridPanel"] = 1] = "GridPanel";
    UMGContainerType[UMGContainerType["HorizontalBox"] = 2] = "HorizontalBox";
    UMGContainerType[UMGContainerType["VerticalBox"] = 3] = "VerticalBox";
    UMGContainerType[UMGContainerType["WrapBox"] = 4] = "WrapBox";
})(UMGContainerType || (UMGContainerType = {}));
class ContainerWrapper extends ComponentWrapper {
    containerStyle;
    containerType;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }
    // Helper method to parse grid template values
    parseGridTemplate(template) {
        const result = [];
        // Handle repeat syntax: repeat(3, 1fr)
        if (template.includes('repeat(')) {
            const repeatRegex = /repeat\((\d+),\s*([^)]+)\)/g;
            let match;
            while ((match = repeatRegex.exec(template)) !== null) {
                const count = parseInt(match[1], 10);
                const value = match[2].trim();
                // Create the specified number of identical definitions
                for (let i = 0; i < count; i++) {
                    result.push(this.parseGridValue(value));
                }
            }
        }
        else {
            // Handle normal space-separated values: 1fr auto 100px
            const values = template.split(/\s+/);
            for (const value of values) {
                result.push(this.parseGridValue(value));
            }
        }
        return result;
    }
    // Helper method to parse individual grid values
    parseGridValue(value) {
        if (value === 'auto') {
            return { type: 'auto', value: 0 };
        }
        // Match numeric value and unit
        const match = value.match(/^(\d*\.?\d+)([a-z%]*)$/);
        if (match) {
            let numValue = parseFloat(match[1]);
            const unit = match[2] || 'px';
            if (unit === 'em' || unit === 'rem') {
                numValue = numValue * 16;
            }
            // todo@Caleb196x: 需要知道父控件的宽度和长度所占像素值，然后根据px值转换成占比值fr
            return { type: unit, value: numValue };
        }
        // Default fallback
        return { type: 'fr', value: 1 };
    }
    setupGridRowAndColumns(gridPanel) {
        const gridTemplateColumns = this.containerStyle?.gridTemplateColumns;
        const gridTemplateRows = this.containerStyle?.gridTemplateRows;
        const gridTemplate = this.containerStyle?.gridTemplate;
        // todo@Caleb196x: 目前只处理gridTemplateColumns和gridTemplateRows两个参数
        // Parse gridTemplateColumns and gridTemplateRows
        if (gridTemplateColumns) {
            const columnDefinitions = this.parseGridTemplate(gridTemplateColumns);
            for (let i = 0; i < columnDefinitions.length; i++) {
                const columnDef = columnDefinitions[i];
                if (columnDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
                else if (columnDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetColumnFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
            }
        }
        if (gridTemplateRows) {
            const rowDefinitions = this.parseGridTemplate(gridTemplateRows);
            for (let i = 0; i < rowDefinitions.length; i++) {
                const rowDef = rowDefinitions[i];
                if (rowDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetRowFill(i, rowDef.value);
                }
                else if (rowDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetRowFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetRowFill(i, rowDef.value);
                }
            }
        }
    }
    setupScrollBox(scrollBox, isScrollX) {
        if (isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        }
        else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }
        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 12,
            'thin': 8
        };
        if (scrollbarWidth === 'none') {
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Collapsed);
        }
        else {
            if (scrollbarWidth in scrollbarLevel) {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel[scrollbarWidth], scrollbarLevel[scrollbarWidth]));
            }
            else if (scrollbarWidth.endsWith('px')) {
                // Extract the numeric part by removing the 'px' suffix
                const numericWidth = parseInt(scrollbarWidth.slice(0, -2));
                let thickness = new UE.Vector2D(numericWidth, numericWidth);
                scrollBox.SetScrollbarThickness(thickness);
            }
            else {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel['auto'], scrollbarLevel['auto']));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }
        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding(this.convertMargin(scrollPadding));
    }
    convertToWidget() {
        let classNameStyles = {};
        if (this.props.className) {
            // Split multiple classes
            const classNames = this.props.className.split(' ');
            for (const className of classNames) {
                // Get styles associated with this class name
                const classStyle = (0, css_converter_1.convertCssToStyles)(getCssStyleForClass(className));
                // todo@Caleb196x: 解析classStyle
                if (classStyle) {
                    // Merge the class styles into our style object
                    classNameStyles = { ...classNameStyles, ...classStyle };
                }
            }
        }
        // Merge className styles with inline styles, giving precedence to inline styles
        const mergedStyle = { ...classNameStyles, ...(this.props.style || {}) };
        this.containerStyle = mergedStyle;
        const display = mergedStyle?.display || 'flex';
        const flexDirection = mergedStyle?.flexDirection || 'row';
        const overflow = mergedStyle?.overflow || 'visible';
        const overflowX = mergedStyle?.overflowX || 'visible';
        const overflowY = mergedStyle?.overflowY || 'visible';
        // todo@Caleb196x: 处理flex-flow参数
        let widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto' ||
            overflowX === 'scroll' || overflowX === 'auto' ||
            overflowY === 'scroll' || overflowY === 'auto') {
            widget = new UE.ScrollBox();
            this.containerType = UMGContainerType.ScrollBox;
            this.setupScrollBox(widget, overflowX === 'scroll' || overflowX === 'auto');
        }
        else if (display === 'grid') {
            // grid panel
            widget = new UE.GridPanel();
            this.containerType = UMGContainerType.GridPanel;
            // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
            this.setupGridRowAndColumns(widget);
        }
        else if (display === 'flex') {
            const flexWrap = mergedStyle?.flexWrap || 'nowrap';
            if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
                widget = new UE.WrapBox();
                this.containerType = UMGContainerType.WrapBox;
                let wrapBox = widget;
                wrapBox.Orientation =
                    (flexDirection === 'column' || flexDirection === 'column-reverse')
                        ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;
            }
            else if (flexDirection === 'row' || flexDirection === 'row-reverse') {
                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;
            }
            else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;
            }
        }
        else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = UMGContainerType.VerticalBox;
        }
        return widget;
    }
    convertPixelToSU(pixel) {
        // todo@Caleb196x: 将react中的单位转换为SU单位(UMG中的单位值)
        // get font size of parent
        let fontSize = this.containerStyle?.fontSize || '16px';
        if (!fontSize.endsWith('px')) {
            fontSize = '16px';
        }
        const numSize = parseInt(fontSize.replace('px', ''));
        if (pixel.endsWith('px')) {
            const match = pixel.match(/(\d+)px/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        else if (pixel.endsWith('%')) {
            // todo@Caleb196x: 需要获取父元素的值
        }
        else if (pixel.endsWith('em')) {
            const match = pixel.match(/(\d+)em/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }
        else if (pixel.endsWith('rem')) {
            const match = pixel.match(/(\d+)rem/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }
        return 0;
    }
    setupAlignment(Slot, childProps) {
        const style = this.containerStyle || {};
        const justifyContent = childProps.style?.justifyContent || style.justifyContent || 'flex-start';
        const alignItems = childProps.style?.alignItems || style.alignItems || 'stretch';
        const display = style.display;
        let rowReverse = display === 'row-reverse';
        const flexValue = childProps.style?.flex || 1;
        const alignSelf = childProps.style?.alignSelf || 'stretch';
        const justifySelf = childProps.style?.justifySelf || 'stretch';
        // Set horizontal alignment based on justifyContent
        const hStartSetHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };
        const hEndSetHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };
        const hCenterSetHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const hStretchSetHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const hSpaceBetweenSetAlginFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };
        const hJustifySelfActionMap = {
            'flex-start': hStartSetHorizontalAlignmentFunc,
            'flex-end': hEndSetHorizontalAlignmentFunc,
            'left': hStartSetHorizontalAlignmentFunc,
            'right': hEndSetHorizontalAlignmentFunc,
            'start': hStartSetHorizontalAlignmentFunc,
            'end': hEndSetHorizontalAlignmentFunc,
            'center': hCenterSetHorizontalAlignmentFunc,
            'stretch': hStretchSetHorizontalAlignmentFunc,
            'space-between': hSpaceBetweenSetAlginFunc
        };
        const hStartSetVerticalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const hEndSetVerticalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const hCenterSetVerticalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const hStretchSetVerticalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const hAlignSelfActionMap = {
            'stretch': hStretchSetVerticalAlignmentFunc,
            'center': hCenterSetVerticalAlignmentFunc,
            'flex-start': hStartSetVerticalAlignmentFunc,
            'flex-end': hEndSetVerticalAlignmentFunc,
            'start': hStartSetVerticalAlignmentFunc,
            'end': hEndSetVerticalAlignmentFunc,
            'left': hStartSetVerticalAlignmentFunc,
            'right': hEndSetVerticalAlignmentFunc
        };
        const vSpaceBetweenSetAlginFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };
        const vStartSetVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const vEndSetVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const vCenterSetVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const vStretchSetVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const vJustifySelfActionMap = {
            'flex-start': vStartSetVerticalAlignmentFunc,
            'flex-end': vEndSetVerticalAlignmentFunc,
            'start': vStartSetVerticalAlignmentFunc,
            'end': vEndSetVerticalAlignmentFunc,
            'left': vStartSetVerticalAlignmentFunc,
            'right': vEndSetVerticalAlignmentFunc,
            'center': vCenterSetVerticalAlignmentFunc,
            'stretch': vStretchSetVerticalAlignmentFunc,
            'space-between': vSpaceBetweenSetAlginFunc
        };
        const vStartSetHorizontalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };
        const vEndSetHorizontalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };
        const vCenterSetHorizontalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const vStretchSetHorizontalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const vAlignSelfActionMap = {
            'stretch': vStretchSetHorizontalAlignmentFunc,
            'center': vCenterSetHorizontalAlignmentFunc,
            'flex-start': vStartSetHorizontalAlignmentFunc,
            'flex-end': vEndSetHorizontalAlignmentFunc,
            'start': vStartSetHorizontalAlignmentFunc,
            'end': vEndSetHorizontalAlignmentFunc,
            'left': vStartSetHorizontalAlignmentFunc,
            'right': vEndSetHorizontalAlignmentFunc
        };
        const scrollBoxStretchHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const scrollBoxLeftHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
        };
        const scrollBoxRightHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
        };
        const scrollBoxCenterHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const scrollBoxStretchVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const scrollBoxTopVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const scrollBoxBottomVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const scrollBoxCenterVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const scrollBoxJustifySelfActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        };
        const scrollBoxAlignSelfActionMap = {
            'stretch': scrollBoxStretchVerticalAlignmentFunc,
            'top': scrollBoxTopVerticalAlignmentFunc,
            'bottom': scrollBoxBottomVerticalAlignmentFunc,
            'center': scrollBoxCenterVerticalAlignmentFunc,
            'start': scrollBoxTopVerticalAlignmentFunc,
            'end': scrollBoxBottomVerticalAlignmentFunc,
            'flex-start': scrollBoxTopVerticalAlignmentFunc,
            'flex-end': scrollBoxBottomVerticalAlignmentFunc,
        };
        if (this.containerType === UMGContainerType.HorizontalBox) {
            const horizontalBoxSlot = Slot;
            if (justifyContent == 'space-between') {
                hSpaceBetweenSetAlginFunc(horizontalBoxSlot);
            }
            const hJustifySelfValue = justifySelf?.split(' ').find(v => hJustifySelfActionMap[v]);
            if (hJustifySelfValue) {
                hJustifySelfActionMap[hJustifySelfValue](horizontalBoxSlot);
            }
            const hAlignSelfValue = alignSelf?.split(' ').find(v => hAlignSelfActionMap[v]);
            if (hAlignSelfValue) {
                hAlignSelfActionMap[hAlignSelfValue](horizontalBoxSlot);
            }
        }
        else if (this.containerType === UMGContainerType.VerticalBox) {
            const verticalBoxSlot = Slot;
            if (justifyContent == 'space-between') {
                vSpaceBetweenSetAlginFunc(verticalBoxSlot);
            }
            const vJustifySelfValue = justifySelf?.split(' ').find(v => vJustifySelfActionMap[v]);
            if (vJustifySelfValue) {
                vJustifySelfActionMap[vJustifySelfValue](verticalBoxSlot);
            }
            const vAlignSelfValue = alignSelf?.split(' ').find(v => vAlignSelfActionMap[v]);
            if (vAlignSelfValue) {
                vAlignSelfActionMap[vAlignSelfValue](verticalBoxSlot);
            }
        }
        else if (this.containerType === UMGContainerType.ScrollBox) {
            const scrollBoxSlot = Slot;
            const scrollBoxJustifySelfValue = justifySelf?.split(' ').find(v => scrollBoxJustifySelfActionMap[v]);
            if (scrollBoxJustifySelfValue) {
                scrollBoxJustifySelfActionMap[scrollBoxJustifySelfValue](scrollBoxSlot);
            }
            const scrollBoxAlignSelfValue = alignSelf?.split(' ').find(v => scrollBoxAlignSelfActionMap[v]);
            if (scrollBoxAlignSelfValue) {
                scrollBoxAlignSelfActionMap[scrollBoxAlignSelfValue](scrollBoxSlot);
            }
        }
    }
    expandPaddingValues(paddingValues) {
        if (paddingValues.length === 2) {
            return [paddingValues[0], paddingValues[1], paddingValues[0], paddingValues[1]];
        }
        else if (paddingValues.length === 1) {
            return [paddingValues[0], paddingValues[0], paddingValues[0], paddingValues[0]];
        }
        else if (paddingValues.length === 3) {
            // padding: top right bottom
            return [paddingValues[0], paddingValues[1], paddingValues[2], paddingValues[1]];
        }
        return paddingValues;
    }
    convertMargin(margin) {
        if (!margin) {
            return new UE.Margin(0, 0, 0, 0);
        }
        const marginValues = margin.split(' ').map(v => {
            // todo@Caleb196x: 处理margin的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });
        let expandedMarginValues = this.expandPaddingValues(marginValues);
        // React Padding: top right bottom left
        // UMG Padding: Left, Top, Right, Bottom
        return new UE.Margin(expandedMarginValues[3], expandedMarginValues[0], expandedMarginValues[1], expandedMarginValues[2]);
    }
    convertGap(gap) {
        if (!gap) {
            return new UE.Vector2D(0, 0);
        }
        const gapValues = gap.split(' ').map(v => {
            // todo@Caleb196x: 处理react的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });
        if (gapValues.length === 2) {
            // gap: row column
            // innerSlotPadding: x(column) y(row)
            return new UE.Vector2D(gapValues[1], gapValues[0]);
        }
        return new UE.Vector2D(gapValues[0], gapValues[0]);
    }
    initSlot(Slot, childProps) {
        this.setupAlignment(Slot, childProps);
        let gapPadding = this.convertGap(this.containerStyle?.gap);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = this.convertMargin(childProps.style?.margin);
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;
        Slot.SetPadding(margin);
    }
    initWrapBoxSlot(wrapBox, Slot, childProps) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding(this.convertGap(gap));
        const justifyContentActionMap = {
            'flex-start': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Left,
            'flex-end': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Right,
            'center': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Center,
            'stretch': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Fill
        };
        // WrapBox中定义的justifyContent决定了子元素的对齐方式
        const justifyContent = this.containerStyle?.justifyContent;
        if (justifyContent) {
            justifyContent.split(' ')
                .filter(value => justifyContentActionMap[value])
                .forEach(value => justifyContentActionMap[value]());
        }
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
    }
    parseGridColumnOrRow(value) {
        const values = value.split('/').map(v => v.trim());
        if (values.length === 2) {
            let start = parseInt(values[0]);
            let end = parseInt(values[1]);
            if (end < start) {
                return [start, 0];
            }
            return [start, end - start];
        }
        return [0, 1];
    }
    setupGridItemLoc(GridSlot, childProps) {
        // 优先解析gridColumn和gridRow
        const gridColumn = childProps.style?.gridColumn;
        const gridRow = childProps.style?.gridRow;
        let columnStart = 0, columnSpan = 1;
        let rowStart = 0, rowSpan = 1;
        if (gridColumn) {
            const [start, span] = this.parseGridColumnOrRow(gridColumn);
            columnStart = start;
            columnSpan = span;
        }
        else {
            const gridColumnStart = childProps.style?.gridColumnStart;
            const gridColumnEnd = childProps.style?.gridColumnEnd;
            let start = parseInt(gridColumnStart);
            let end = parseInt(gridColumnEnd);
            if (end < start) {
                columnSpan = 0;
            }
            else {
                columnSpan = end - start;
            }
            columnStart = start;
        }
        if (gridRow) {
            const [start, span] = this.parseGridColumnOrRow(gridRow);
            rowStart = start;
            rowSpan = span;
        }
        else {
            const gridRowStart = childProps.style?.gridRowStart;
            const gridRowEnd = childProps.style?.gridRowEnd;
            let start = parseInt(gridRowStart);
            let end = parseInt(gridRowEnd);
            if (end < start) {
                rowSpan = 0;
            }
            else {
                rowSpan = end - start;
            }
            rowStart = start;
        }
        GridSlot.SetColumn(columnStart);
        GridSlot.SetColumnSpan(columnSpan);
        GridSlot.SetRow(rowStart);
        GridSlot.SetRowSpan(rowSpan);
    }
    setupGridAlignment(GridSlot, childProps) {
        const placeSelf = childProps.style?.placeSelf;
        let hAlign = 'stretch', vAlign = 'stretch';
        if (placeSelf) {
            const [h, v] = placeSelf.split(' ').map(v => v.trim());
            hAlign = h;
            vAlign = v;
        }
        else {
            const alignSelf = childProps.style?.alignSelf;
            const justifySelf = childProps.style?.justifySelf;
            if (alignSelf) {
                hAlign = alignSelf;
            }
            if (justifySelf) {
                vAlign = justifySelf;
            }
        }
        const hAlignActionMap = {
            'start': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        };
        const vAlignActionMap = {
            'start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill)
        };
        hAlignActionMap[hAlign]();
        vAlignActionMap[vAlign]();
    }
    initGridPanelSlot(gridPanel, Slot, childProps) {
        // todo@Caleb196x: 处理网格布局中的子元素位置
        this.setupGridItemLoc(Slot, childProps);
        this.setupGridAlignment(Slot, childProps);
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        const backgroundImage = this.containerStyle?.backgroundImage;
        const backgroundColor = this.containerStyle?.backgroundColor;
        if (backgroundImage || backgroundColor) {
            let border = new UE.Border();
            // todo@Caleb196x: 加载图片
            border.SetBrush(backgroundImage);
            border.AddChild(childItem);
            childItem = border;
        }
        const addChildActionMap = {
            [UMGContainerType.HorizontalBox]: (horizontalBox, childItem) => {
                let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
                this.initSlot(horizontalBoxSlot, childProps);
            },
            [UMGContainerType.VerticalBox]: (verticalBox, childItem) => {
                let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
                this.initSlot(verticalBoxSlot, childProps);
            },
            [UMGContainerType.WrapBox]: (wrapBox, childItem) => {
                let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
                this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
            },
            [UMGContainerType.GridPanel]: (gridPanel, childItem) => {
                let gridSlot = gridPanel.AddChildToGrid(childItem);
                this.initGridPanelSlot(gridPanel, gridSlot, childProps);
            },
            [UMGContainerType.ScrollBox]: (scrollBox, childItem) => {
                let scrollBoxSlot = scrollBox.AddChild(childItem);
                this.initSlot(scrollBoxSlot, childProps);
            }
        };
        if (this.containerType in addChildActionMap) {
            addChildActionMap[this.containerType](parentItem, childItem);
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
const baseComponentsMap = {
    // base
    "select": SelectWrapper,
    "option": SelectWrapper,
    "button": ButtonWrapper,
    "textarea": TextareaWrapper,
    "progress": ProgressBarWrapper,
    "img": ImageWrapper,
    // 列表
    "ul": ListViewWrapper,
    "li": ListViewWrapper,
    // 富文本
    "article": TextBlockWrapper,
    "code": TextBlockWrapper,
    "mark": TextBlockWrapper,
    "a": TextBlockWrapper,
    "strong": TextBlockWrapper,
    "em": TextBlockWrapper,
    "del": TextBlockWrapper,
    // input
    "input": InputWrapper,
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
    "div": ContainerWrapper,
    "view": ContainerWrapper,
    "canvas": ContainerWrapper,
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