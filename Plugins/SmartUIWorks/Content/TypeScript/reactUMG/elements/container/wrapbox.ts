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
        const margin = childProps?.margin;
        if (margin) {
            Slot.SetPadding(convertMargin(margin, this.containerStyle));
        }
    }

    override convertToWidget(): UE.Widget {
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        const gap = this.containerStyle?.gap;        
        const wrapBox = new UE.WrapBox();
        this.containerType = UMGContainerType.WrapBox;

        wrapBox.Orientation = 
            (flexDirection === 'column'|| flexDirection === 'column-reverse')
            ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;

        wrapBox.SetInnerSlotPadding(convertGap(gap, this.containerStyle));

        const justifyItemsActionMap = {
            'flex-start': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'flex-end': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'start': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'left': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'right': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        }

        // WrapBox中定义的justifyItems决定了子元素的对齐方式
        const justifyItems = this.containerStyle?.justifyItems;
        if (justifyItems) {
            justifyItems.split(' ')
                .filter(value => justifyItemsActionMap[value])
                .forEach(value => justifyItemsActionMap[value]());
        }
        
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
