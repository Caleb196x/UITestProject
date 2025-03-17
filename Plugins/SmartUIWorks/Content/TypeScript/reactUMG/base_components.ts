import * as UE from 'ue';
import * as puerts from 'puerts'

// Base abstract class for all component wrappers
export abstract class ComponentWrapper {
    typeName: string;
    props: any;

    abstract convertToWidget(): UE.Widget;
    abstract updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean;
    abstract convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function;

    parseStyleToWidget(widget: UE.Widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle style property
            const style = this.props.style;
            // Apply style to widget
        }
        return undefined;
    }

    commonPropertyInitialized(widget: UE.Widget) {
        if (this.props.hasOwnProperty('title')) {
            widget.SetToolTipText(this.props.title as string);
        }
    }

    appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any) {
        // Default empty implementation
    }
}

// Factory function to create component wrappers
function createWrapper<T extends ComponentWrapper>(
    WrapperClass: new (type: string, props: any) => T,
    type: string,
    props: any
): T {
    return new WrapperClass(type, props);
}

// Component wrapper implementations
class SelectWrapper extends ComponentWrapper {
    private onChangeCallback: (selectedItem: string, selectionType: UE.ESelectInfo) => void;
    private readonly propsReMapping: Record<string, string> = {
        'disabled': 'bIsEnabled',
        'onChange': 'OnSelectionChanged', 
        'defaultValue': 'SelectedOption'
    };

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private setupChangeHandler(comboBox: UE.ComboBoxString, onChange: Function) {
        if (typeof onChange === 'function') {
            this.onChangeCallback = (selectedItem: string, selectionType: UE.ESelectInfo) => {
                onChange({target: {value: selectedItem}});
            };
            comboBox.OnSelectionChanged.Add(this.onChangeCallback);
        }
    }

    private addOptions(comboBox: UE.ComboBoxString, children: any[]) {
        for (const child of children) {
            if (child.type === 'option') {
                const text = child.props.value ?? child.props.children;
                comboBox.DefaultOptions.Add(text);
                comboBox.AddOption(text);
            }
        }
    }

    private handleChildrenUpdate(comboBox: UE.ComboBoxString, oldChildren: any[], newChildren: any[]) {
        const oldChildNum = oldChildren.length;
        const newChildNum = newChildren.length;

        if (oldChildNum > newChildNum) {
            this.removeOptions(comboBox, oldChildren, newChildren);
        } else if (oldChildNum < newChildNum) {
            this.addNewOptions(comboBox, oldChildren, newChildren);
        }
    }

    private removeOptions(comboBox: UE.ComboBoxString, oldChildren: any[], newChildren: any[]) {
        const removeItems: string[] = [];
        for (let i = 0; i < oldChildren.length; i++) {
            if (oldChildren[i] in newChildren) continue;
            
            const text = oldChildren['value'] ?? oldChildren['children'];
            removeItems.push(text);
        }

        for (const item of removeItems) {
            comboBox.RemoveOption(item);
        }
    }

    private addNewOptions(comboBox: UE.ComboBoxString, oldChildren: any[], newChildren: any[]) {
        const addItems: string[] = [];
        for (let i = 0; i < newChildren.length; i++) {
            if (newChildren[i] in oldChildren) continue;
            
            const text = newChildren['value'] ?? newChildren['children'];
            addItems.push(text);
        }

        // todo@Caleb196x: update style
        for (const item of addItems) {
            comboBox.AddOption(item);
        }
    }

    override convertToWidget(): UE.Widget {
        if (this.typeName === "option") return null;

        const comboBox = new UE.ComboBoxString();
        const {children, defaultValue, disabled, onChange} = this.props;

        if (disabled) comboBox.bIsEnabled = false;

        this.addOptions(comboBox, children);
        this.setupChangeHandler(comboBox, onChange);
        comboBox.SelectedOption = defaultValue;
        
        this.parseStyleToWidget(comboBox);
        this.commonPropertyInitialized(comboBox);
        
        return comboBox;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        if (this.typeName === "option") {
            console.log("Do not update anything for option");
            return false;
        }

        let propChange = false;
        const comboBox = widget as UE.ComboBoxString;

        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];

            if (oldProp === newProp) continue;

            propChange = true;

            if (key === 'children') {
                this.handleChildrenUpdate(comboBox, oldProps[key], newProps[key]);
            } else if (key === 'onChange' && typeof newProp === 'function') {
                comboBox.OnSelectionChanged.Remove(this.onChangeCallback);
                this.setupChangeHandler(comboBox, newProp);
            } else {
                updateProps[this.propsReMapping[key]] = newProp;
            }
        }

        this.commonPropertyInitialized(widget);
        return propChange;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class ButtonWrapper extends ComponentWrapper {
    private readonly eventCallbacks: Record<string, Function> = {
        onClick: undefined,
        onMouseDown: undefined, 
        onMouseUp: undefined,
        onMouseEnter: undefined,
        onMouseLeave: undefined,
        onFocus: undefined,
        onBlur: undefined
    };

    private readonly eventMappings: Record<string, {event: string, handler: string}> = {
        onClick: {event: 'OnClicked', handler: 'onClick'},
        onMouseDown: {event: 'OnPressed', handler: 'onMouseDown'},
        onMouseUp: {event: 'OnReleased', handler: 'onMouseUp'}, 
        onMouseEnter: {event: 'OnHovered', handler: 'onMouseEnter'},
        onMouseLeave: {event: 'OnUnhovered', handler: 'onMouseLeave'},
        onFocus: {event: 'OnHovered', handler: 'onFocus'},
        onBlur: {event: 'OnUnhovered', handler: 'onBlur'}
    };

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private setupEventHandler(button: UE.Button, eventName: string, handler: Function) {
        if (typeof handler === 'function') {
            const mapping = this.eventMappings[eventName];
            this.eventCallbacks[mapping.handler] = handler;
            button[mapping.event].Add(handler);
        }
    }

    private removeEventHandler(button: UE.Button, eventName: string) {
        const mapping = this.eventMappings[eventName];
        const callback = this.eventCallbacks[mapping.handler];
        if (callback) {
            button[mapping.event].Remove(callback);
        }
    }

    override convertToWidget(): UE.Widget {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        let propsChange = false;
        const button = widget as UE.Button;

        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];

            if (oldProp === newProp) continue;

            propsChange = true;

            if (key in this.eventMappings) {
                if (typeof newProp === 'function') {
                    this.removeEventHandler(button, key);
                    this.setupEventHandler(button, key, newProp);
                }
            } else if (key === 'disabled') {
                button.bIsEnabled = !newProp;
            }
        }

        this.commonPropertyInitialized(widget);
        return propsChange;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class InputWrapper extends ComponentWrapper {
    private textChangeCallback: (text: string) => void;
    private checkboxChangeCallback: (isChecked: boolean) => void;

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private handleTextChange(widget: UE.EditableText, onChange: Function) {
        if (this.textChangeCallback) {
            widget.OnTextChanged.Remove(this.textChangeCallback);
        }
        this.textChangeCallback = (text: string) => onChange({target: {value: text}});
        widget.OnTextChanged.Add(this.textChangeCallback);
    }

    private handleCheckboxChange(widget: UE.CheckBox, onChange: Function) {
        if (this.checkboxChangeCallback) {
            widget.OnCheckStateChanged.Remove(this.checkboxChangeCallback);
        }
        this.checkboxChangeCallback = (isChecked: boolean) => onChange({target: {checked: isChecked}});
        widget.OnCheckStateChanged.Add(this.checkboxChangeCallback);
    }

    private setupTextInput(widget: UE.EditableText, props: any) {
        const { placeholder, defaultValue, disabled, readOnly, onChange } = props;
        
        if (placeholder) widget.SetHintText(placeholder);
        if (defaultValue) widget.SetText(defaultValue);
        if (disabled) widget.SetIsEnabled(false);
        if (readOnly) widget.SetIsReadOnly(true);
        if (typeof onChange === 'function') this.handleTextChange(widget, onChange);
    }

    private setupCheckbox(widget: UE.CheckBox, props: any) {
        const { checked, onChange } = props;
        
        if (checked) widget.SetIsChecked(true);
        if (typeof onChange === 'function') this.handleCheckboxChange(widget, onChange);
    }

    override convertToWidget(): UE.Widget {
        const inputType = this.props.type || 'text';
        let widget: UE.Widget;

        if (inputType === 'checkbox') {
            widget = new UE.CheckBox();
            this.setupCheckbox(widget as UE.CheckBox, this.props);
        } else {
            widget = new UE.EditableText();
            if (inputType === 'password') {
                (widget as UE.EditableText).SetIsPassword(true);
            }
            this.setupTextInput(widget as UE.EditableText, this.props);
        }

        this.commonPropertyInitialized(widget);
        return widget;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
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
        } else if (widget instanceof UE.EditableText) {
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

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class ProgressBarWrapper extends ComponentWrapper {
    private readonly defaultProps = {
        value: 0.0,
        max: 100.0
    };

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = {...this.defaultProps, ...props};
    }

    private calculatePercent(value: number, max: number): number {
        // Ensure max is not 0 to avoid division by zero
        max = max || this.defaultProps.max;
        // Clamp value between 0 and max
        value = Math.max(0, Math.min(value, max));
        return value / max;
    }

    private updateProgressBar(progressBar: UE.ProgressBar, value: number, max: number) {
        const percent = this.calculatePercent(value, max);
        progressBar.SetPercent(percent);
    }

    override convertToWidget(): UE.Widget {
        const progressBar = new UE.ProgressBar();
        const { value, max } = this.props;
        
        this.updateProgressBar(progressBar, value, max);
        this.parseStyleToWidget(progressBar);
        this.commonPropertyInitialized(progressBar);
        
        return progressBar;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        const progressBar = widget as UE.ProgressBar;
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

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class ImageWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private loadTexture(src: string): UE.Texture2D | undefined {
        if (!src) return undefined;

        // Handle texture object directly
        if (typeof src !== 'string') {
            return src as UE.Texture2D;
        }

        // todo@Caleb196x: 如果是网络图片，则需要先下载到本地，同时还要加入缓存，防止每次都下载
        // Import texture from file path
        const texture = UE.KismetRenderingLibrary.ImportFileAsTexture2D(null, src);
        return texture;
    }

    private setImageBrush(image: UE.Image, texture: UE.Texture2D | undefined) {
        if (!texture) return;
        image.SetBrushFromTexture(texture, true);
    }


    override convertToWidget(): UE.Widget {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        const image = widget as UE.Image;
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

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class TextBlockWrapper extends ComponentWrapper {
    private readonly richTextSupportTags: string[] = ['a', 'code', 'mark', 'article', 'strong', 'em', 'del'];

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private isRichTextContent(content: any): boolean {
        if (typeof content === 'string') return false;

        if (Array.isArray(content)) {
            return content.some(child => 
                typeof child === 'object' && 
                this.richTextSupportTags.includes(child.type)
            );
        }

        return typeof content === 'object' && 
               this.richTextSupportTags.includes(content.type);
    }

    private convertToRichText(content: any): string {
        if (typeof content === 'string') return content;

        if (Array.isArray(content)) {
            return content.map(child => this.convertToRichText(child)).join('');
        }

        const tag = content.type;
        const children = content.props.children;
        const childContent = this.convertToRichText(children);

        return `<${tag}>${childContent}</>`;
    }

    private createRichTextBlock(content: any): UE.RichTextBlock {
        const richTextBlock = new UE.RichTextBlock();
        const styleSet = UE.DataTable.Find('/Game/NewDataTable.NewDataTable') as UE.DataTable;
        
        const richText = this.convertToRichText(content);
        richTextBlock.SetText(richText);
        richTextBlock.SetTextStyleSet(styleSet);

        return richTextBlock;
    }

    private createTextBlock(text: string): UE.TextBlock {
        const textBlock = new UE.TextBlock();
        textBlock.SetText(text);
        return textBlock;
    }

    override convertToWidget(): UE.Widget {
        const content = this.props.children;
        let widget: UE.Widget;

        if (this.isRichTextContent(content)) {
            widget = this.createRichTextBlock(content);
        } else {
            widget = this.createTextBlock(
                typeof content === 'string' ? content : ''
            );
        }

        this.commonPropertyInitialized(widget);
        return widget;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        if (!('children' in newProps) || newProps.children === oldProps.children) {
            return false;
        }

        const content = this.convertToRichText(newProps.children);

        if (widget instanceof UE.TextBlock) {
            widget.SetText(content);
        } else if (widget instanceof UE.RichTextBlock) {
            widget.SetText(content);
        }

        return true;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

class ListViewWrapper extends ComponentWrapper {
    private listItemType: string;
    private listView: UE.ListView;
    private listItems: UE.Widget[];
    private widgetNameToObject: Record<string, UE.Widget>;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.listItemType = '';
        this.listView = undefined;
        this.listItems = [];
        this.widgetNameToObject = {};
    }

    checkAllItemTypeIsSame(): string {
        let children = this.props.children;
        let itemType = '';
        for (var key in children) {
            let item = children[key]['props']['children'];
            let currItemType = item['type'];

            if (itemType === '') {
                itemType = currItemType 
            }

            if (itemType !== currItemType) {
                throw new Error('list item type must be same!');
            }
        }

        return itemType;
    }

    override convertToWidget(): UE.Widget {
        if (this.typeName === 'li') {
            // 读取children，如果是子标签，那么创建wrapper，然后调用convertToWidget创建对应的Widget
            if (typeof this.props.children === 'string') {
                let textWidget = new UE.TextBlock();
                textWidget.SetText(this.props.children);
                return textWidget;
            } else {
                
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
        } else if (this.typeName === 'ul') {
            this.listView = new UE.ListView();
            
            // check all items' type is the same
            let buttonClass: UE.UserWidget = UE.UserWidget.Load('/Game/Button.Button');
            // this.listView.EntryWidgetClass = buttonClass.StaticClass();
            this.commonPropertyInitialized(this.listView);
            // todo@Caleb196x: support style
            return this.listView;
        }

        return undefined;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any) {
        if (childItemTypeName === this.listItemType) {
            this.listView.AddItem(childItem);
        }
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        
        if (this.typeName === 'li') {

        } else if (this.typeName === 'ul') {
            // todo@Caleb196x: 增加或者删除Item，需要额外信息标记已添加了哪些Item
            // 1. 通过对比新旧props中item的数量
            // 2. 如果数量减少，找出新旧props中的item，然后删除
            // 3. 如果数量增加，找出新旧props中的item，然后添加
            let oldChildren = oldProps['children'];
            let newChildren = newProps['children'];
            if (oldChildren.length > newChildren.length) {
                // todo@Caleb196x: 删除
            } else if (oldChildren.length < newChildren.length) {
                // todo: 增加item
            }
        }

        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};
class TextareaWrapper extends ComponentWrapper {
    private readonly propertySetters: Record<string, (widget: UE.MultiLineEditableText, value: any) => void> = {
        'value': (widget, value) => value && widget.SetText(value),
        'defaultValue': (widget, value) => value && widget.SetText(value), 
        'placeholder': (widget, value) => value && widget.SetHintText(value),
        'readOnly': (widget, value) => value && widget.SetIsReadOnly(value),
        'disabled': (widget, value) => value && widget.SetIsEnabled(!value)
    };

    private readonly eventHandlers: Record<string, {
        event: string,
        setup: (widget: UE.MultiLineEditableText, handler: Function) => Function
    }> = {
        'onChange': {
            event: 'OnTextChanged',
            setup: (widget, handler) => {
                const callback = (text: string) => handler({target: {value: text}});
                widget.OnTextChanged.Add(callback);
                return callback;
            }
        },
        'onSubmit': {
            event: 'OnTextCommitted', 
            setup: (widget, handler) => {
                const callback = (text: string, commitMethod: UE.ETextCommit) => {
                    if (commitMethod === UE.ETextCommit.Default) {
                        handler({target: text});
                    }
                };
                widget.OnTextCommitted.Add(callback);
                return callback;
            }
        },
        'onBlur': {
            event: 'OnTextCommitted',
            setup: (widget, handler) => {
                const callback = (text: string, commitMethod: UE.ETextCommit) => {
                    if (commitMethod === UE.ETextCommit.OnUserMovedFocus) {
                        handler({target: {value: text}});
                    }
                };
                widget.OnTextCommitted.Add(callback);
                return callback;
            }
        }
    };

    private eventCallbacks: Record<string, Function> = {};

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    override convertToWidget(): UE.Widget {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        const multiLine = widget as UE.MultiLineEditableText;
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

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}

enum UMGContainerType {
    ScrollBox,
    GridPanel, 
    HorizontalBox,
    VerticalBox,
    WrapBox
}

class ContainerWrapper extends ComponentWrapper {
    private children: any[];
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.children = [];
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }

    override convertToWidget(): UE.Widget { 
        let classNameStyles = {};
        if (this.props.className) {
            // Split multiple classes
            const classNames = this.props.className.split(' ');
            for (const className of classNames) {
                // Get styles associated with this class name
                const classStyle = getCssStyleForClass(className) ?? {};
                // todo@Caleb196x: 解析classStyle
                if (classStyle) {
                    // Merge the class styles into our style object
                    classNameStyles = { ...classNameStyles, ...classStyle };
                }
            }
        }

        // Merge className styles with inline styles, giving precedence to inline styles
        this.props.style = { ...classNameStyles, ...(this.props.style || {}) };
        
        const style = typeof this.props.style === 'string' ? {} : this.props.style;
        this.containerStyle = style;

        const display = style?.display || 'flex';
        const flexDirection = style?.flexDirection || 'row';
        const overflow = style?.overflow || 'hidden';
        const gridTemplateColumns = style?.gridTemplateColumns;

        // todo@Caleb196x: 处理flex-flow参数

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto') {
            widget = new UE.ScrollBox();
            this.containerType = UMGContainerType.ScrollBox;
        } else if (display === 'grid' && gridTemplateColumns) {
            // grid panel
            widget = new UE.GridPanel();
            this.containerType = UMGContainerType.GridPanel;
            // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
        } else if (display === 'flex') {
            const flexWrap = style?.flexWrap || 'nowrap';
            if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
                widget = new UE.WrapBox();
                this.containerType = UMGContainerType.WrapBox;
                let wrapBox = widget as UE.WrapBox;

                wrapBox.Orientation = 
                    (flexDirection === 'column'|| flexDirection === 'column-reverse')
                    ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;

            } else if (flexDirection === 'row' || flexDirection === 'row-reverse') {

                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;

            } else if (flexDirection === 'column' || flexDirection === 'column-reverse') {

                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;

            }
        } else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = UMGContainerType.VerticalBox;
        }

        return widget;
    }

    private convertPixelToSU(pixel: string): number {
        // todo@Caleb196x: 将react中的单位转换为SU单位(UMG中的单位值)
        return 0; 
    }
    
    private setupAlignment(Slot: UE.PanelSlot, childProps: any) {
        const style = this.containerStyle || {};
        const justifyContent = style.justifyContent || 'flex-start';
        const alignItems = style.alignItems || 'stretch';
        const display = style.display;
        let rowReverse = display === 'row-reverse';
        const flexValue = childProps.style?.flex || 1;

        // Set horizontal alignment based on justifyContent
        const hSlotJustifyContentActionMap = {
            'flex-start': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left),
            'flex-end': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right),
            'center': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill),
            'space-between': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill))
        };

        const vSlotJustifyContentActionMap = {
            'flex-start': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'flex-end': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill),
            'space-between': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill))
        };
        
        const hAlignItemActionMap = {
            'stretch': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetSize(new UE.SlateChildSize(1, UE.ESlateSizeRule.Fill)),
            'center': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'flex-start': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'flex-end': (horizontalBoxSlot: UE.HorizontalBoxSlot) => horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom)
        }

        const vAlignItemActionMap = {
            'stretch': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill),
            'center': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'flex-start': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left),
            'flex-end': (verticalBoxSlot: UE.VerticalBoxSlot) => verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right)
        }

        if (this.containerType === UMGContainerType.HorizontalBox) {
            const horizontalBoxSlot = Slot as UE.HorizontalBoxSlot;
            justifyContent?.split(' ')
                .filter(value => hSlotJustifyContentActionMap[value])
                .forEach(value => hSlotJustifyContentActionMap[value](horizontalBoxSlot));

            const hAlignItemValues = alignItems?.split(' ') || [];
            const hAlignItemValidValue = hAlignItemValues.find(v => hAlignItemActionMap[v]);
            if (hAlignItemValidValue) {
                hAlignItemActionMap[hAlignItemValidValue](horizontalBoxSlot);
            }
        } else if (this.containerType === UMGContainerType.VerticalBox) {
            const verticalBoxSlot = Slot as UE.VerticalBoxSlot;
            justifyContent?.split(' ')
                .filter(value => vSlotJustifyContentActionMap[value])
                .forEach(value => vSlotJustifyContentActionMap[value](verticalBoxSlot));

            const vAlignItemValues = alignItems?.split(' ') || [];
            const vAlignItemValidValue = vAlignItemValues.find(v => vAlignItemActionMap[v]);
            if (vAlignItemValidValue) {
                vAlignItemActionMap[vAlignItemValidValue](verticalBoxSlot);
            }
        }
    }

    private expandPaddingValues(paddingValues: number[]): number[] {
        if (paddingValues.length === 2) {
            return [paddingValues[0], paddingValues[1], paddingValues[0], paddingValues[1]];
        } else if (paddingValues.length === 1) {
            return [paddingValues[0], paddingValues[0], paddingValues[0], paddingValues[0]];
        } else if (paddingValues.length === 3) {
            // padding: top right bottom
            return [paddingValues[0], paddingValues[1], paddingValues[2], paddingValues[1]];
        }

        return paddingValues;
    }

    private convertMargin(margin: string): UE.Margin {
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

    private convertGap(gap: string) {
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

    private initSlot(Slot: UE.PanelSlot, childProps: any) {
        this.setupAlignment(Slot, childProps);
        let gapPadding = this.convertGap(this.containerStyle?.gap);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = this.convertMargin(childProps.style?.margin); 
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;

        (Slot as any).SetPadding(margin);
    }

    private initWrapBoxSlot(wrapBox: UE.WrapBox, Slot: UE.WrapBoxSlot, childProps: any) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding(this.convertGap(gap));

        const justifyContentActionMap = {
            'flex-start': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Left,
            'flex-end': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Right,
            'center': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Center,
            'stretch': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Fill
        }

        const justifyContent = this.containerStyle?.justifyContent;
        if (justifyContent) {
            justifyContent.split(' ')
                .filter(value => justifyContentActionMap[value])
                .forEach(value => justifyContentActionMap[value]());
        }

        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
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
            [UMGContainerType.HorizontalBox]: (horizontalBox: UE.HorizontalBox, childItem: UE.Widget) => {
                let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
                this.initSlot(horizontalBoxSlot, childProps);
            },
            [UMGContainerType.VerticalBox]: (verticalBox: UE.VerticalBox, childItem: UE.Widget) => {
                let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
                this.initSlot(verticalBoxSlot, childProps);
            },
            [UMGContainerType.WrapBox]: (wrapBox: UE.WrapBox, childItem: UE.Widget) => {
                let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
                this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
            }
        };

        if (this.containerType in addChildActionMap) {
            addChildActionMap[this.containerType](parentItem as any, childItem);
        }
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }


}

const baseComponentsMap: Record<string, any> = {
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

function isKeyOfRecord(key: any, record: Record<string, any>): key is keyof Record<string, any> {
    return key in record;
}

function isEmpty(record: Record<string, any>): boolean {
    return Object.keys(record).length === 0;
}

export function CreateReactComponentWrapper(typeName: string, props: Record<string, any>) : ComponentWrapper {
    if (isKeyOfRecord(typeName, baseComponentsMap))
    {
        if (typeof baseComponentsMap[typeName] == 'string')
        {
            return undefined;
        }

        let wrapper = new baseComponentsMap[typeName](typeName, props);
        if (wrapper instanceof ComponentWrapper)
        {
            return wrapper;
        }
    }

    return undefined;
}

export function createUMGWidgetFromReactComponent(wrapper: ComponentWrapper) : UE.Widget {

    if (wrapper)
    {
        return wrapper.convertToWidget();
    }
    return undefined;
};

export function updateUMGWidgetPropertyUsingReactComponentProperty(widget: UE.Widget, wrapper: ComponentWrapper, oldProps : any, newProps: any) : boolean {
    let propsChange = false;
    let updateProps = {};

    if (wrapper)
    {
        propsChange = wrapper.updateWidgetProperty(widget, oldProps, newProps, updateProps);
    }

    if (propsChange && !isEmpty(updateProps))
    {
        puerts.merge(widget, updateProps);
    } else if (propsChange) {
        UE.UMGManager.SynchronizeWidgetProperties(widget)
    }

    return propsChange;
};

export function convertEventToWidgetDelegate(wrapper: ComponentWrapper, reactPropName: string, originCallback: Function) : Function {
    return wrapper.convertReactEventToWidgetEvent(reactPropName, originCallback);
}