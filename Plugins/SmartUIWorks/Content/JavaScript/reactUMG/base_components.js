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
const canvas_1 = require("./elements/container/canvas");
const overlay_1 = require("./elements/overlay");
const scalebox_1 = require("./elements/scalebox");
const uniform_grid_1 = require("./elements/uniform_grid");
const invalidation_box_1 = require("./elements/invalidation_box");
const retainer_box_1 = require("./elements/retainer_box");
const safezone_1 = require("./elements/safezone");
const sizebox_1 = require("./elements/sizebox");
const border_1 = require("./elements/border");
const expandable_area_1 = require("./elements/expandable_area");
const throbber_1 = require("./elements/throbber");
const circular_throbber_1 = require("./elements/circular_throbber");
const spacer_1 = require("./elements/spacer");
const slider_1 = require("./elements/slider");
const radial_slider_1 = require("./elements/radial_slider");
const spinbox_1 = require("./elements/spinbox");
const combo_box_1 = require("./elements/combo_box");
const spine_1 = require("./elements/spine");
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
    "canvas": canvas_1.CanvasWrapper,
    "Overlay": overlay_1.OverlayWrapper,
    "ScaleBox": scalebox_1.ScaleBoxWrapper,
    "UniformGrid": uniform_grid_1.UniformGridWrapper,
    "InvalidationBox": invalidation_box_1.InvalidationBoxWrapper,
    "RetainerBox": retainer_box_1.RetainerBoxWrapper,
    "SafeZone": safezone_1.SafeZoneWrapper,
    "SizeBox": sizebox_1.SizeBoxWrapper,
    "Border": border_1.BorderWrapper,
    "CircularThrobber": circular_throbber_1.CircularThrobberWrapper,
    "Throbber": throbber_1.ThrobberWrapper,
    "Spacer": spacer_1.SpacerWrapper,
    "ExpandableArea": expandable_area_1.ExpandableAreaWrapper,
    "RadialSlider": radial_slider_1.RadialSliderWrapper,
    "Slider": slider_1.SliderWrapper,
    "SpinBox": spinbox_1.SpinBoxWrapper,
    "Button": button_1.ButtonWrapper,
    "ComboBox": combo_box_1.ComboBoxWrapper,
    "Spine": spine_1.SpineWrapper,
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