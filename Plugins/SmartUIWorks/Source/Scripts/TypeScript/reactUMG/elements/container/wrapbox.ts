import * as UE from 'ue';
import { ComponentWrapper } from '../common_wrapper';
import { UMGContainerType } from './container';
import { convertGap, convertMargin, mergeClassStyleAndInlineStyle } from '../common_utils';

export class WrapBoxWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.WrapBox;
    }

    private initWrapBoxSlot(wrapBox: UE.WrapBox, Slot: UE.WrapBoxSlot, childProps: any) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding(convertGap(gap, this.containerStyle));

        const justifyContentActionMap = {
            'flex-start': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Left,
            'flex-end': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Right,
            'center': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Center,
            'stretch': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Fill
        }

        // WrapBox中定义的justifyContent决定了子元素的对齐方式
        const justifyContent = this.containerStyle?.justifyContent;
        if (justifyContent) {
            justifyContent.split(' ')
                .filter(value => justifyContentActionMap[value])
                .forEach(value => justifyContentActionMap[value]());
        }

        const margin = this.containerStyle?.margin;
        Slot.SetPadding(convertMargin(margin, this.containerStyle));
    }

    override convertToWidget(): UE.Widget {
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);
        const flexDirection = this.containerStyle?.flexDirection || 'row';

        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
        const wrapBox = new UE.WrapBox();
        this.containerType = UMGContainerType.WrapBox;

        wrapBox.Orientation = 
            (flexDirection === 'column'|| flexDirection === 'column-reverse')
            ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;

        return wrapBox;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        return true;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        const wrapBox = parentItem as UE.WrapBox;
        let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
        this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
    }
}
