import { UMGContainerType } from "./container";
import { ComponentWrapper } from "../common_wrapper";
import * as UE from 'ue';
import { convertGap, convertMargin, mergeClassStyleAndInlineStyle } from "../common_utils";

export class ScrollBoxWrapper extends ComponentWrapper {
    private containerStyle: any;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }
  
    private setupScrollBox(scrollBox: UE.ScrollBox, isScrollX: boolean) {
        if (isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        } else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }

        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 12,
            'thin': 8
        }

        if (scrollbarWidth === 'none') {
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Collapsed);
        } else {
            if (scrollbarWidth in scrollbarLevel) {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel[scrollbarWidth], scrollbarLevel[scrollbarWidth]));
            } else if (scrollbarWidth.endsWith('px')) {
                // Extract the numeric part by removing the 'px' suffix
                const numericWidth = parseInt(scrollbarWidth.slice(0, -2));
                let thickness = new UE.Vector2D(numericWidth, numericWidth);
                scrollBox.SetScrollbarThickness(thickness);
            } else {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel['auto'], scrollbarLevel['auto']));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }

        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding(convertMargin(scrollPadding, this.containerStyle));
        scrollBox.SetAlwaysShowScrollbar(true);
    }

    
    private setupAlignment(Slot: UE.PanelSlot, childStyle: any) {
        const style = this.containerStyle || {};
        const display = style?.display;
        let rowReverse = display === 'row-reverse';
        const alignSelf = childStyle?.alignSelf || 'stretch';
        const justifySelf = childStyle?.justifySelf || 'stretch';

        const scrollBoxStretchHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        }

        const scrollBoxLeftHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
        }

        const scrollBoxRightHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
        }

        const scrollBoxCenterHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        }

        const scrollBoxStretchVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        }

        const scrollBoxTopVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        }

        const scrollBoxBottomVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        }

        const scrollBoxCenterVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => { 
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        }

        const scrollBoxJustifySelfActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        }

        const scrollBoxAlignSelfActionMap = {
            'stretch': scrollBoxStretchVerticalAlignmentFunc,
            'top': scrollBoxTopVerticalAlignmentFunc,
            'bottom': scrollBoxBottomVerticalAlignmentFunc,
            'center': scrollBoxCenterVerticalAlignmentFunc,
            'start': scrollBoxTopVerticalAlignmentFunc,
            'end': scrollBoxBottomVerticalAlignmentFunc,
            'flex-start': scrollBoxTopVerticalAlignmentFunc,
            'flex-end': scrollBoxBottomVerticalAlignmentFunc,
        }
        const scrollBoxSlot = Slot as UE.ScrollBoxSlot;

        const scrollBoxJustifySelfValue = justifySelf?.split(' ').find(v => scrollBoxJustifySelfActionMap[v]);
        if (scrollBoxJustifySelfValue) {
            scrollBoxJustifySelfActionMap[scrollBoxJustifySelfValue](scrollBoxSlot);
        }

        const scrollBoxAlignSelfValue = alignSelf?.split(' ').find(v => scrollBoxAlignSelfActionMap[v]);
        if (scrollBoxAlignSelfValue) {
            scrollBoxAlignSelfActionMap[scrollBoxAlignSelfValue](scrollBoxSlot);
        }
    }
    
    private initScrollBoxSlot(scrollBox: UE.ScrollBox, Slot: UE.PanelSlot, childProps: any) {
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

    override convertToWidget(): UE.Widget {
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);
        const scrollBox = new UE.ScrollBox();
        this.setupScrollBox(scrollBox,
             this.containerStyle?.overflowX === 'scroll' || this.containerStyle?.overflowX === 'auto'
        );
        return scrollBox;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        return true;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        let scrollBox = parentItem as UE.ScrollBox;
        let scrollBoxSlot = scrollBox.AddChild(childItem);
        this.initScrollBoxSlot(scrollBox, scrollBoxSlot, childProps);
    }
}
