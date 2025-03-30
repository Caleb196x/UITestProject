import * as UE from 'ue';
import { ComponentWrapper } from "../common_wrapper";
import { convertLengthUnitToSlateUnit, 
    mergeClassStyleAndInlineStyle, 
    parseAspectRatio, parseBackgroundProps, 
    parseBackgroundColor, parseScale,
    parseBackgroundImage } from '../common_utils';
import { parseColor } from '../property/color_parser';
import { WrapBoxWrapper } from './wrapbox';
import { GridPanelWrapper } from './gridpanel';
import { ScrollBoxWrapper } from './scrollbox';
import { FlexWrapper } from './flex';

export enum UMGContainerType {
    ScrollBox,
    GridPanel,
    Flex,
    HorizontalBox,
    VerticalBox,
    WrapBox, 
    StackBox
}

export class ContainerWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    private commonWrapper: ComponentWrapper;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }

    override convertToWidget(): UE.Widget { 
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);

        const display = this.containerStyle?.display || 'flex';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (overflow !== 'visible' || overflowX !== 'visible' || overflowY !== 'visible') {

            let scrollBoxWrapper = new ScrollBoxWrapper(this.typeName, this.props);
            widget = scrollBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.ScrollBox;
            this.commonWrapper = scrollBoxWrapper;

        } else if (display === 'grid') {

            // grid panel
            let gridPanelWrapper = new GridPanelWrapper(this.typeName, this.props);
            widget = gridPanelWrapper.convertToWidget();
            this.containerType = UMGContainerType.GridPanel;
            this.commonWrapper = gridPanelWrapper;

        } else if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {

            let wrapBoxWrapper = new WrapBoxWrapper(this.typeName, this.props);
            widget = wrapBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.WrapBox;
            this.commonWrapper = wrapBoxWrapper;

        } else {
            let flexWrapper = new FlexWrapper(this.typeName, this.props);
            widget = flexWrapper.convertToWidget();
            this.containerType = UMGContainerType.HorizontalBox;
            this.commonWrapper = flexWrapper;
        }

        // widget = this.setupBorderAndBackground(widget, this.props);

        return widget;
    }

    private setupVisibility(parentItem: UE.Widget) {
        const visibility = this.containerStyle?.visibility || 'visible';
        if (visibility === 'hidden' || visibility === 'clip') {
            parentItem.SetClipping(UE.EWidgetClipping.ClipToBounds);
        }
    }

    private setupChildSize(Item: UE.Widget, Props?: any): UE.Widget {
        const childStyle = mergeClassStyleAndInlineStyle(Props);
        const width = childStyle?.width || 'auto';
        const height = childStyle?.height || 'auto';

        if (width === 'auto' && height === 'auto') {
            return Item;
        } else {
            const sizeBox = new UE.SizeBox();
            if (width !== 'auto') {
                sizeBox.SetWidthOverride(convertLengthUnitToSlateUnit(width, childStyle));
            }

            if (height !== 'auto') {
                sizeBox.SetHeightOverride(convertLengthUnitToSlateUnit(height, childStyle));
            }

            const maxWidth = this.containerStyle?.maxWidth;
            if (maxWidth) {
                sizeBox.SetMaxDesiredWidth(convertLengthUnitToSlateUnit(maxWidth, childStyle));
            }
            
            const maxHeight = this.containerStyle?.maxHeight;
            if (maxHeight) {
                sizeBox.SetMaxDesiredHeight(convertLengthUnitToSlateUnit(maxHeight, childStyle));
            }

            const minWidth = this.containerStyle?.minWidth;
            if (minWidth) {
                sizeBox.SetMinDesiredWidth(convertLengthUnitToSlateUnit(minWidth, childStyle));
            }

            const minHeight = this.containerStyle?.minHeight;
            if (minHeight) {
                sizeBox.SetMinDesiredHeight(convertLengthUnitToSlateUnit(minHeight, childStyle));
            }

            const aspectRatio = this.containerStyle?.aspectRatio;
            if (aspectRatio) {
                sizeBox.SetMaxAspectRatio(parseAspectRatio(aspectRatio));
                sizeBox.SetMinAspectRatio(parseAspectRatio(aspectRatio));
            }

            sizeBox.AddChild(Item);
            return sizeBox;
        }
    }

    private setupChildScale(Item: UE.Widget, Props?: any): UE.Widget {
        const childStyle = mergeClassStyleAndInlineStyle(Props);
        const objectFit = childStyle?.objectFit;
        if (objectFit) {
            const scaleBox = new UE.ScaleBox();
            if (objectFit === 'contain') {
                scaleBox.SetStretch(UE.EStretch.ScaleToFit)
            } else if (objectFit === 'cover') {
                scaleBox.SetStretch(UE.EStretch.ScaleToFill);
            } else if (objectFit === 'fill') {
                scaleBox.SetStretch(UE.EStretch.Fill);
            } else if (objectFit === 'none') {
                scaleBox.SetStretch(UE.EStretch.None);
            } else if (objectFit === 'scale-down') {
                scaleBox.SetStretch(UE.EStretch.UserSpecifiedWithClipping);
                const scale = childStyle?.scale;
                if (scale) {
                    scaleBox.SetUserSpecifiedScale(parseFloat(scale));
                }
            }
            scaleBox.AddChild(Item);
            return scaleBox;
        } else {
            return Item;
        }
    }

    private setupBackground(Item: UE.Widget, style?: any): UE.Widget {

        const parsedBackground = parseBackgroundProps(style);
        // 将background转换为image, repeat, color, position等内容

        const borderWidget = new UE.Border();
        if (parsedBackground?.image) {
            borderWidget.SetBrush(parsedBackground.image);
        }
        if (parsedBackground?.color) {
            borderWidget.SetBrushColor(parsedBackground.color);
        }

        if (parsedBackground?.alignment) {
            borderWidget.SetVerticalAlignment(parsedBackground.alignment?.vertical);
            borderWidget.SetHorizontalAlignment(parsedBackground.alignment?.horizontal);
            borderWidget.SetPadding(parsedBackground.alignment?.padding);
        }

        const scale = style?.scale;
        borderWidget.SetDesiredSizeScale(parseScale(scale));
        
        // color
        const contentColor = style?.color;
        if (contentColor) {
            const color = parseColor(contentColor);
            borderWidget.SetContentColorAndOpacity(
                new UE.LinearColor(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a)
            );
        }

        borderWidget.AddChild(Item);

        return borderWidget;
    }

    private setupBorder(Item: UE.Widget, Props?: any): UE.Widget {
        const borderWidget = new UE.Border();
        borderWidget.AddChild(Item);
        return borderWidget;
    }

    private setupBorderAndBackground(Item: UE.Widget, Props?: any): UE.Widget {
        const style = mergeClassStyleAndInlineStyle(Props);
        const background = style?.background;
        const backgroundColor = style?.backgroundColor;
        const backgroundImage = style?.backgroundImage;
        const backgroundPosition = style?.backgroundPosition;

        const usingBackground = backgroundColor || backgroundImage || backgroundPosition || background;
        
        if (usingBackground) {
            return this.setupBackground(Item, style);
        }

        return Item;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        // 1. 设置父容器的clip属性
        // 2. 根据width, height添加size box并设置大小
        // 3. 根据objectFit添加scale box并设置缩放
        // 4. 添加background
        this.setupVisibility(parentItem);
        childItem = this.setupChildSize(childItem, childProps);
        childItem = this.setupChildScale(childItem, childProps);
        childItem = this.setupBorderAndBackground(childItem, childProps);
        this.commonWrapper.appendChildItem(parentItem, childItem, childItemTypeName, childProps);
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }
}