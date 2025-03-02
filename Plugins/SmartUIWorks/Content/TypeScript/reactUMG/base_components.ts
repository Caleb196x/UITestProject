import * as UE from 'ue';

abstract class ComponentWrapper {
    typeName: string;
    props: any;

    abstract convertToWidget(): UE.Widget;

    abstract updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean;

    abstract convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function;

    convertCSSToWidget(widget: UE.Widget){
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle the style property as needed
            const style = this.props.style;
            // Apply the style to the ComboBox or handle it accordingly
        }

        return undefined;
    }
};

class SelectWrapper extends ComponentWrapper {
    onChangeCallback: (SelectedItem: string, SelectionType: UE.ESelectInfo) => void;
    propsReMapping: {}

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.propsReMapping = {
            'disabled': 'bIsEnabled',
            'onChange': 'OnSelectionChanged',
            'defaultValue': 'SelectedOption'
        };
    }

    override convertToWidget(): UE.Widget {
        if (this.typeName == "option")
        {
            console.log("Do not create anything for option");
            return undefined;
        }

        // combox
        let comboBox = new UE.ComboBoxString;
        // get properties of select
        let children = this.props['children'];
        let defaultValue = this.props['defaultValue'] as string;
        let disabled = this.props['disabled'];
        // let multiple = this.props['multiple'];
        let onChangeEvent = this.props['onChange'];

        if (disabled)
        {
            comboBox.bIsEnabled = false;
        }

        // add default options
        let defaultOptions: UE.TArray<string>;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let option = child['type'];
            if (option == 'option')
            {
                let actualValue = child['value'];
                let text = child['children'] as string;
                if (actualValue != null)
                {
                    text = actualValue;
                }
                defaultOptions.Add(text);
            }
        }

        if (typeof onChangeEvent == 'function') {

            this.onChangeCallback = (SelectedItem: string, SelectionType: UE.ESelectInfo): void => {
                onChangeEvent({'target': SelectedItem});
            };

            comboBox.OnSelectionChanged.Add(this.onChangeCallback);
        }

        comboBox.DefaultOptions = defaultOptions;
        comboBox.SelectedOption = defaultValue;
        
        super.convertCSSToWidget(comboBox);
        return comboBox;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        let propChange = false;

        for(var key in newProps) {

            let oldProp = oldProps[key];
            let newProp = newProps[key];

            if (oldProp != newProp) {
                if (key == 'children') {
                    // change children items
                    let oldChildNum = oldProp.length;
                    let newChildNum = newProp.length;
                    let comboBox = widget as UE.ComboBoxString;
                    
                    if (oldChildNum > newChildNum) {
                        let removeItems: string[];
                        for (let i = 0; i < oldChildNum; i++) {
                            if (oldProp[i] in newProp) {
                                continue;
                            } else {
                                let actualValue = oldProp['value'];
                                let text = oldProp['children'] as string;
                                if (actualValue != null)
                                {
                                    text = actualValue;
                                }
                                removeItems.push(text);
                            }
                        }

                        for (var item in removeItems) {
                            comboBox.RemoveOption(item);
                        }

                    } else if (oldChildNum < newChildNum) {
                        let addItems: string[];
                        for (let i = 0; i < newChildNum; i++) {
                            if (newProp[i] in oldProp) {
                                continue;
                            } else {
                                let actualValue = newProp['value'];
                                let text = newProp['children'] as string;
                                if (actualValue != null)
                                {
                                    text = actualValue;
                                }
                                addItems.push(text);
                            }
                        }

                        for (var item in addItems) {
                            comboBox.AddOption(item);
                        }
                    } else {

                    }

                } else if (typeof newProp === 'function' && key == 'onChange') {
                    let delegate = widget['OnSelectionChanged'];
                    delegate.Remove(this.onChangeCallback);
                    this.onChangeCallback = (SelectedItem: string, SelectionType: UE.ESelectInfo): void => {
                        newProp({'target': SelectedItem});
                    };
                } else {
                    updateProps[this.propsReMapping[key]] = newProp;
                }

                propChange = true;
            }
        }

        return propChange;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class ButtonWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    override convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class inputWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    override convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class ContainerWrapper extends ComponentWrapper {
    private children: any[];

    constructor(type: string, props: any) {
        super();
        this.children = [];
    }

    override convertToWidget(): UE.Widget {
        return undefined;
    }

    addChild(child: any) {
        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

    render() {
        console.log("Rendering container with children:", this.children);
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class ProgressBarWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class ImageWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class RichTextBlockWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class ListViewWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

class TextBlockWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
    }

    convertToWidget(): UE.Widget {
        return undefined;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Map<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

const baseComponentsMap: Record<string, any> = {
    // base
    "select": SelectWrapper,
    "option": "ComboBoxWrapper",
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

export function createUMGWidgetFromReactComponent(typeName: string, props: Record<string, any>) : UE.Widget {
    // 这里可以根据传入的 typeName 和 props 做一些逻辑处理
    // 假设需要将其转换为某种特定的UMG封装组件

    // 这个例子只是将组件名和属性包装在一个对象中
    let wrapper = new baseComponentsMap[typeName](typeName, props) as ComponentWrapper;

    return wrapper.convertToWidget();
};

export function updateUMGWidgetPropertyUsingReactComponentProperty(widget: UE.Widget, type : string, oldProps : any, newProps: any) : boolean {
    return false;
};

export function convertEventToWidgetDelegate(wrapper: ComponentWrapper, reactPropName: string, originCallback: Function) : Function {
    return wrapper.convertReactEventToWidgetEvent(reactPropName, originCallback);
}