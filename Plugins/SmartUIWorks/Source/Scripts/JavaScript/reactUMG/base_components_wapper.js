"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceReactComponentToUMGWrapper = replaceReactComponentToUMGWrapper;
const baseComponentsMap = {
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
    children;
    constructor() {
        this.children = [];
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
}
function replaceReactComponentToUMGWrapper(typeName, props) {
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
//# sourceMappingURL=base_components_wapper.js.map