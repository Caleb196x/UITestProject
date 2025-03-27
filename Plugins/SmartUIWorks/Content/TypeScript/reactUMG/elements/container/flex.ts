import { ComponentWrapper } from "../common_wrapper";
import * as UE from "ue";
import { UMGContainerType } from "./container";
import { convertGap, convertMargin, mergeClassStyleAndInlineStyle } from "../common_utils";

export class FlexWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }
    
    override convertToWidget(): UE.Widget { 
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);

        const display = this.containerStyle?.display || 'flex';
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        // todo@Caleb196x: 处理flex-flow参数

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (display === 'flex') {
            if (flexDirection === 'row' || flexDirection === 'row-reverse') {

                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;

            } else if (flexDirection === 'column' || flexDirection === 'column-reverse') {

                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;

            }
        } else if (display === 'block') {
            widget = new UE.StackBox();
            this.containerType = UMGContainerType.StackBox;
        }

        return widget;
    }
    
    private setupAlignment(Slot: UE.PanelSlot, childStyle: any) {
        const style = this.containerStyle || {};
        const justifyContent = childStyle?.justifyContent || style?.justifyContent || 'flex-start';
        const alignItems = childStyle?.alignItems || style?.alignItems || 'stretch';
        const display = style?.display;
        let rowReverse = display === 'row-reverse';
        const flexValue = childStyle?.flex || 0;
        const alignSelf = childStyle?.alignSelf || 'stretch';
        const justifySelf = childStyle?.justifySelf || 'stretch';

        // Set horizontal alignment based on justifyContent
        const hStartSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };
        const hEndSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };
        const hCenterSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const hStretchSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };

        const hSpaceBetweenSetAlginFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
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

        const hStartSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };

        const hEndSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };

        const hCenterSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };

        const hStretchSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
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
        }

        const vSpaceBetweenSetAlginFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };

        const vStartSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };

        const vEndSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };

        const vCenterSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };

        const vStretchSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
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
        
        const vStartSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };

        const vEndSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };

        const vCenterSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };

        const vStretchSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
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
        }

        if (this.containerType === UMGContainerType.HorizontalBox) {
            const horizontalBoxSlot = Slot as UE.HorizontalBoxSlot;

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
        } else if (this.containerType === UMGContainerType.VerticalBox) {
            const verticalBoxSlot = Slot as UE.VerticalBoxSlot;

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

    private initSlot(Slot: UE.PanelSlot, childProps: any) {
        const childStyle = mergeClassStyleAndInlineStyle(childProps);
        this.setupAlignment(Slot, childStyle);
        let gapPadding = convertGap(this.containerStyle?.gap, this.containerStyle);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = convertMargin(childStyle.margin, this.containerStyle); 
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;

        (Slot as any).SetPadding(margin);
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {

        if (this.containerType === UMGContainerType.HorizontalBox) {
            const horizontalBox = parentItem as UE.HorizontalBox;
            let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
            this.initSlot(horizontalBoxSlot, childProps);
        } else if (this.containerType === UMGContainerType.VerticalBox) {
            const verticalBox = parentItem as UE.VerticalBox;
            let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
            this.initSlot(verticalBoxSlot, childProps);
        }

    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }
}
