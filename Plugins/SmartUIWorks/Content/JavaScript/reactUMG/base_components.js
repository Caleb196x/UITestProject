"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceReactComponentToUMGWrapper = replaceReactComponentToUMGWrapper;
class ComponentWrapper {
}
;
class SelectWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
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
}
;
class inputWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
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
}
;
class ProgressBarWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
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
}
;
class RichTextBlockWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
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
}
;
class TextBlockWrapper extends ComponentWrapper {
    constructor(type, props) {
        super();
    }
    convertToWidget() {
        return undefined;
    }
}
;
const baseComponentsMap = {
    // base
    "select": "ComboBox",
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
function replaceReactComponentToUMGWrapper(typeName, props) {
    // 这里可以根据传入的 typeName 和 props 做一些逻辑处理
    // 假设需要将其转换为某种特定的UMG封装组件
    // 这个例子只是将组件名和属性包装在一个对象中
    return undefined;
}
function convertReactContainerToUMGContainer() {
}
//# sourceMappingURL=base_components.js.map