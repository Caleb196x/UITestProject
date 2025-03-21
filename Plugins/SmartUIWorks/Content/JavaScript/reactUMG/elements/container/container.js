"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("../common_wrapper");
const css_converter_1 = require("reactUMG/css_converter");
var UMGContainerType;
(function (UMGContainerType) {
    UMGContainerType[UMGContainerType["ScrollBox"] = 0] = "ScrollBox";
    UMGContainerType[UMGContainerType["GridPanel"] = 1] = "GridPanel";
    UMGContainerType[UMGContainerType["HorizontalBox"] = 2] = "HorizontalBox";
    UMGContainerType[UMGContainerType["VerticalBox"] = 3] = "VerticalBox";
    UMGContainerType[UMGContainerType["WrapBox"] = 4] = "WrapBox";
})(UMGContainerType || (UMGContainerType = {}));
class ContainerWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    containerType;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }
    // Helper method to parse grid template values
    parseGridTemplate(template) {
        const result = [];
        // Handle repeat syntax: repeat(3, 1fr)
        if (template.includes('repeat(')) {
            const repeatRegex = /repeat\((\d+),\s*([^)]+)\)/g;
            let match;
            while ((match = repeatRegex.exec(template)) !== null) {
                const count = parseInt(match[1], 10);
                const value = match[2].trim();
                // Create the specified number of identical definitions
                for (let i = 0; i < count; i++) {
                    result.push(this.parseGridValue(value));
                }
            }
        }
        else {
            // Handle normal space-separated values: 1fr auto 100px
            const values = template.split(/\s+/);
            for (const value of values) {
                result.push(this.parseGridValue(value));
            }
        }
        return result;
    }
    // Helper method to parse individual grid values
    parseGridValue(value) {
        if (value === 'auto') {
            return { type: 'auto', value: 0 };
        }
        // Match numeric value and unit
        const match = value.match(/^(\d*\.?\d+)([a-z%]*)$/);
        if (match) {
            let numValue = parseFloat(match[1]);
            const unit = match[2] || 'px';
            if (unit === 'em' || unit === 'rem') {
                numValue = numValue * 16;
            }
            // todo@Caleb196x: 需要知道父控件的宽度和长度所占像素值，然后根据px值转换成占比值fr
            return { type: unit, value: numValue };
        }
        // Default fallback
        return { type: 'fr', value: 1 };
    }
    setupGridRowAndColumns(gridPanel) {
        const gridTemplateColumns = this.containerStyle?.gridTemplateColumns;
        const gridTemplateRows = this.containerStyle?.gridTemplateRows;
        const gridTemplate = this.containerStyle?.gridTemplate;
        // todo@Caleb196x: 目前只处理gridTemplateColumns和gridTemplateRows两个参数
        // Parse gridTemplateColumns and gridTemplateRows
        if (gridTemplateColumns) {
            const columnDefinitions = this.parseGridTemplate(gridTemplateColumns);
            for (let i = 0; i < columnDefinitions.length; i++) {
                const columnDef = columnDefinitions[i];
                if (columnDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
                else if (columnDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetColumnFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
            }
        }
        if (gridTemplateRows) {
            const rowDefinitions = this.parseGridTemplate(gridTemplateRows);
            for (let i = 0; i < rowDefinitions.length; i++) {
                const rowDef = rowDefinitions[i];
                if (rowDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetRowFill(i, rowDef.value);
                }
                else if (rowDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetRowFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetRowFill(i, rowDef.value);
                }
            }
        }
    }
    setupScrollBox(scrollBox, isScrollX) {
        if (isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        }
        else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }
        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 12,
            'thin': 8
        };
        if (scrollbarWidth === 'none') {
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Collapsed);
        }
        else {
            if (scrollbarWidth in scrollbarLevel) {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel[scrollbarWidth], scrollbarLevel[scrollbarWidth]));
            }
            else if (scrollbarWidth.endsWith('px')) {
                // Extract the numeric part by removing the 'px' suffix
                const numericWidth = parseInt(scrollbarWidth.slice(0, -2));
                let thickness = new UE.Vector2D(numericWidth, numericWidth);
                scrollBox.SetScrollbarThickness(thickness);
            }
            else {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel['auto'], scrollbarLevel['auto']));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }
        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding(this.convertMargin(scrollPadding));
        scrollBox.SetAlwaysShowScrollbar(true);
    }
    mergeClassStyleAndInlineStyle(props) {
        let classNameStyles = {};
        if (props.className) {
            // Split multiple classes
            const classNames = props.className.split(' ');
            for (const className of classNames) {
                // Get styles associated with this class name
                const classStyle = (0, css_converter_1.convertCssToStyles)(getCssStyleForClass(className));
                // todo@Caleb196x: 解析classStyle
                if (classStyle) {
                    // Merge the class styles into our style object
                    classNameStyles = { ...classNameStyles, ...classStyle };
                }
            }
        }
        // Merge className styles with inline styles, giving precedence to inline styles
        const mergedStyle = { ...classNameStyles, ...(props.style || {}) };
        return mergedStyle;
    }
    convertToWidget() {
        this.containerStyle = this.mergeClassStyleAndInlineStyle(this.props);
        const display = this.containerStyle?.display || 'flex';
        const flexDirection = this.containerStyle?.flexDirection || 'row';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        // todo@Caleb196x: 处理flex-flow参数
        let widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto' ||
            overflowX === 'scroll' || overflowX === 'auto' ||
            overflowY === 'scroll' || overflowY === 'auto') {
            widget = new UE.ScrollBox();
            this.containerType = UMGContainerType.ScrollBox;
            this.setupScrollBox(widget, overflowX === 'scroll' || overflowX === 'auto');
        }
        else if (display === 'grid') {
            // grid panel
            widget = new UE.GridPanel();
            this.containerType = UMGContainerType.GridPanel;
            // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
            this.setupGridRowAndColumns(widget);
        }
        else if (display === 'flex') {
            const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
            if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
                widget = new UE.WrapBox();
                this.containerType = UMGContainerType.WrapBox;
                let wrapBox = widget;
                wrapBox.Orientation =
                    (flexDirection === 'column' || flexDirection === 'column-reverse')
                        ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;
            }
            else if (flexDirection === 'row' || flexDirection === 'row-reverse') {
                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;
            }
            else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;
            }
        }
        else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = UMGContainerType.VerticalBox;
        }
        return widget;
    }
    convertPixelToSU(pixel) {
        // todo@Caleb196x: 将react中的单位转换为SU单位(UMG中的单位值)
        // get font size of parent
        let fontSize = this.containerStyle?.fontSize || '16px';
        if (!fontSize.endsWith('px')) {
            fontSize = '16px';
        }
        const numSize = parseInt(fontSize.replace('px', ''));
        if (pixel.endsWith('px')) {
            const match = pixel.match(/(\d+)px/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        else if (pixel.endsWith('%')) {
            // todo@Caleb196x: 需要获取父元素的值
        }
        else if (pixel.endsWith('em')) {
            const match = pixel.match(/(\d+)em/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }
        else if (pixel.endsWith('rem')) {
            const match = pixel.match(/(\d+)rem/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }
        return 0;
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
        const scrollBoxStretchHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const scrollBoxLeftHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
        };
        const scrollBoxRightHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
        };
        const scrollBoxCenterHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const scrollBoxStretchVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const scrollBoxTopVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const scrollBoxBottomVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const scrollBoxCenterVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const scrollBoxJustifySelfActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        };
        const scrollBoxAlignSelfActionMap = {
            'stretch': scrollBoxStretchVerticalAlignmentFunc,
            'top': scrollBoxTopVerticalAlignmentFunc,
            'bottom': scrollBoxBottomVerticalAlignmentFunc,
            'center': scrollBoxCenterVerticalAlignmentFunc,
            'start': scrollBoxTopVerticalAlignmentFunc,
            'end': scrollBoxBottomVerticalAlignmentFunc,
            'flex-start': scrollBoxTopVerticalAlignmentFunc,
            'flex-end': scrollBoxBottomVerticalAlignmentFunc,
        };
        if (this.containerType === UMGContainerType.HorizontalBox) {
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
        else if (this.containerType === UMGContainerType.VerticalBox) {
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
        else if (this.containerType === UMGContainerType.ScrollBox) {
            const scrollBoxSlot = Slot;
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
    expandPaddingValues(paddingValues) {
        if (paddingValues.length === 2) {
            return [paddingValues[0], paddingValues[1], paddingValues[0], paddingValues[1]];
        }
        else if (paddingValues.length === 1) {
            return [paddingValues[0], paddingValues[0], paddingValues[0], paddingValues[0]];
        }
        else if (paddingValues.length === 3) {
            // padding: top right bottom
            return [paddingValues[0], paddingValues[1], paddingValues[2], paddingValues[1]];
        }
        return paddingValues;
    }
    convertMargin(margin) {
        if (!margin) {
            return new UE.Margin(0, 0, 0, 0);
        }
        const marginValues = margin.split(' ').map(v => {
            // todo@Caleb196x: 处理margin的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });
        let expandedMarginValues = this.expandPaddingValues(marginValues);
        // React Padding: top right bottom left
        // UMG Padding: Left, Top, Right, Bottom
        return new UE.Margin(expandedMarginValues[3], expandedMarginValues[0], expandedMarginValues[1], expandedMarginValues[2]);
    }
    convertGap(gap) {
        if (!gap) {
            return new UE.Vector2D(0, 0);
        }
        const gapValues = gap.split(' ').map(v => {
            // todo@Caleb196x: 处理react的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });
        if (gapValues.length === 2) {
            // gap: row column
            // innerSlotPadding: x(column) y(row)
            return new UE.Vector2D(gapValues[1], gapValues[0]);
        }
        return new UE.Vector2D(gapValues[0], gapValues[0]);
    }
    initSlot(Slot, childProps) {
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
        Slot.SetPadding(margin);
    }
    initWrapBoxSlot(wrapBox, Slot, childProps) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding(this.convertGap(gap));
        const justifyContentActionMap = {
            'flex-start': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Left,
            'flex-end': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Right,
            'center': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Center,
            'stretch': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Fill
        };
        // WrapBox中定义的justifyContent决定了子元素的对齐方式
        const justifyContent = this.containerStyle?.justifyContent;
        if (justifyContent) {
            justifyContent.split(' ')
                .filter(value => justifyContentActionMap[value])
                .forEach(value => justifyContentActionMap[value]());
        }
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
    }
    parseGridColumnOrRow(value) {
        const values = value.split('/').map(v => v.trim());
        if (values.length === 2) {
            let start = parseInt(values[0]);
            let end = parseInt(values[1]);
            if (end < start) {
                return [start, 0];
            }
            return [start, end - start];
        }
        return [0, 1];
    }
    setupGridItemLoc(GridSlot, childProps) {
        // 优先解析gridColumn和gridRow
        const gridColumn = childProps.style?.gridColumn;
        const gridRow = childProps.style?.gridRow;
        let columnStart = 0, columnSpan = 1;
        let rowStart = 0, rowSpan = 1;
        if (gridColumn) {
            const [start, span] = this.parseGridColumnOrRow(gridColumn);
            columnStart = start;
            columnSpan = span;
        }
        else {
            const gridColumnStart = childProps.style?.gridColumnStart;
            const gridColumnEnd = childProps.style?.gridColumnEnd;
            let start = parseInt(gridColumnStart);
            let end = parseInt(gridColumnEnd);
            if (end < start) {
                columnSpan = 0;
            }
            else {
                columnSpan = end - start;
            }
            columnStart = start;
        }
        if (gridRow) {
            const [start, span] = this.parseGridColumnOrRow(gridRow);
            rowStart = start;
            rowSpan = span;
        }
        else {
            const gridRowStart = childProps.style?.gridRowStart;
            const gridRowEnd = childProps.style?.gridRowEnd;
            let start = parseInt(gridRowStart);
            let end = parseInt(gridRowEnd);
            if (end < start) {
                rowSpan = 0;
            }
            else {
                rowSpan = end - start;
            }
            rowStart = start;
        }
        GridSlot.SetColumn(columnStart);
        GridSlot.SetColumnSpan(columnSpan);
        GridSlot.SetRow(rowStart);
        GridSlot.SetRowSpan(rowSpan);
    }
    setupGridAlignment(GridSlot, childProps) {
        const placeSelf = childProps.style?.placeSelf;
        let hAlign = 'stretch', vAlign = 'stretch';
        if (placeSelf) {
            const [h, v] = placeSelf.split(' ').map(v => v.trim());
            hAlign = h;
            vAlign = v;
        }
        else {
            const alignSelf = childProps.style?.alignSelf;
            const justifySelf = childProps.style?.justifySelf;
            if (alignSelf) {
                hAlign = alignSelf;
            }
            if (justifySelf) {
                vAlign = justifySelf;
            }
        }
        const hAlignActionMap = {
            'start': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        };
        const vAlignActionMap = {
            'start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill)
        };
        hAlignActionMap[hAlign]();
        vAlignActionMap[vAlign]();
    }
    initGridPanelSlot(gridPanel, Slot, childProps) {
        // todo@Caleb196x: 处理网格布局中的子元素位置
        this.setupGridItemLoc(Slot, childProps);
        this.setupGridAlignment(Slot, childProps);
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
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
            [UMGContainerType.HorizontalBox]: (horizontalBox, childItem) => {
                let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
                this.initSlot(horizontalBoxSlot, childProps);
            },
            [UMGContainerType.VerticalBox]: (verticalBox, childItem) => {
                let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
                this.initSlot(verticalBoxSlot, childProps);
            },
            [UMGContainerType.WrapBox]: (wrapBox, childItem) => {
                let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
                this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
            },
            [UMGContainerType.GridPanel]: (gridPanel, childItem) => {
                let gridSlot = gridPanel.AddChildToGrid(childItem);
                this.initGridPanelSlot(gridPanel, gridSlot, childProps);
            },
            [UMGContainerType.ScrollBox]: (scrollBox, childItem) => {
                let scrollBoxSlot = scrollBox.AddChild(childItem);
                this.initSlot(scrollBoxSlot, childProps);
            }
        };
        if (this.containerType in addChildActionMap) {
            addChildActionMap[this.containerType](parentItem, childItem);
        }
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.ContainerWrapper = ContainerWrapper;
//# sourceMappingURL=container.js.map