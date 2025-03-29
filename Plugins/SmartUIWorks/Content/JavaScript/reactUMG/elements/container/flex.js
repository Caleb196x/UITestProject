"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexWrapper = void 0;
const common_wrapper_1 = require("../common_wrapper");
const UE = require("ue");
const container_1 = require("./container");
const common_utils_1 = require("../common_utils");
class FlexWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    flexDirection;
    containerType;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = container_1.UMGContainerType.HorizontalBox;
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        let flexDirection = this.containerStyle?.flexDirection;
        const flexFlow = this.containerStyle?.flexFlow;
        if (flexFlow) {
            const flexFlowArray = flexFlow.split(' ');
            if (flexFlowArray.length === 2) {
                flexDirection = flexFlowArray[0];
            }
        }
        else if (!flexDirection) {
            flexDirection = 'row'; // 默认值
        }
        this.flexDirection = flexDirection;
        const reverse = flexDirection === 'row-reverse' || flexDirection === 'column-reverse';
        let widget;
        // Convert to appropriate UMG container based on style
        if (flexDirection === 'row' || flexDirection === 'row-reverse') {
            widget = new UE.HorizontalBox();
            this.containerType = container_1.UMGContainerType.HorizontalBox;
        }
        else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
            widget = new UE.VerticalBox();
            this.containerType = container_1.UMGContainerType.VerticalBox;
        }
        if (reverse) {
            widget.FlowDirectionPreference = UE.EFlowDirectionPreference.RightToLeft;
        }
        return widget;
    }
    setupAlignment(Slot, childStyle) {
        const style = this.containerStyle || {};
        const justifyContent = style?.justifyContent || 'flex-start';
        const alignItems = style?.alignItems || 'stretch';
        let rowReverse = this.flexDirection === 'row-reverse';
        const flexValue = childStyle?.flex || 0;
        const alignSelf = childStyle?.alignSelf;
        const justifySelf = childStyle?.justifySelf;
        // Set horizontal alignment based on justifyContent
        const hStartHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };
        const hEndHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };
        const hCenterHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const hStretchHorizontalAlignmentFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const hSpaceBetweenSetAlginFunc = (horizontalBoxSlot) => {
            horizontalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };
        const horizontalAlignmentActionMap = {
            'flex-start': hStartHorizontalAlignmentFunc,
            'flex-end': hEndHorizontalAlignmentFunc,
            'left': hStartHorizontalAlignmentFunc,
            'right': hEndHorizontalAlignmentFunc,
            'start': hStartHorizontalAlignmentFunc,
            'end': hEndHorizontalAlignmentFunc,
            'center': hCenterHorizontalAlignmentFunc,
            'stretch': hStretchHorizontalAlignmentFunc,
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
        const vStartVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const vEndVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const vCenterVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const vStretchVerticalAlignmentFunc = (verticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const verticalAlignmentActionMap = {
            'flex-start': vStartVerticalAlignmentFunc,
            'flex-end': vEndVerticalAlignmentFunc,
            'start': vStartVerticalAlignmentFunc,
            'end': vEndVerticalAlignmentFunc,
            'left': vStartVerticalAlignmentFunc,
            'right': vEndVerticalAlignmentFunc,
            'center': vCenterVerticalAlignmentFunc,
            'stretch': vStretchVerticalAlignmentFunc,
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
            if (justifyContent?.includes('space-between')) {
                hSpaceBetweenSetAlginFunc(horizontalBoxSlot);
            }
            const hAlignSelfValue = alignSelf?.split(' ').find(v => hAlignSelfActionMap[v]);
            if (hAlignSelfValue) {
                hAlignSelfActionMap[hAlignSelfValue](horizontalBoxSlot);
            }
            else {
                const hAlignItems = alignItems?.split(' ').find(v => verticalAlignmentActionMap[v]);
                if (hAlignItems) {
                    verticalAlignmentActionMap[hAlignItems](horizontalBoxSlot);
                }
            }
        }
        else if (this.containerType === container_1.UMGContainerType.VerticalBox) {
            const verticalBoxSlot = Slot;
            if (justifyContent == 'space-between') {
                vSpaceBetweenSetAlginFunc(verticalBoxSlot);
            }
            const vAlignSelfValue = justifySelf?.split(' ').find(v => vAlignSelfActionMap[v]);
            if (vAlignSelfValue) {
                vAlignSelfActionMap[vAlignSelfValue](verticalBoxSlot);
            }
            else {
                const vAlignItems = alignItems?.split(' ').find(v => horizontalAlignmentActionMap[v]);
                if (vAlignItems) {
                    horizontalAlignmentActionMap[vAlignItems](verticalBoxSlot);
                }
            }
        }
    }
    initSlot(Slot, childProps) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(childProps);
        this.setupAlignment(Slot, childStyle);
        // 对于容器来说，读取margin值
        let margin = (0, common_utils_1.convertMargin)(childStyle.margin, this.containerStyle);
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
        else if (this.containerType === container_1.UMGContainerType.StackBox) {
            const stackBox = parentItem;
            let stackBoxSlot = stackBox.AddChildToStackBox(childItem);
            this.initSlot(stackBoxSlot, childProps);
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
}
exports.FlexWrapper = FlexWrapper;
//# sourceMappingURL=flex.js.map