"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapBoxWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("../common_wrapper");
const container_1 = require("./container");
const common_utils_1 = require("../common_utils");
class WrapBoxWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    containerType;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = container_1.UMGContainerType.WrapBox;
    }
    initWrapBoxSlot(wrapBox, Slot, childProps) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding((0, common_utils_1.convertGap)(gap, this.containerStyle));
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
        Slot.SetPadding((0, common_utils_1.convertMargin)(margin, this.containerStyle));
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
        const wrapBox = new UE.WrapBox();
        this.containerType = container_1.UMGContainerType.WrapBox;
        wrapBox.Orientation =
            (flexDirection === 'column' || flexDirection === 'column-reverse')
                ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;
        return wrapBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        const wrapBox = parentItem;
        let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
        this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
    }
}
exports.WrapBoxWrapper = WrapBoxWrapper;
//# sourceMappingURL=wrapbox.js.map