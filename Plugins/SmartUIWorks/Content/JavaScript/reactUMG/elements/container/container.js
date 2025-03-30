"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerWrapper = exports.UMGContainerType = void 0;
const UE = require("ue");
const common_wrapper_1 = require("../common_wrapper");
const common_utils_1 = require("../common_utils");
const color_parser_1 = require("../property/color_parser");
const wrapbox_1 = require("./wrapbox");
const gridpanel_1 = require("./gridpanel");
const scrollbox_1 = require("./scrollbox");
const flex_1 = require("./flex");
var UMGContainerType;
(function (UMGContainerType) {
    UMGContainerType[UMGContainerType["ScrollBox"] = 0] = "ScrollBox";
    UMGContainerType[UMGContainerType["GridPanel"] = 1] = "GridPanel";
    UMGContainerType[UMGContainerType["Flex"] = 2] = "Flex";
    UMGContainerType[UMGContainerType["HorizontalBox"] = 3] = "HorizontalBox";
    UMGContainerType[UMGContainerType["VerticalBox"] = 4] = "VerticalBox";
    UMGContainerType[UMGContainerType["WrapBox"] = 5] = "WrapBox";
    UMGContainerType[UMGContainerType["StackBox"] = 6] = "StackBox";
})(UMGContainerType || (exports.UMGContainerType = UMGContainerType = {}));
class ContainerWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    containerType;
    commonWrapper;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const display = this.containerStyle?.display || 'flex';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
        let widget;
        // Convert to appropriate UMG container based on style
        if (overflow !== 'visible' || overflowX !== 'visible' || overflowY !== 'visible') {
            let scrollBoxWrapper = new scrollbox_1.ScrollBoxWrapper(this.typeName, this.props);
            widget = scrollBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.ScrollBox;
            this.commonWrapper = scrollBoxWrapper;
        }
        else if (display === 'grid') {
            // grid panel
            let gridPanelWrapper = new gridpanel_1.GridPanelWrapper(this.typeName, this.props);
            widget = gridPanelWrapper.convertToWidget();
            this.containerType = UMGContainerType.GridPanel;
            this.commonWrapper = gridPanelWrapper;
        }
        else if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
            let wrapBoxWrapper = new wrapbox_1.WrapBoxWrapper(this.typeName, this.props);
            widget = wrapBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.WrapBox;
            this.commonWrapper = wrapBoxWrapper;
        }
        else {
            let flexWrapper = new flex_1.FlexWrapper(this.typeName, this.props);
            widget = flexWrapper.convertToWidget();
            this.containerType = UMGContainerType.HorizontalBox;
            this.commonWrapper = flexWrapper;
        }
        // widget = this.setupBorderAndBackground(widget, this.props);
        return widget;
    }
    setupVisibility(parentItem) {
        const visibility = this.containerStyle?.visibility || 'visible';
        if (visibility === 'hidden' || visibility === 'clip') {
            parentItem.SetClipping(UE.EWidgetClipping.ClipToBounds);
        }
    }
    setupChildSize(Item, Props) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        const width = childStyle?.width || 'auto';
        const height = childStyle?.height || 'auto';
        if (width === 'auto' && height === 'auto') {
            return Item;
        }
        else {
            const sizeBox = new UE.SizeBox();
            if (width !== 'auto') {
                sizeBox.SetWidthOverride((0, common_utils_1.convertLengthUnitToSlateUnit)(width, childStyle));
            }
            if (height !== 'auto') {
                sizeBox.SetHeightOverride((0, common_utils_1.convertLengthUnitToSlateUnit)(height, childStyle));
            }
            const maxWidth = this.containerStyle?.maxWidth;
            if (maxWidth) {
                sizeBox.SetMaxDesiredWidth((0, common_utils_1.convertLengthUnitToSlateUnit)(maxWidth, childStyle));
            }
            const maxHeight = this.containerStyle?.maxHeight;
            if (maxHeight) {
                sizeBox.SetMaxDesiredHeight((0, common_utils_1.convertLengthUnitToSlateUnit)(maxHeight, childStyle));
            }
            const minWidth = this.containerStyle?.minWidth;
            if (minWidth) {
                sizeBox.SetMinDesiredWidth((0, common_utils_1.convertLengthUnitToSlateUnit)(minWidth, childStyle));
            }
            const minHeight = this.containerStyle?.minHeight;
            if (minHeight) {
                sizeBox.SetMinDesiredHeight((0, common_utils_1.convertLengthUnitToSlateUnit)(minHeight, childStyle));
            }
            const aspectRatio = this.containerStyle?.aspectRatio;
            if (aspectRatio) {
                sizeBox.SetMaxAspectRatio((0, common_utils_1.parseAspectRatio)(aspectRatio));
                sizeBox.SetMinAspectRatio((0, common_utils_1.parseAspectRatio)(aspectRatio));
            }
            sizeBox.AddChild(Item);
            return sizeBox;
        }
    }
    setupChildScale(Item, Props) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        const objectFit = childStyle?.objectFit;
        if (objectFit) {
            const scaleBox = new UE.ScaleBox();
            if (objectFit === 'contain') {
                scaleBox.SetStretch(UE.EStretch.ScaleToFit);
            }
            else if (objectFit === 'cover') {
                scaleBox.SetStretch(UE.EStretch.ScaleToFill);
            }
            else if (objectFit === 'fill') {
                scaleBox.SetStretch(UE.EStretch.Fill);
            }
            else if (objectFit === 'none') {
                scaleBox.SetStretch(UE.EStretch.None);
            }
            else if (objectFit === 'scale-down') {
                scaleBox.SetStretch(UE.EStretch.UserSpecifiedWithClipping);
                const scale = childStyle?.scale;
                if (scale) {
                    scaleBox.SetUserSpecifiedScale(parseFloat(scale));
                }
            }
            scaleBox.AddChild(Item);
            return scaleBox;
        }
        else {
            return Item;
        }
    }
    setupBackground(Item, style) {
        const parsedBackground = (0, common_utils_1.parseBackgroundProps)(style);
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
        borderWidget.SetDesiredSizeScale((0, common_utils_1.parseScale)(scale));
        // color
        const contentColor = style?.color;
        if (contentColor) {
            const color = (0, color_parser_1.parseColor)(contentColor);
            borderWidget.SetContentColorAndOpacity(new UE.LinearColor(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a));
        }
        borderWidget.AddChild(Item);
        return borderWidget;
    }
    setupBorder(Item, Props) {
        const borderWidget = new UE.Border();
        borderWidget.AddChild(Item);
        return borderWidget;
    }
    setupBorderAndBackground(Item, Props) {
        const style = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
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
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
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
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
}
exports.ContainerWrapper = ContainerWrapper;
//# sourceMappingURL=container.js.map