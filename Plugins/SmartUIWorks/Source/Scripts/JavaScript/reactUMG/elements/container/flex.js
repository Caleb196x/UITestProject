"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexWrapper = void 0;
const common_wrapper_1 = require("../common_wrapper");
const UE = require("ue");
const container_1 = require("./container");
const common_utils_1 = require("../common_utils");
class FlexWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    containerType;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = container_1.UMGContainerType.HorizontalBox;
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const display = this.containerStyle?.display || 'flex';
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        // todo@Caleb196x: 处理flex-flow参数
        let widget;
        // Convert to appropriate UMG container based on style
        if (display === 'flex') {
            if (flexDirection === 'row' || flexDirection === 'row-reverse') {
                widget = new UE.HorizontalBox();
                this.containerType = container_1.UMGContainerType.HorizontalBox;
            }
            else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
                widget = new UE.VerticalBox();
                this.containerType = container_1.UMGContainerType.VerticalBox;
            }
        }
        else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = container_1.UMGContainerType.VerticalBox;
        }
        return widget;
    }
    setupAlignment(Slot, childStyle) {
        const style = this.containerStyle || {};
        const justifyContent = childStyle?.justifyContent || style?.justifyContent || 'flex-start';
        const alignItems = childStyle?.alignItems || style?.alignItems || 'stretch';
        const display = style?.display;
        let rowReverse = display === 'row-reverse';
        const flexValue = childStyle?.flex || 0;
        const alignSelf = childStyle?.alignSelf || 'stretch';
        const justifySelf = childStyle?.justifySelf || 'stretch';
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
        if (this.containerType === container_1.UMGContainerType.HorizontalBox) {
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
        else if (this.containerType === container_1.UMGContainerType.VerticalBox) {
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
    }
    initSlot(Slot, childProps) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(childProps);
        this.setupAlignment(Slot, childStyle);
        let gapPadding = (0, common_utils_1.convertGap)(this.containerStyle?.gap, this.containerStyle);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = (0, common_utils_1.convertMargin)(childStyle.margin, this.containerStyle);
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;
        Slot.SetPadding(margin);
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        if (this.containerType === container_1.UMGContainerType.HorizontalBox) {
            const horizontalBox = parentItem;
            let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
            this.initSlot(horizontalBoxSlot, childProps);
        }
        else if (this.containerType === container_1.UMGContainerType.VerticalBox) {
            const verticalBox = parentItem;
            let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
            this.initSlot(verticalBoxSlot, childProps);
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
}
exports.FlexWrapper = FlexWrapper;
//# sourceMappingURL=flex.js.map