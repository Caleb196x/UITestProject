const baseComponentsMap: Record<string, string> = {
    // base
    "select": "ComboBox",
    "button": "ButtonWrapper",
    "statusbar": "StatusBarWrapper",
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

class ContainerWrapper {
    private children: any[];

    constructor() {
        this.children = [];
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
}

export function replaceReactComponentToUMGWrapper(typeName: string, props: Record<string, any>) {
    // 这里可以根据传入的 typeName 和 props 做一些逻辑处理
    // 假设需要将其转换为某种特定的UMG封装组件

    // 这个例子只是将组件名和属性包装在一个对象中
    return {
        component: typeName,
        properties: props
    };
}

function convertReactContainerToUMGContainer() {

}