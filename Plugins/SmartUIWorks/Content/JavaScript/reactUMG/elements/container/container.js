"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerWrapper = exports.UMGContainerType = void 0;
const UE = require("ue");
const common_wrapper_1 = require("../common_wrapper");
const common_utils_1 = require("../common_utils");
const color_parser_1 = require("../parser/color_parser");
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
    commonWrapper;
    originWidget;
    extraBoxSlot;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const display = this.containerStyle?.display || 'flex';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        let widget;
        // Convert to appropriate UMG container based on style
        if (overflow !== 'visible' || overflowX !== 'visible' || overflowY !== 'visible') {
            let scrollBoxWrapper = new scrollbox_1.ScrollBoxWrapper(this.typeName, this.props);
            widget = scrollBoxWrapper.convertToWidget();
            this.commonWrapper = scrollBoxWrapper;
        }
        else if (display === 'grid') {
            // grid panel
            let gridPanelWrapper = new gridpanel_1.GridPanelWrapper(this.typeName, this.props);
            widget = gridPanelWrapper.convertToWidget();
            this.commonWrapper = gridPanelWrapper;
        }
        else {
            let flexWrapper = new flex_1.FlexWrapper(this.typeName, this.props);
            widget = flexWrapper.convertToWidget();
            this.commonWrapper = flexWrapper;
        }
        this.originWidget = widget;
        widget = this.setupWrapBox(widget);
        widget = this.setupBorderAndBackground(widget);
        widget = this.setupBoxSize(widget);
        widget = this.setupBoxScale(widget);
        return widget;
    }
    setupVisibility(parentItem) {
        const visibility = this.containerStyle?.visibility || 'visible';
        if (visibility === 'hidden' || visibility === 'clip') {
            parentItem.SetClipping(UE.EWidgetClipping.ClipToBounds);
        }
    }
    setupBoxSize(Item, Props) {
        let childStyle = {};
        if (!Props) {
            childStyle = this.containerStyle;
        }
        else {
            childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        }
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
            this.extraBoxSlot = sizeBox.AddChild(Item);
            return sizeBox;
        }
    }
    setupBoxScale(Item, Props) {
        let childStyle = {};
        if (!Props) {
            childStyle = this.containerStyle;
        }
        else {
            childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        }
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
                    scaleBox.SetUserSpecifiedScale((0, common_utils_1.safeParseFloat)(scale));
                }
            }
            this.extraBoxSlot = scaleBox.AddChild(Item);
            return scaleBox;
        }
        else {
            return Item;
        }
    }
    setupWrapBox(Item, Props) {
        let childStyle = {};
        if (!Props) {
            childStyle = this.containerStyle;
        }
        else {
            childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        }
        const flexWrap = childStyle?.flexWrap || 'nowrap';
        if (flexWrap !== 'wrap' || flexWrap !== 'wrap-reverse') {
            return Item;
        }
        const wrapBox = new UE.WrapBox();
        const flexDirection = childStyle?.flexDirection;
        const gap = childStyle?.gap;
        wrapBox.Orientation =
            (flexDirection === 'column' || flexDirection === 'column-reverse')
                ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;
        wrapBox.SetInnerSlotPadding((0, common_utils_1.convertGap)(gap, childStyle));
        const justifyItemsActionMap = {
            'flex-start': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'flex-end': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'start': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'left': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'right': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => wrapBox.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        };
        // WrapBox中定义的justifyItems决定了子元素的对齐方式
        const justifyItems = this.containerStyle?.justifyItems;
        if (justifyItems) {
            justifyItems.split(' ')
                .filter(value => justifyItemsActionMap[value])
                .forEach(value => justifyItemsActionMap[value]());
        }
        this.extraBoxSlot = wrapBox.AddChild(Item);
        return wrapBox;
    }
    setupBackground(Item, style) {
        const parsedBackground = (0, common_utils_1.parseBackgroundProps)(style);
        // 将background转换为image, repeat, color, position等内容
        let useBorder = false;
        const borderWidget = new UE.Border();
        if (parsedBackground?.image) {
            borderWidget.SetBrush(parsedBackground.image);
            useBorder = true;
        }
        if (parsedBackground?.color) {
            borderWidget.SetBrushColor(parsedBackground.color);
            useBorder = true;
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
        if (useBorder) {
            this.extraBoxSlot = borderWidget.AddChild(Item);
        }
        else {
            return Item;
        }
        return borderWidget;
    }
    setupBorder(Item, Props) {
        const borderWidget = new UE.Border();
        this.extraBoxSlot = borderWidget.AddChild(Item);
        return borderWidget;
    }
    setupBorderAndBackground(Item, Props) {
        let childStyle = {};
        if (!Props) {
            childStyle = this.containerStyle;
        }
        else {
            childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(Props);
        }
        const background = childStyle?.background;
        const backgroundColor = childStyle?.backgroundColor;
        const backgroundImage = childStyle?.backgroundImage;
        const backgroundPosition = childStyle?.backgroundPosition;
        const usingBackground = backgroundColor || backgroundImage || backgroundPosition || background;
        if (usingBackground) {
            return this.setupBackground(Item, childStyle);
        }
        return Item;
    }
    setupChildAlignment(props) {
        if (props && this.extraBoxSlot) {
            const Style = (0, common_utils_1.mergeClassStyleAndInlineStyle)(props);
            const childAlignment = (0, common_utils_1.parseChildAlignment)(Style);
            if (this.extraBoxSlot instanceof UE.SizeBoxSlot) {
                this.extraBoxSlot.SetHorizontalAlignment(childAlignment.horizontal);
                this.extraBoxSlot.SetVerticalAlignment(childAlignment.vertical);
                this.extraBoxSlot.SetPadding(childAlignment.padding);
            }
            else if (this.extraBoxSlot instanceof UE.ScaleBoxSlot) {
                this.extraBoxSlot.SetHorizontalAlignment(childAlignment.horizontal);
                this.extraBoxSlot.SetVerticalAlignment(childAlignment.vertical);
                this.extraBoxSlot.SetPadding(childAlignment.padding);
            }
            else if (this.extraBoxSlot instanceof UE.BorderSlot) {
                this.extraBoxSlot.SetHorizontalAlignment(childAlignment.horizontal);
                this.extraBoxSlot.SetVerticalAlignment(childAlignment.vertical);
                this.extraBoxSlot.SetPadding(childAlignment.padding);
            }
            else if (this.extraBoxSlot instanceof UE.WrapBoxSlot) {
                this.extraBoxSlot.SetHorizontalAlignment(childAlignment.horizontal);
                this.extraBoxSlot.SetVerticalAlignment(childAlignment.vertical);
                this.extraBoxSlot.SetPadding(childAlignment.padding);
            }
        }
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        // 1. 设置父容器的clip属性
        // 2. 根据width, height添加size box并设置大小
        // 3. 根据objectFit添加scale box并设置缩放
        // 4. 添加background
        if (!childItem) {
            console.warn(`childItem ${childItemTypeName} is null, can not append to container: ${this.typeName}`);
            return;
        }
        this.setupVisibility(parentItem);
        this.setupChildAlignment(childProps);
        this.commonWrapper.appendChildItem(this.originWidget, childItem, childItemTypeName, childProps);
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
}
exports.ContainerWrapper = ContainerWrapper;
//# sourceMappingURL=container.js.map