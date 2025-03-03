import * as UE from 'ue';
import * as puerts from 'puerts'

export abstract class ComponentWrapper {
    typeName: string;
    props: any;

    abstract convertToWidget(): UE.Widget;

    abstract updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean;

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
            return null;
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
        // fixme crash here
        // let defaultOptions = UE.NewArray<UE.BuiltinString>(children.length);
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let option = child['type'];
            if (option == 'option')
            {
                let actualValue = child['props']['value'] as string;
                let text = child['props']['children'] as string;
                if (actualValue != null)
                {
                    text = actualValue;
                }
                comboBox.DefaultOptions.Add(text);
                comboBox.AddOption(text);
            }
        }

        if (typeof onChangeEvent == 'function') {

            this.onChangeCallback = (SelectedItem: string, SelectionType: UE.ESelectInfo): void => {
                onChangeEvent({'target': {'value': SelectedItem}});
            };

            comboBox.OnSelectionChanged.Add(this.onChangeCallback);
        }

        comboBox.SelectedOption = defaultValue;
        
        super.convertCSSToWidget(comboBox);
        return comboBox;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        let propChange = false;
        let comboBox = widget as UE.ComboBoxString;
        if (this.typeName == "option")
        {
            console.log("Do not update anything for option");
            return false;
        }

        for(var key in newProps) {

            let oldProp = oldProps[key];
            let newProp = newProps[key];

            if (oldProp != newProp) {
                if (key == 'children') {
                    // change children items
                    let oldChildNum = oldProp.length;
                    let newChildNum = newProp.length;
                    
                    
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
                    }

                } else if (typeof newProp === 'function' && key == 'onChange') {
                    comboBox.OnSelectionChanged.Remove(this.onChangeCallback);
                    this.onChangeCallback = (SelectedItem: string, SelectionType: UE.ESelectInfo): void => {
                        newProp({'target': {'value': SelectedItem}});
                    };
                    comboBox.OnSelectionChanged.Add(this.onChangeCallback);
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
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

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
};

const baseComponentsMap: Record<string, any> = {
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
        UE.UMGManager.SynchronizeWidgetProperties(widget)
    }

    return propsChange;
};

export function convertEventToWidgetDelegate(wrapper: ComponentWrapper, reactPropName: string, originCallback: Function) : Function {
    return wrapper.convertReactEventToWidgetEvent(reactPropName, originCallback);
}