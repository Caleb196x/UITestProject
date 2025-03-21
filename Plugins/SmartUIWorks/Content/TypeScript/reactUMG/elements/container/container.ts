import * as UE from 'ue';
import { ComponentWrapper } from "../common_wrapper";
import { convertCssToStyles } from 'reactUMG/css_converter';
import { mergeClassStyleAndInlineStyle } from '../common_utils';

export enum UMGContainerType {
    ScrollBox,
    GridPanel, 
    HorizontalBox,
    VerticalBox,
    WrapBox
}

export class ContainerWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
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
        scrollBox.SetScrollbarPadding(this.convertMargin(scrollPadding));
        scrollBox.SetAlwaysShowScrollbar(true);
    }

    override convertToWidget(): UE.Widget { 
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);

        const display = this.containerStyle?.display || 'flex';
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';

        // todo@Caleb196x: 处理flex-flow参数

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto' ||
            overflowX === 'scroll' || overflowX === 'auto' ||
            overflowY === 'scroll' || overflowY === 'auto'
        ) {
            widget = new UE.ScrollBox();
            this.containerType = UMGContainerType.ScrollBox;
            this.setupScrollBox(widget as UE.ScrollBox,
                 overflowX === 'scroll' || overflowX === 'auto'
            );
        } else if (display === 'grid') {
            // grid panel
            widget = new UE.GridPanel();
            this.containerType = UMGContainerType.GridPanel;
            // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
            this.setupGridRowAndColumns(widget as UE.GridPanel);
            
        } else if (display === 'flex') {
            const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
            if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
                widget = new UE.WrapBox();
                this.containerType = UMGContainerType.WrapBox;
                let wrapBox = widget as UE.WrapBox;

                wrapBox.Orientation = 
                    (flexDirection === 'column'|| flexDirection === 'column-reverse')
                    ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;

            } else if (flexDirection === 'row' || flexDirection === 'row-reverse') {

                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;

            } else if (flexDirection === 'column' || flexDirection === 'column-reverse') {

                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;

            }
        } else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = UMGContainerType.VerticalBox;
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
        } else if (this.containerType === UMGContainerType.ScrollBox) {
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
    }

    private initSlot(Slot: UE.PanelSlot, childProps: any) {
        const childStyle = this.mergeClassStyleAndInlineStyle(childProps);
        this.setupAlignment(Slot, childStyle);
        let gapPadding = this.convertGap(this.containerStyle?.gap);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = this.convertMargin(childStyle.margin); 
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;

        (Slot as any).SetPadding(margin);
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        const backgroundImage = this.containerStyle?.backgroundImage;
        const backgroundColor = this.containerStyle?.backgroundColor;
        if (backgroundImage || backgroundColor) {
            let border = new UE.Border();
            // todo@Caleb196x: 加载图片
            border.SetBrush(backgroundImage);
            border.AddChild(childItem);
            childItem = border;
        }

        const addChildActionMap = {
            [UMGContainerType.HorizontalBox]: (horizontalBox: UE.HorizontalBox, childItem: UE.Widget) => {
                let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
                this.initSlot(horizontalBoxSlot, childProps);
            },
            [UMGContainerType.VerticalBox]: (verticalBox: UE.VerticalBox, childItem: UE.Widget) => {
                let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
                this.initSlot(verticalBoxSlot, childProps);
            },
            [UMGContainerType.WrapBox]: (wrapBox: UE.WrapBox, childItem: UE.Widget) => {
                let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
                this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
            },

            [UMGContainerType.ScrollBox]: (scrollBox: UE.ScrollBox, childItem: UE.Widget) => {
                let scrollBoxSlot = scrollBox.AddChild(childItem);
                this.initSlot(scrollBoxSlot, childProps);
            }
        };

        if (this.containerType in addChildActionMap) {
            addChildActionMap[this.containerType](parentItem as any, childItem);
        }
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }
}