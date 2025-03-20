"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReactComponentWrapper = CreateReactComponentWrapper;
exports.createUMGWidgetFromReactComponent = createUMGWidgetFromReactComponent;
exports.updateUMGWidgetPropertyUsingReactComponentProperty = updateUMGWidgetPropertyUsingReactComponentProperty;
exports.convertEventToWidgetDelegate = convertEventToWidgetDelegate;
const UE = require("ue");
const puerts = require("puerts");
const selector_1 = require("./elements/selector");
const button_1 = require("./elements/button");
const textarea_1 = require("./elements/textarea");
const progress_bar_1 = require("./elements/progress_bar");
const image_1 = require("./elements/image");
const listview_1 = require("./elements/listview");
const textblock_1 = require("./elements/textblock");
const container_1 = require("./elements/container/container");
const input_1 = require("./elements/input");
const common_wrapper_1 = require("./elements/common_wrapper");
const baseComponentsMap = {
    // base
    "select": selector_1.SelectWrapper,
    "option": selector_1.SelectWrapper,
    "button": button_1.ButtonWrapper,
    "textarea": textarea_1.TextareaWrapper,
    "progress": progress_bar_1.ProgressBarWrapper,
    "img": image_1.ImageWrapper,
    // 列表
    "ul": listview_1.ListViewWrapper,
    "li": listview_1.ListViewWrapper,
    // 富文本
    "article": textblock_1.TextBlockWrapper,
    "code": textblock_1.TextBlockWrapper,
    "mark": textblock_1.TextBlockWrapper,
    "a": textblock_1.TextBlockWrapper,
    "strong": textblock_1.TextBlockWrapper,
    "em": textblock_1.TextBlockWrapper,
    "del": textblock_1.TextBlockWrapper,
    // input
    "input": input_1.InputWrapper,
    // Text
    "span": textblock_1.TextBlockWrapper,
    "p": textblock_1.TextBlockWrapper,
    "text": textblock_1.TextBlockWrapper,
    "label": textblock_1.TextBlockWrapper,
    "h1": textblock_1.TextBlockWrapper,
    "h2": textblock_1.TextBlockWrapper,
    "h3": textblock_1.TextBlockWrapper,
    "h4": textblock_1.TextBlockWrapper,
    "h5": textblock_1.TextBlockWrapper,
    "h6": textblock_1.TextBlockWrapper,
    // container
    "div": container_1.ContainerWrapper,
    "view": container_1.ContainerWrapper,
    "canvas": container_1.ContainerWrapper,
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
        if (wrapper instanceof common_wrapper_1.ComponentWrapper) {
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